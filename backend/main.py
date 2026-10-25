import os
import sys
import io
import math
import base64
import glob
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import numpy as np
import cv2
from PIL import Image

# Ensure project root is in sys.path
sys_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if sys_path not in sys.path:
    sys.path.insert(0, sys_path)

from backend.services.open_meteo import fetch_indian_marine_weather
from backend.core.safety_engine import evaluate_marine_safety
from backend.core.config import INDIAN_COASTAL_ZONES
from backend.services.translator import nlp_engine
from backend.services.cerulean_service import fetch_live_cerulean_slicks, load_cached_global_spills
from backend.services.cv_inference_service import segment_oil_spill, detect_marine_debris

app = FastAPI(
    title="MarineGuardian API",
    version="2.0",
    description="Maritime safety, satellite SAR oil slick detection, and subsea computer vision intelligence API."
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static assets directory mounting
STATIC_DIR = os.path.join(sys_path, "frontend-react", "public")
WAVE_IMAGES_DIR = os.path.join(STATIC_DIR, "wave_images")
DATASET_DIR = os.path.join(sys_path, "dataset")

if os.path.exists(WAVE_IMAGES_DIR):
    app.mount("/static/wave_images", StaticFiles(directory=WAVE_IMAGES_DIR), name="wave_images")

DEBRIS_STATIC_DIR = os.path.join(STATIC_DIR, "debris")
if os.path.exists(DEBRIS_STATIC_DIR):
    app.mount("/static/debris", StaticFiles(directory=DEBRIS_STATIC_DIR), name="debris_static")

HSI_STATIC_DIR = os.path.join(STATIC_DIR, "hsi")
if os.path.exists(HSI_STATIC_DIR):
    app.mount("/static/hsi", StaticFiles(directory=HSI_STATIC_DIR), name="hsi_static")

# Dynamic State Language Mapping
STATE_DEFAULT_LANGUAGES = {
    "Gujarat": ["Hindi", "Gujarati"],
    "Maharashtra": ["Hindi", "Marathi"],
    "Goa": ["Hindi", "Marathi"],
    "Karnataka": ["Hindi", "Kannada"],
    "Kerala": ["Hindi", "Malayalam"],
    "Tamil Nadu": ["Hindi", "Tamil"],
    "Andhra Pradesh": ["Hindi", "Telugu"],
    "Odisha": ["Hindi", "Odia"],
    "West Bengal": ["Hindi", "Bengali"],
    "Andaman & Nicobar": ["Hindi", "Bengali", "Tamil"],
    "Lakshadweep": ["Hindi", "Malayalam"],
    "Puducherry": ["Hindi", "Tamil"],
}

def calculate_beaufort_scale(wind_kmh: float):
    knots = wind_kmh * 0.539957
    if knots < 1: return {"force": 0, "desc": "Calm", "sea_state": "Mirror-like calm sea"}
    elif knots <= 3: return {"force": 1, "desc": "Light Air", "sea_state": "Ripples without crests"}
    elif knots <= 6: return {"force": 2, "desc": "Light Breeze", "sea_state": "Small wavelets"}
    elif knots <= 10: return {"force": 3, "desc": "Gentle Breeze", "sea_state": "Large wavelets, crests break"}
    elif knots <= 16: return {"force": 4, "desc": "Moderate Breeze", "sea_state": "Small waves, frequent whitecaps"}
    elif knots <= 21: return {"force": 5, "desc": "Fresh Breeze", "sea_state": "Moderate waves, many whitecaps"}
    elif knots <= 27: return {"force": 6, "desc": "Strong Breeze", "sea_state": "Large waves, spray forming"}
    elif knots <= 33: return {"force": 7, "desc": "Near Gale", "sea_state": "Sea heaps up, white foam streaks"}
    elif knots <= 40: return {"force": 8, "desc": "Gale", "sea_state": "High waves, breaker crests break"}
    elif knots <= 47: return {"force": 9, "desc": "Strong Gale", "sea_state": "High waves, dense spray streaks"}
    else: return {"force": 10, "desc": "Storm / Severe Squall", "sea_state": "Very high waves with heavy overhang"}

def calculate_douglas_sea_state(wave_height_m: float):
    if wave_height_m == 0: return {"code": 0, "degree": "Calm (Glassy)", "height": "0 m"}
    elif wave_height_m <= 0.1: return {"code": 1, "degree": "Calm (Rippled)", "height": "0 - 0.1 m"}
    elif wave_height_m <= 0.5: return {"code": 2, "degree": "Smooth", "height": "0.1 - 0.5 m"}
    elif wave_height_m <= 1.25: return {"code": 3, "degree": "Slight", "height": "0.5 - 1.25 m"}
    elif wave_height_m <= 2.5: return {"code": 4, "degree": "Moderate", "height": "1.25 - 2.5 m"}
    elif wave_height_m <= 4.0: return {"code": 5, "degree": "Rough", "height": "2.5 - 4.0 m"}
    elif wave_height_m <= 6.0: return {"code": 6, "degree": "Very Rough", "height": "4.0 - 6.0 m"}
    elif wave_height_m <= 9.0: return {"code": 7, "degree": "High", "height": "6.0 - 9.0 m"}
    else: return {"code": 8, "degree": "Very High / Phenomenal", "height": "> 9.0 m"}

def get_wind_direction_compass(degrees: float) -> str:
    dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    ix = round(degrees / (360.0 / len(dirs)))
    return dirs[ix % len(dirs)]

@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "version": "2.0", "service": "MarineGuardian Maritime Intelligence"}

@app.get("/api/v1/stations")
def get_coastal_stations():
    stations_list = []
    for key, data in INDIAN_COASTAL_ZONES.items():
        stations_list.append({
            "id": key,
            "name": data.get("name", key.title()),
            "state": data.get("state", "India"),
            "lat": data.get("lat"),
            "lon": data.get("lon"),
            "region": data.get("region", "Coastal Sector"),
            "default_languages": STATE_DEFAULT_LANGUAGES.get(data.get("state", ""), ["Hindi", "Marathi"])
        })
    return {"stations": stations_list, "total": len(stations_list)}

@app.get("/api/v1/marine-safety")
def get_location_safety_report(location: str = "mumbai", langs: Optional[str] = None):
    loc_key = location.strip().lower()
    if loc_key not in INDIAN_COASTAL_ZONES:
        loc_key = "mumbai"
        
    coords = INDIAN_COASTAL_ZONES[loc_key]
    station_state = coords.get("state", "Maharashtra")
    
    if not langs:
        default_langs = STATE_DEFAULT_LANGUAGES.get(station_state, ["Hindi", "Marathi"])
        langs = ",".join(default_langs)
        
    try:
        weather_metrics = fetch_indian_marine_weather(coords["lat"], coords["lon"])
        eval_result = evaluate_marine_safety(weather_metrics)
        
        eng_text = eval_result.get("english", "Sea conditions evaluated.")
        target_languages = [l.strip() for l in langs.split(",") if l.strip()]
        
        translated_advisories = {}
        try:
            translated_advisories = nlp_engine.translate_advisory(
                text=eng_text,
                target_langs=[l.lower() for l in target_languages]
            )
        except Exception:
            templates = eval_result.get("native_templates", {})
            for lang in target_languages:
                if lang.capitalize() in templates:
                    translated_advisories[lang.lower()] = templates[lang.capitalize()]
                else:
                    translated_advisories[lang.lower()] = eng_text

        status_str = eval_result.get("status_code", "SAFE").upper()
        alert_lvl = eval_result.get("alert_level", 1)

        vessels = eval_result.get("vessels", {})
        fleet_allowances = {
            "small": {"status": vessels.get('small', {}).get('status', 'ALLOWED'), "desc": vessels.get('small', {}).get('desc', '')},
            "medium": {"status": vessels.get('medium', {}).get('status', 'ALLOWED'), "desc": vessels.get('medium', {}).get('desc', '')},
            "large": {"status": vessels.get('large', {}).get('status', 'ALLOWED'), "desc": vessels.get('large', {}).get('desc', '')}
        }

        wind_spd = weather_metrics.get("wind_speed_kmh", 15.0)
        wave_h = weather_metrics.get("wave_height_meters", 0.9)
        wind_dir = weather_metrics.get("wind_direction_degrees", 240.0)

        beaufort = calculate_beaufort_scale(wind_spd)
        douglas = calculate_douglas_sea_state(wave_h)
        wind_compass = get_wind_direction_compass(wind_dir)

        forecast_3h = [
            {"hour_label": "+1h", "temp": round(weather_metrics.get("temperature_celsius", 28.0) + 0.3, 1), "wind": round(wind_spd + 1.2, 1), "desc": "Mainly Clear", "cloud": 20, "precip": 0.0},
            {"hour_label": "+2h", "temp": round(weather_metrics.get("temperature_celsius", 28.0) + 0.6, 1), "wind": round(wind_spd + 2.0, 1), "desc": "Partly Cloudy", "cloud": 35, "precip": 0.0},
            {"hour_label": "+3h", "temp": round(weather_metrics.get("temperature_celsius", 28.0) + 0.2, 1), "wind": round(wind_spd + 1.5, 1), "desc": "Partly Cloudy", "cloud": 40, "precip": 0.0}
        ]

        # Adjacent hubs in same state
        adjacent_hubs = [INDIAN_COASTAL_ZONES[k]["name"] for k in INDIAN_COASTAL_ZONES if INDIAN_COASTAL_ZONES[k].get("state") == station_state and k != loc_key]

        return {
            "query_location": coords.get("name", location.capitalize()),
            "station_id": loc_key,
            "station_state": station_state,
            "station_region": coords.get("region", "West Coast"),
            "coordinates": coords,
            "weather_metrics": {
                "wave_height_m": wave_h,
                "wave_period_s": weather_metrics.get("wave_period_seconds", 6.5),
                "wave_direction_deg": weather_metrics.get("wave_direction_degrees", 230.0),
                "swell_wave_height_m": weather_metrics.get("swell_wave_height_meters", 0.5),
                "ocean_current_velocity_kmh": weather_metrics.get("ocean_current_velocity_kmh", 1.2),
                "ocean_current_velocity_knots": round(weather_metrics.get("ocean_current_velocity_kmh", 1.2) * 0.539957, 1),
                "ocean_current_velocity_ms": round(weather_metrics.get("ocean_current_velocity_kmh", 1.2) * 0.277778, 2),
                "wind_speed_kmh": wind_spd,
                "wind_gusts_kmh": weather_metrics.get("wind_gusts_kmh", 20.0),
                "wind_direction_deg": wind_dir,
                "wind_compass": wind_compass,
                "temperature_c": weather_metrics.get("temperature_celsius", 28.0),
                "precipitation_mmh": weather_metrics.get("precipitation_mmh", 0.0),
                "weather_code": weather_metrics.get("weather_code", 1),
                "cloud_cover_percent": weather_metrics.get("cloud_cover_percent", 30),
                "sunrise": "06:12",
                "sunset": "18:48",
                "beaufort": beaufort,
                "douglas": douglas
            },
            "safety_intelligence": {
                "status_code": status_str,
                "alert_level": alert_lvl,
                "theme_class": eval_result.get("theme_class", "threat-banner-safe"),
                "english_advisory": eng_text,
                "fleet_allowances": fleet_allowances,
                "multilingual_advisories": translated_advisories
            },
            "forecast_3h": forecast_3h,
            "adjacent_hubs": adjacent_hubs[:4]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/spills/global")
def get_global_spills():
    return fetch_live_cerulean_slicks(limit=100)

@app.get("/api/v1/spills/hsi-scene")
def get_hsi_scene(eco_category: str = "Mangrove", scene_index: int = 0, image_index: Optional[int] = None):
    # Fallback loader helper
    def get_static_hsi_fallback():
        hsi_json_path = os.path.join(STATIC_DIR, "hsi_scenes.json")
        if os.path.exists(hsi_json_path):
            with open(hsi_json_path, "r", encoding="utf-8") as f:
                hsi_catalog = json.load(f)
            
            cat_key = "Mangrove Intertidal"
            for k in hsi_catalog.keys():
                if eco_category.lower() in k.lower():
                    cat_key = k
                    break
                    
            scenes = hsi_catalog.get(cat_key, hsi_catalog["Mangrove Intertidal"])
            idx = (image_index if image_index is not None else scene_index) % len(scenes)
            sc = scenes[idx]
            
            # Encode base64 if available
            sar_b64 = ""
            gt_b64 = ""
            ov_b64 = ""
            
            sar_f = os.path.join(STATIC_DIR, sc["sar_input_url"].lstrip("/"))
            if os.path.exists(sar_f):
                with open(sar_f, "rb") as sf:
                    sar_b64 = f"data:image/jpeg;base64,{base64.b64encode(sf.read()).decode('utf-8')}"
                    
            gt_f = os.path.join(STATIC_DIR, sc["gt_mask_url"].lstrip("/"))
            if os.path.exists(gt_f):
                with open(gt_f, "rb") as gf:
                    gt_b64 = f"data:image/png;base64,{base64.b64encode(gf.read()).decode('utf-8')}"
                    
            ov_f = os.path.join(STATIC_DIR, sc["overlay_url"].lstrip("/"))
            if os.path.exists(ov_f):
                with open(ov_f, "rb") as of:
                    ov_b64 = f"data:image/jpeg;base64,{base64.b64encode(of.read()).decode('utf-8')}"
                    
            return {
                "scene_name": sc["scene_name"],
                "scene_index": idx,
                "total_scenes": len(scenes),
                "ecosystem_desc": sc["ecosystem_desc"],
                "sar_input_b64": sar_b64,
                "gt_mask_b64": gt_b64,
                "overlay_b64": ov_b64,
                "sar_input_url": sc["sar_input_url"],
                "gt_mask_url": sc["gt_mask_url"],
                "overlay_url": sc["overlay_url"],
                "spill_pixels": sc["spill_pixels"],
                "spill_percentage": sc["spill_percentage"],
                "latency_ms": sc["latency_ms"]
            }
        raise HTTPException(status_code=404, detail="No HSI test scenes found")

    try:
        test_dir = os.path.join(DATASET_DIR, "oil-spill", "test", "images")
        test_mask_dir = os.path.join(DATASET_DIR, "oil-spill", "test", "labels")

        all_test_imgs = sorted(glob.glob(os.path.join(test_dir, "*.jpg")))
        all_test_masks = sorted(glob.glob(os.path.join(test_mask_dir, "*.png")))

        if not all_test_imgs:
            all_test_imgs = sorted(glob.glob(os.path.join(DATASET_DIR, "oil-spill", "**", "*.jpg"), recursive=True))
            all_test_masks = sorted(glob.glob(os.path.join(DATASET_DIR, "oil-spill", "**", "*.png"), recursive=True))

        if not all_test_imgs:
            return get_static_hsi_fallback()

        if image_index is not None and len(all_test_imgs) > 0:
            idx = image_index % len(all_test_imgs)
            img_path = all_test_imgs[idx]
            mask_path = all_test_masks[idx] if idx < len(all_test_masks) else None
            cat_desc = f"Direct Dataset Scene #{idx + 1}"
            cat_imgs = all_test_imgs
        else:
            if "Mangrove" in eco_category:
                cat_imgs = all_test_imgs[0:28] if len(all_test_imgs) >= 28 else all_test_imgs
                cat_masks = all_test_masks[0:28] if len(all_test_masks) >= 28 else all_test_masks
                cat_desc = "Mangrove Intertidal Zones & Estuarine Mudflats"
            elif "Coral" in eco_category:
                cat_imgs = all_test_imgs[28:55] if len(all_test_imgs) >= 55 else all_test_imgs
                cat_masks = all_test_masks[28:55] if len(all_test_masks) >= 55 else all_test_masks
                cat_desc = "Coral Lagoon Fringes & Shallow Atoll Waters"
            elif "Fishing" in eco_category:
                cat_imgs = all_test_imgs[55:82] if len(all_test_imgs) >= 82 else all_test_imgs
                cat_masks = all_test_masks[55:82] if len(all_test_masks) >= 82 else all_test_masks
                cat_desc = "Upwelling Fishing Grounds & Trawler Hubs"
            else:
                cat_imgs = all_test_imgs[82:110] if len(all_test_imgs) >= 110 else all_test_imgs
                cat_masks = all_test_masks[82:110] if len(all_test_masks) >= 110 else all_test_masks
                cat_desc = "Deepwater Commercial Tanker Lanes & SPM Anchorage"

            if not cat_imgs:
                return get_static_hsi_fallback()

            idx = scene_index % len(cat_imgs)
            img_path = cat_imgs[idx]
            mask_path = cat_masks[idx] if idx < len(cat_masks) else None

        sar_img = cv2.imread(img_path)
        if sar_img is None:
            return get_static_hsi_fallback()
            
        sar_img = cv2.cvtColor(sar_img, cv2.COLOR_BGR2RGB)
        sar_img = cv2.resize(sar_img, (512, 512))

        if mask_path and os.path.exists(mask_path):
            gt_mask = cv2.imread(mask_path)
            gt_mask = cv2.cvtColor(gt_mask, cv2.COLOR_BGR2RGB)
            gt_mask = cv2.resize(gt_mask, (512, 512))
        else:
            gt_mask = np.zeros((512, 512, 3), dtype=np.uint8)

        cv_res = segment_oil_spill(sar_img, threshold=0.55)

        # Encode to base64
        _, buf_in = cv2.imencode(".jpg", cv2.cvtColor(sar_img, cv2.COLOR_RGB2BGR))
        _, buf_gt = cv2.imencode(".png", cv2.cvtColor(gt_mask, cv2.COLOR_RGB2BGR))
        _, buf_ov = cv2.imencode(".jpg", cv2.cvtColor(cv_res["overlay"], cv2.COLOR_RGB2BGR))

        return {
            "scene_name": os.path.basename(img_path),
            "scene_index": idx,
            "total_scenes": len(cat_imgs),
            "ecosystem_desc": cat_desc,
            "sar_input_b64": f"data:image/jpeg;base64,{base64.b64encode(buf_in).decode('utf-8')}",
            "gt_mask_b64": f"data:image/png;base64,{base64.b64encode(buf_gt).decode('utf-8')}",
            "overlay_b64": f"data:image/jpeg;base64,{base64.b64encode(buf_ov).decode('utf-8')}",
            "spill_pixels": int(cv_res["spill_pixels"]),
            "spill_percentage": round(cv_res["spill_percentage"], 2),
            "latency_ms": round(cv_res["latency_ms"], 2)
        }
    except Exception as e:
        print(f"[WARN] Live HSI processing fallback due to: {e}")
        return get_static_hsi_fallback()

@app.get("/api/v1/vision/debris-video-frame")
def get_debris_video_frame(frame_idx: int = 0):
    def get_static_debris_fallback():
        deb_json_path = os.path.join(STATIC_DIR, "debris_frames.json")
        if os.path.exists(deb_json_path):
            with open(deb_json_path, "r", encoding="utf-8") as f:
                frames_list = json.load(f)
            idx = frame_idx % len(frames_list)
            fr = frames_list[idx]
            
            b64_img = ""
            img_f = os.path.join(STATIC_DIR, fr["annotated_frame_url"].lstrip("/"))
            if os.path.exists(img_f):
                with open(img_f, "rb") as f_img:
                    b64_img = f"data:image/jpeg;base64,{base64.b64encode(f_img.read()).decode('utf-8')}"
                    
            return {
                "frame_idx": fr["frame_idx"],
                "timestamp_s": fr["timestamp_s"],
                "annotated_frame_b64": b64_img,
                "annotated_frame_url": fr["annotated_frame_url"],
                "detections": fr["detections"],
                "latency_ms": fr["latency_ms"]
            }
        return {
            "frame_idx": frame_idx,
            "timestamp_s": frame_idx * 2,
            "annotated_frame_b64": "",
            "detections": [{"label": "Marine Plastic Debris", "confidence": "82.5%", "threat_level": "MODERATE"}],
            "latency_ms": 32.5
        }

    try:
        video_path = os.path.join(DATASET_DIR, "videos", "ocean_debris_master_surveillance.mp4")
        frame_rgb = None
        if os.path.exists(video_path):
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
            target_frame = (frame_idx * int(fps * 2)) % max(1, total_frames)
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
            ret, frame = cap.read()
            cap.release()
            if ret and frame is not None:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        if frame_rgb is None:
            return get_static_debris_fallback()

        yolo_out = detect_marine_debris(frame_rgb, conf=0.25)
        annotated_frame = yolo_out.annotated_image.copy()

        # Draw ROV HUD Overlay
        h, w, _ = annotated_frame.shape
        cv2.rectangle(annotated_frame, (10, 10), (w - 10, h - 10), (16, 185, 129), 3)
        cv2.putText(annotated_frame, "ROV ROBOTIC MACHINE: OPERATIONAL", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (16, 185, 129), 2)
        cv2.putText(annotated_frame, f"SURVEILLANCE STEP: {frame_idx * 2}s", (20, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (56, 189, 248), 2)

        _, buffer = cv2.imencode(".jpg", cv2.cvtColor(annotated_frame, cv2.COLOR_RGB2BGR))
        annotated_b64 = base64.b64encode(buffer).decode("utf-8")

        clean_dets = []
        for d in yolo_out.detections:
            lbl = d["class_name"]
            if "unknown" in lbl.lower() or "object" in lbl.lower() or lbl.strip() == "":
                lbl = "Marine Plastic Debris"
            clean_dets.append({
                "label": lbl,
                "confidence": f"{d['confidence']*100:.1f}%",
                "threat_level": "CRITICAL" if d['confidence'] > 0.65 else "MODERATE"
            })

        return {
            "frame_idx": frame_idx,
            "timestamp_s": frame_idx * 2,
            "annotated_frame_b64": f"data:image/jpeg;base64,{annotated_b64}",
            "detections": clean_dets,
            "latency_ms": round(yolo_out.latency_ms, 2)
        }
    except Exception as e:
        print(f"[WARN] Live debris video processing fallback due to: {e}")
        return get_static_debris_fallback()

@app.get("/api/v1/vision/debris-gallery")
def get_debris_gallery(image_index: int = 0):
    debris_dir = os.path.join(DATASET_DIR, "instance_version", "train")
    if not os.path.exists(debris_dir):
        debris_dir = os.path.join(DATASET_DIR, "original_data", "images")
    
    files = sorted(glob.glob(os.path.join(debris_dir, "*.jpg"))) + sorted(glob.glob(os.path.join(debris_dir, "*.png")))
    if not files:
        files = sorted(glob.glob(os.path.join(DATASET_DIR, "**", "*.jpg"), recursive=True))

    if not files:
        raise HTTPException(status_code=404, detail="No debris images found")

    idx = image_index % len(files)
    file_path = files[idx]
    
    d_img = cv2.imread(file_path)
    d_img = cv2.cvtColor(d_img, cv2.COLOR_BGR2RGB)
    
    y_res = detect_marine_debris(d_img, conf=0.25)
    
    _, buffer = cv2.imencode(".jpg", cv2.cvtColor(y_res.annotated_image, cv2.COLOR_RGB2BGR))
    annotated_b64 = base64.b64encode(buffer).decode("utf-8")

    dets = []
    for d in y_res.detections:
        lbl = d["class_name"] if "unknown" not in d["class_name"].lower() else "Marine Plastic Debris"
        dets.append({
            "label": lbl,
            "confidence": f"{d['confidence']*100:.1f}%"
        })

    return {
        "filename": os.path.basename(file_path),
        "index": idx,
        "total": len(files),
        "annotated_b64": f"data:image/jpeg;base64,{annotated_b64}",
        "detections": dets,
        "latency_ms": round(y_res.latency_ms, 2)
    }

@app.post("/api/v1/vision/inference-debris")
async def run_debris_inference(
    file: Optional[UploadFile] = File(None),
    conf_threshold: float = Form(0.25)
):
    try:
        if file is not None:
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            debris_files = glob.glob(os.path.join(DATASET_DIR, "**", "*.jpg"), recursive=True)
            image_bgr = cv2.imread(debris_files[0]) if debris_files else np.zeros((512, 512, 3), dtype=np.uint8)

        if image_bgr is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        result = detect_marine_debris(image_rgb, conf=conf_threshold)

        _, buffer = cv2.imencode(".jpg", cv2.cvtColor(result.annotated_image, cv2.COLOR_RGB2BGR))
        annotated_b64 = base64.b64encode(buffer).decode("utf-8")

        dets = []
        for d in result.detections:
            lbl = d["class_name"] if "unknown" not in d["class_name"].lower() else "Marine Plastic Debris"
            dets.append({
                "label": lbl,
                "confidence": f"{d['confidence']*100:.1f}%"
            })

        return {
            "annotated_image_b64": f"data:image/jpeg;base64,{annotated_b64}",
            "detections": dets,
            "total_detections": len(dets),
            "latency_ms": round(result.latency_ms, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
def on_app_startup():
    try:
        from backend.services.ais_live_service import start_ais_live_stream_listener
        start_ais_live_stream_listener()
    except Exception as e:
        print(f"[AIS Stream Startup Notice]: {e}")

@app.get("/api/v1/fleet/status")
def get_fleet_telemetry_status():
    try:
        from backend.services.ais_live_service import get_ais_stream_status
        return get_ais_stream_status()
    except Exception as e:
        return {
            "is_running": False,
            "connected": False,
            "packets_received": 0,
            "live_vessels_count": 0,
            "last_packet_time": None,
            "error": str(e)
        }

@app.get("/api/v1/fleet/asia-live-vessels")
def get_asian_live_vessels(
    region: Optional[str] = "All",
    motion: Optional[str] = "All",
    mode: Optional[str] = "live"
):
    try:
        from backend.services.ais_live_service import get_active_vessel_fleet, get_ais_stream_status
        vessels = get_active_vessel_fleet(region_filter=region, motion_filter=motion, mode=mode, limit=50)
        status = get_ais_stream_status()
        return {
            "status": "online",
            "total_vessels": len(vessels),
            "region_filter": region,
            "mode": mode,
            "telemetry_status": status,
            "vessels": vessels
        }
    except Exception as e:
        return {
            "status": "offline_fallback",
            "total_vessels": 0,
            "vessels": [],
            "error": str(e)
        }

@app.get("/api/v1/fleet/vessel-reroute-intelligence")
def get_vessel_reroute_intelligence(
    mmsi: Optional[str] = None,
    lat: float = 18.9220,
    lon: float = 72.8347,
    dest_lat: Optional[float] = None,
    dest_lon: Optional[float] = None,
    safety_margin: float = 15.0,
    sea_halt_threshold: float = 2.5,
    simulate_hazard: bool = False
):
    try:
        from backend.services.open_meteo import fetch_indian_marine_weather
        from backend.services.ais_live_service import (
            get_vessel_by_mmsi,
            generate_vessel_sea_lane_route
        )
        
        target_vessel = get_vessel_by_mmsi(mmsi) if mmsi else None
        v_lat = lat
        v_lon = lon
        d_lat = dest_lat if dest_lat is not None else (target_vessel.get("dest_lat") if target_vessel else 25.1800)
        d_lon = dest_lon if dest_lon is not None else (target_vessel.get("dest_lon") if target_vessel else 56.3600)
        sog = target_vessel.get("sog_knots", 14.0) if target_vessel else 14.0
        cog = target_vessel.get("cog_degrees", 240.0) if target_vessel else 240.0

        # Fetch live marine hydrodynamics from Open-Meteo
        weather = fetch_indian_marine_weather(v_lat, v_lon)
        wave_h = float(weather.get("wave_height_meters", 1.2))
        swell_h = float(weather.get("swell_wave_height_meters", 0.6))
        wind_spd = float(weather.get("wind_speed_kmh", 16.0))
        wmo = int(weather.get("weather_code", 1))

        # Check if severe wave swells exceed safe ceiling
        is_hazard = simulate_hazard or (wave_h > sea_halt_threshold) or (wind_spd > 45.0) or (wmo in [95, 96, 99])

        # Actual route track (100% ocean-constrained, zero land)
        if target_vessel and target_vessel.get("route_waypoints") and len(target_vessel["route_waypoints"]) >= 2:
            actual_track = target_vessel["route_waypoints"]
        else:
            actual_track = generate_vessel_sea_lane_route(v_lat, v_lon, d_lat, d_lon, cog, sog)

        # Shelter ports database
        shelter_ports = [
            {"name": "Mumbai Major Port Trust", "state": "Maharashtra", "lat": 18.9220, "lon": 72.8347},
            {"name": "Mormugao Deepwater Base", "state": "Goa", "lat": 15.4055, "lon": 73.7931},
            {"name": "Cochin Seaport", "state": "Kerala", "lat": 9.9312, "lon": 76.2673},
            {"name": "Colombo Outer Fairway", "state": "Sri Lanka", "lat": 6.9400, "lon": 79.8400},
            {"name": "Chennai Port Trust", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2900},
            {"name": "Port of Singapore (PSA)", "state": "Singapore", "lat": 1.2800, "lon": 103.8500},
            {"name": "Fujairah Anchorage", "state": "UAE", "lat": 25.1800, "lon": 56.3600}
        ]
        closest_shelter = min(shelter_ports, key=lambda p: math.hypot(p["lat"] - v_lat, p["lon"] - v_lon))
        d_shelter_nm = round(math.hypot(closest_shelter["lat"] - v_lat, closest_shelter["lon"] - v_lon) * 60.0, 1)

        # Resolve stakeholder emails for Vessel X, origin, destination, and shelter
        from backend.services.email_alert_service import resolve_port_email, resolve_vessel_email
        origin_name = target_vessel.get("origin") if target_vessel else "Kandla Port"
        dest_name = target_vessel.get("destination") if target_vessel else "Fujairah Anchorage"
        stakeholder_emails = {
            "vessel_bridge": resolve_vessel_email(str(mmsi or "419001101"), target_vessel.get("name") if target_vessel else None),
            "start_port": resolve_port_email(origin_name),
            "dest_port": resolve_port_email(dest_name),
            "shelter_port": resolve_port_email(closest_shelter["name"])
        }

        if is_hazard:
            # Build AI Seaward Detour
            offset_deg = max(0.18, min(0.42, (safety_margin / 60.0) * 0.9))
            ai_detour = []
            for idx, pt in enumerate(actual_track):
                if idx == 0 or idx == len(actual_track) - 1:
                    ai_detour.append(pt)
                else:
                    prev_p = actual_track[idx - 1]
                    next_p = actual_track[idx + 1] if idx + 1 < len(actual_track) else pt
                    dlat = next_p[0] - prev_p[0]
                    dlon = next_p[1] - prev_p[1]
                    length = math.hypot(dlat, dlon) or 1.0
                    n_lat = -dlon / length
                    n_lon = dlat / length
                    if pt[1] < 77.0 and n_lon > 0:
                        n_lat, n_lon = -n_lat, -n_lon
                    elif pt[1] > 80.0 and pt[1] < 92.0 and n_lon < 0:
                        n_lat, n_lon = -n_lat, -n_lon

                    detour_lat = round(pt[0] + n_lat * offset_deg, 4)
                    detour_lon = round(pt[1] + n_lon * offset_deg, 4)
                    ai_detour.append([detour_lat, detour_lon])

            # Hazard Zone Polygon
            mid_idx = len(actual_track) // 2
            h_center = actual_track[mid_idx] if len(actual_track) > 1 else [v_lat + 0.3, v_lon + 0.3]
            h_lat, h_lon = h_center[0], h_center[1]
            hazard_poly = [
                [round(h_lat + 0.25, 4), round(h_lon - 0.25, 4)],
                [round(h_lat + 0.25, 4), round(h_lon + 0.25, 4)],
                [round(h_lat - 0.25, 4), round(h_lon + 0.30, 4)],
                [round(h_lat - 0.25, 4), round(h_lon - 0.20, 4)]
            ]
            sea_halt_pt = [round(h_lat - 0.08, 4), round(h_lon - 0.08, 4)]
            extra_nm = round(safety_margin * 1.25, 1)
            time_delay = round(extra_nm / max(10.0, sog), 1)

            return {
                "has_weather_hazard": True,
                "hazard_reason": f"Severe Sea Swell ({wave_h}m) & Gale ({wind_spd} km/h) Exceed Ceiling ({sea_halt_threshold}m)",
                "weather": weather,
                "actual_track": actual_track,
                "ai_detour_track": ai_detour,
                "hazard_polygon": hazard_poly,
                "sea_halt_point": sea_halt_pt,
                "diversion_distance_nm": extra_nm,
                "time_delay_hours": time_delay,
                "fuel_penalty_pct": round(extra_nm * 0.26, 1),
                "emergency_shelter": {
                    "name": closest_shelter["name"],
                    "state": closest_shelter["state"],
                    "distance_nm": d_shelter_nm,
                    "eta_hours": round(d_shelter_nm / max(10.0, sog), 1)
                },
                "stakeholder_emails": stakeholder_emails
            }
        else:
            # Safe passage: NO detour, NO hazard polygon
            return {
                "has_weather_hazard": False,
                "hazard_reason": None,
                "weather": weather,
                "actual_track": actual_track,
                "ai_detour_track": None,
                "hazard_polygon": None,
                "sea_halt_point": None,
                "diversion_distance_nm": 0.0,
                "time_delay_hours": 0.0,
                "fuel_penalty_pct": 0.0,
                "emergency_shelter": {
                    "name": closest_shelter["name"],
                    "state": closest_shelter["state"],
                    "distance_nm": d_shelter_nm,
                    "eta_hours": round(d_shelter_nm / max(10.0, sog), 1)
                },
                "stakeholder_emails": stakeholder_emails
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class VesselHazardAlertDispatchPayload(BaseModel):
    mmsi: str
    vessel_name: str
    flag: Optional[str] = "⚓"
    lat: float
    lon: float
    sog_knots: float = 0.0
    cog_degrees: float = 0.0
    origin: Optional[str] = None
    destination: Optional[str] = None
    vessel_email: Optional[str] = None
    start_port_email: Optional[str] = None
    dest_port_email: Optional[str] = None
    shelter_port_email: Optional[str] = None
    wave_height_meters: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    sea_halt_threshold: float = 2.8
    diversion_distance_nm: float = 0.0
    time_delay_hours: float = 0.0
    emergency_shelter_name: Optional[str] = None
    emergency_shelter_distance_nm: Optional[float] = None
    emergency_shelter_eta_hours: Optional[float] = None

@app.post("/api/v1/fleet/dispatch-vessel-alert")
async def dispatch_vessel_hazard_alert(payload: VesselHazardAlertDispatchPayload):
    try:
        from backend.services.email_alert_service import send_vessel_hazard_dispatch
        result = await send_vessel_hazard_dispatch(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CoastalAlertDispatchPayload(BaseModel):
    port_key: str
    port_name: str
    state: str
    region: Optional[str] = "Coastal Zone"
    lat: float
    lon: float
    alert_level: int
    threat_level: str
    english_advisory: str
    multilingual_advisories: Optional[Dict[str, str]] = {}
    weather_metrics: Optional[Dict[str, Any]] = {}
    fleet_allowances: Optional[Dict[str, Any]] = {}
    is_forced: Optional[bool] = False
    recipient_email: Optional[str] = "zameershaikh17112006@gmail.com"

@app.post("/api/v1/command/dispatch-coastal-alert")
async def dispatch_coastal_alert(payload: CoastalAlertDispatchPayload):
    try:
        from backend.services.email_alert_service import send_coastal_fisherman_dispatch
        result = await send_coastal_fisherman_dispatch(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/download/project-zip")
def download_project_zip():
    zip_paths = [
        r"D:\Downloads\MarineGuardian.zip",
        r"D:\Downloads\MarineGuardian_WhatsApp.zip",
        r"C:\Users\Zameer Shaikh\Downloads\MarineGuardian.zip"
    ]
    for p in zip_paths:
        if os.path.exists(p):
            return FileResponse(
                p,
                filename="MarineGuardian.zip",
                media_type="application/zip"
            )
    raise HTTPException(status_code=404, detail="Zip file not ready yet")
