import math
import requests
from typing import Dict, List, Any, Tuple, Optional
from backend.core.config import INDIAN_COASTAL_ZONES
from backend.services.open_meteo import fetch_indian_marine_weather
from backend.services.translator import nlp_engine

# Certified Emergency All-Weather Shelter Harbors & Safe Bays along the Indian Coast
SHELTER_PORTS = [
    {"name": "Mormugao Deepwater Base", "state": "Goa", "lat": 15.4055, "lon": 73.7931, "depth_m": 14.5, "type": "Major All-Weather Deepwater Port"},
    {"name": "Jaigad Deepwater Bay", "state": "Maharashtra", "lat": 17.3000, "lon": 73.2100, "depth_m": 12.0, "type": "Natural Sheltered All-Weather Harbor"},
    {"name": "Mumbai Port Trust (Inner Anchorage)", "state": "Maharashtra", "lat": 18.9220, "lon": 72.8347, "depth_m": 11.5, "type": "Protected Harbor Basin"},
    {"name": "New Mangalore Port", "state": "Karnataka", "lat": 12.8797, "lon": 74.8426, "depth_m": 13.0, "type": "Protected All-Weather Seaport"},
    {"name": "Cochin Seaport (Mattancherry Channel)", "state": "Kerala", "lat": 9.9312, "lon": 76.2673, "depth_m": 12.5, "type": "Landlocked Estuarine Harbor"},
    {"name": "Tuticorin Protected Basin", "state": "Tamil Nadu", "lat": 8.7642, "lon": 78.1348, "depth_m": 13.8, "type": "Breakwater Protected Port"},
    {"name": "Chennai Harbor Basin", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "depth_m": 14.0, "type": "Deepwater Artificial Harbor"},
    {"name": "Visakhapatnam Inner Harbor", "state": "Andhra Pradesh", "lat": 17.6868, "lon": 83.2185, "depth_m": 16.5, "type": "Dolphin's Nose Landlocked Harbor"},
    {"name": "Paradip Protected Lagoon", "state": "Odisha", "lat": 20.3168, "lon": 86.6111, "depth_m": 14.2, "type": "Engineered Breakwater Basin"},
    {"name": "Port Blair Haddo Basin", "state": "Andaman & Nicobar", "lat": 11.6234, "lon": 92.7265, "depth_m": 12.0, "type": "Deepwater Island Fjord Anchorage"}
]

def calculate_nautical_distance_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance in Nautical Miles between two coordinates."""
    r_km = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    km = r_km * c
    return km * 0.539957

def probe_forward_route_physics(
    start_lat: float,
    start_lon: float,
    dest_lat: float,
    dest_lon: float,
    route_waypoints: List[List[float]] = None,
    num_points: int = 5
) -> List[Dict[str, Any]]:
    """
    Probes live marine weather physics across equidistant coordinates along the forward vessel route.
    Uses actual sea-lane route waypoints if provided.
    """
    pts_to_sample = []
    
    if route_waypoints and len(route_waypoints) >= 2:
        # Interpolate along multi-segment route
        segs = len(route_waypoints) - 1
        for i in range(num_points):
            t = (i + 1) / (num_points + 1)
            seg_idx = min(int(t * segs), segs - 1)
            seg_t = (t * segs) - seg_idx
            p1 = route_waypoints[seg_idx]
            p2 = route_waypoints[seg_idx + 1]
            p_lat = p1[0] + (p2[0] - p1[0]) * seg_t
            p_lon = p1[1] + (p2[1] - p1[1]) * seg_t
            pts_to_sample.append((p_lat, p_lon))
    else:
        for i in range(num_points):
            fraction = (i + 1) / (num_points + 1)
            p_lat = start_lat + (dest_lat - start_lat) * fraction
            p_lon = start_lon + (dest_lon - start_lon) * fraction
            pts_to_sample.append((p_lat, p_lon))

    probes = []
    for idx, (probe_lat, probe_lon) in enumerate(pts_to_sample):
        weather = fetch_indian_marine_weather(probe_lat, probe_lon)
        wave_h = weather.get("wave_height_meters", 1.0)
        swell_h = weather.get("swell_wave_height_meters", 0.5)
        wind_spd = weather.get("wind_speed_kmh", 15.0)
        wind_gusts = weather.get("wind_gusts_kmh", 20.0)
        wmo_code = weather.get("weather_code", 1)
        precip = weather.get("precipitation_mmh", 0.0)

        # Risk scoring for this specific point
        is_extreme = (wave_h >= 2.8 or swell_h >= 2.2 or wind_gusts >= 50.0 or wmo_code in [95, 96, 99])
        is_moderate = (wave_h >= 1.8 or swell_h >= 1.3 or wind_gusts >= 35.0 or precip >= 2.0)

        point_status = "CRITICAL" if is_extreme else "CAUTION" if is_moderate else "SAFE"

        probes.append({
            "index": idx + 1,
            "lat": round(probe_lat, 4),
            "lon": round(probe_lon, 4),
            "wave_height_m": wave_h,
            "swell_height_m": swell_h,
            "wind_speed_kmh": wind_spd,
            "wind_gusts_kmh": wind_gusts,
            "weather_code": wmo_code,
            "precipitation_mmh": precip,
            "status": point_status
        })
    return probes

from backend.core.deep_learning_rerouting_model import DEEP_REROUTING_MODEL, generate_ocean_constrained_route

def evaluate_vessel_route_hazard(probes: List[Dict[str, Any]], vessel_type: str = "Cargo", vessel_specs: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Evaluates cumulative hazard along the vessel trajectory using Deep Neural Network probabilities & probes.
    Categorizes threat into 3 clear levels: Safe, Caution, Danger.
    """
    critical_points = [p for p in probes if p["status"] == "CRITICAL"]
    caution_points = [p for p in probes if p["status"] == "CAUTION"]

    # Extract physics features from probes
    avg_wave = sum(p["wave_height_m"] for p in probes) / max(len(probes), 1)
    avg_swell = sum(p["swell_height_m"] for p in probes) / max(len(probes), 1)
    max_wind_gusts = max([p["wind_gusts_kmh"] for p in probes], default=15.0)
    
    v_lat = probes[0]["lat"] if probes else 15.0
    v_lon = probes[0]["lon"] if probes else 73.0
    sog = vessel_specs.get("sog_knots", 14.0) if vessel_specs else 14.0
    cog = vessel_specs.get("cog_degrees", 180.0) if vessel_specs else 180.0
    draft = vessel_specs.get("draft_m", 10.0) if vessel_specs else 10.0
    dwt = vessel_specs.get("length_m", 150.0) * 0.5 if vessel_specs else 50.0

    # Deep Neural Network Threat Inference
    deep_eval = DEEP_REROUTING_MODEL.predict_vessel_threat_probabilities(
        v_lat, v_lon, sog, cog, draft, dwt, avg_wave, avg_swell, max_wind_gusts
    )

    is_small_craft = "trawler" in vessel_type.lower() or "ferry" in vessel_type.lower()

    if critical_points or (caution_points and is_small_craft and len(caution_points) >= 2) or deep_eval["level"] == "RED":
        level = "RED"
        title = deep_eval["title"]
        desc = deep_eval["description"]
        theme = "danger"
    elif caution_points or deep_eval["level"] == "ORANGE":
        level = "ORANGE"
        title = deep_eval["title"]
        desc = deep_eval["description"]
        theme = "caution"
    else:
        level = "GREEN"
        title = deep_eval["title"]
        desc = deep_eval["description"]
        theme = "safe"

    return {
        "level": level,
        "title": title,
        "description": desc,
        "theme": theme,
        "prob_green": deep_eval["prob_green"],
        "prob_orange": deep_eval["prob_orange"],
        "prob_red": deep_eval["prob_red"],
        "model_confidence": deep_eval["model_confidence"],
        "hazard_count": len(critical_points) + len(caution_points),
        "probes": probes
    }

def calculate_ai_diversion_corridor(
    vessel: Dict[str, Any],
    hazard_eval: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes the mathematically optimal Green Bypass Corridor around active hazard zones.
    If route is clear, maintains the authentic multi-waypoint sea track with zero fake detour.
    """
    start_lat = vessel["lat"]
    start_lon = vessel["lon"]
    dest_lat = vessel["dest_lat"]
    dest_lon = vessel["dest_lon"]
    speed_kts = vessel.get("sog_knots", 14.0)
    fuel_burn_day = vessel.get("fuel_burn_rate_tons_day", 25.0)
    route_waypoints = vessel.get("route_waypoints") or [[start_lat, start_lon], [dest_lat, dest_lon]]

    # Total distance along the actual route segments
    direct_distance_nm = 0.0
    for idx in range(len(route_waypoints) - 1):
        p_a = route_waypoints[idx]
        p_b = route_waypoints[idx + 1]
        direct_distance_nm += calculate_nautical_distance_nm(p_a[0], p_a[1], p_b[0], p_b[1])
        
    if direct_distance_nm <= 0.1:
        direct_distance_nm = calculate_nautical_distance_nm(start_lat, start_lon, dest_lat, dest_lon)
        
    direct_eta_hours = direct_distance_nm / max(speed_kts, 1.0)
    hazard_level = hazard_eval["level"]

    if hazard_level == "GREEN":
        # Zero detour! Clean authentic sea lane
        return {
            "status": "DIRECT_OPTIMAL",
            "reroute_required": False,
            "original_distance_nm": round(direct_distance_nm, 1),
            "rerouted_distance_nm": round(direct_distance_nm, 1),
            "distance_delta_nm": 0.0,
            "fuel_delta_tons": 0.0,
            "direct_eta_hours": round(direct_eta_hours, 1),
            "rerouted_eta_hours": round(direct_eta_hours, 1),
            "eta_delay_minutes": 0,
            "waypoints": route_waypoints,
            "hazard_polygon": []
        }

    # If Red or Orange hazard: Calculate dynamic bypass offset
    probes = hazard_eval["probes"]
    hazard_probes = [p for p in probes if p["status"] in ["CRITICAL", "CAUTION"]]
    if not hazard_probes:
        hazard_probes = [probes[len(probes) // 2]]

    # Compute centroid of hazard
    h_lat = sum(p["lat"] for p in hazard_probes) / len(hazard_probes)
    h_lon = sum(p["lon"] for p in hazard_probes) / len(hazard_probes)

    # Automatic Halt Determination & Sea Checkpoint Calculation
    auto_halt_required = (hazard_level == "RED" or len(hazard_probes) >= 3)
    
    # First hazard entry probe
    first_haz = hazard_probes[0]
    haz_entry_lat, haz_entry_lon = first_haz["lat"], first_haz["lon"]
    
    # Calculate Sea Halt Checkpoint ~15 km (0.13 degrees) PRIOR to the hazard zone entry along forward vector
    vec_lat = haz_entry_lat - start_lat
    vec_lon = haz_entry_lon - start_lon
    vec_len = math.hypot(vec_lat, vec_lon) or 1.0
    
    # Offset back along vector by 15-20 km (~0.15 deg)
    halt_offset = min(0.18, vec_len * 0.3)
    halt_lat = round(haz_entry_lat - (vec_lat / vec_len) * halt_offset, 4)
    halt_lon = round(haz_entry_lon - (vec_lon / vec_len) * halt_offset, 4)
    
    sea_halt_checkpoint = {
        "lat": halt_lat,
        "lon": halt_lon,
        "distance_to_danger_km": round(halt_offset * 111.0, 1),
        "danger_centroid": {"lat": round(h_lat, 4), "lon": round(h_lon, 4)}
    }

    # Calculate prominent seaward offset for the green predicted path (~65-85 km offset)
    coast_name = vessel.get("coast", "") or vessel.get("region", "")
    is_east_coast = "East" in coast_name or (dest_lon > 80.0 and start_lon > 80.0)
    
    offset_dist_deg = 0.65 if hazard_level == "RED" else 0.48
    angle = math.atan2(dest_lat - start_lat, dest_lon - start_lon)
    
    if is_east_coast:
        # Seaward offset for East Coast (into Bay of Bengal -> East / +lon)
        bypass_lat = round(h_lat + math.sin(angle) * 0.1, 4)
        bypass_lon = round(h_lon + offset_dist_deg, 4)
    else:
        # Seaward offset for West Coast (into Arabian Sea -> West / -lon)
        bypass_lat = round(h_lat + math.sin(angle) * 0.1, 4)
        bypass_lon = round(h_lon - offset_dist_deg, 4)

    # Dynamic Hazard Polygon for Map display
    poly_radius = 0.28 if hazard_level == "RED" else 0.18
    hazard_poly = [
        [h_lat + poly_radius, h_lon - poly_radius * 1.2],
        [h_lat + poly_radius * 0.8, h_lon + poly_radius * 1.3],
        [h_lat - poly_radius * 0.9, h_lon + poly_radius * 0.8],
        [h_lat - poly_radius * 0.7, h_lon - poly_radius * 1.1],
        [h_lat + poly_radius, h_lon - poly_radius * 1.2]
    ]

    # Construct the 2nd Predicted Detour Path (Green) - Entirely separate ocean path
    rerouted_wps = [
        [start_lat, start_lon],
        [bypass_lat, bypass_lon],
        [dest_lat, dest_lon]
    ]

    # Construct halt waypoints leading up to Sea Halt Checkpoint ~15 km before danger area
    halt_wps = [route_waypoints[0]]
    for wp in route_waypoints[1:-1]:
        if calculate_nautical_distance_nm(start_lat, start_lon, wp[0], wp[1]) < calculate_nautical_distance_nm(start_lat, start_lon, halt_lat, halt_lon):
            halt_wps.append(wp)
    halt_wps.append([halt_lat, halt_lon])

    rerouted_distance_nm = 0.0
    for idx in range(len(rerouted_wps) - 1):
        p_a = rerouted_wps[idx]
        p_b = rerouted_wps[idx + 1]
        rerouted_distance_nm += calculate_nautical_distance_nm(p_a[0], p_a[1], p_b[0], p_b[1])

    delta_nm = max(0.0, rerouted_distance_nm - direct_distance_nm)
    rerouted_eta_hours = rerouted_distance_nm / max(speed_kts, 1.0)
    delay_minutes = int((rerouted_eta_hours - direct_eta_hours) * 60.0)

    # Extra fuel burned = (fuel_burn_per_hour * delay_hours)
    fuel_burn_hour = fuel_burn_day / 24.0
    fuel_delta_tons = round(fuel_burn_hour * (delay_minutes / 60.0), 2)

    return {
        "status": "AUTOMATIC_VOYAGE_HALT" if auto_halt_required else "DIVERTED_SAFE",
        "reroute_required": True,
        "auto_halt_required": auto_halt_required,
        "sea_halt_checkpoint": sea_halt_checkpoint,
        "halt_reason": f"Predicted trajectory intersects severe storm zone. Suggesting immediate vessel halt at Sea Checkpoint ({halt_lat}°N, {halt_lon}°E) {sea_halt_checkpoint['distance_to_danger_km']} km before hazard area." if auto_halt_required else "",
        "original_distance_nm": round(direct_distance_nm, 1),
        "rerouted_distance_nm": round(rerouted_distance_nm, 1),
        "distance_delta_nm": round(delta_nm, 1),
        "fuel_delta_tons": fuel_delta_tons,
        "direct_eta_hours": round(direct_eta_hours, 1),
        "rerouted_eta_hours": round(rerouted_eta_hours, 1),
        "eta_delay_minutes": delay_minutes,
        "bypass_waypoint": {"lat": bypass_lat, "lon": bypass_lon},
        "waypoints": rerouted_wps,
        "halt_waypoints": halt_wps,
        "hazard_polygon": hazard_poly
    }

def calculate_nearest_emergency_shelter(current_lat: float, current_lon: float) -> Dict[str, Any]:
    """
    Finds the closest certified all-weather port or sheltered anchorage along the Indian coastline.
    """
    best_port = None
    min_dist = float("inf")

    for port in SHELTER_PORTS:
        dist_nm = calculate_nautical_distance_nm(current_lat, current_lon, port["lat"], port["lon"])
        if dist_nm < min_dist:
            min_dist = dist_nm
            best_port = port

    # Speed to shelter assuming reduced safe heavy-weather speed (approx 10 knots)
    shelter_eta_hours = min_dist / 10.0

    return {
        "shelter_port_name": best_port["name"],
        "shelter_state": best_port["state"],
        "shelter_type": best_port["type"],
        "distance_nm": round(min_dist, 1),
        "harbor_depth_m": best_port["depth_m"],
        "emergency_eta_hours": round(shelter_eta_hours, 1),
        "shelter_lat": best_port["lat"],
        "shelter_lon": best_port["lon"],
        "recommended_heave_to_heading": 245.0, # Bow into standard SW monsoon swell
        "shelter_vector": [
            [current_lat, current_lon],
            [best_port["lat"], best_port["lon"]]
        ]
    }

def generate_navigational_dispatch(
    vessel: Dict[str, Any],
    hazard_eval: Dict[str, Any],
    diversion: Dict[str, Any],
    shelter: Dict[str, Any],
    is_halt_mode: bool = False
) -> Dict[str, str]:
    """
    Generates formal VHF Radio Broadcast and NAVTEX dispatch text in English and local destination language.
    """
    v_name = vessel["name"]
    v_mmsi = vessel["mmsi"]
    v_dest = vessel["destination"]

    if is_halt_mode:
        eng_msg = f"URGENT / PAN-PAN: Vessel {v_name} (MMSI: {v_mmsi}) executing emergency voyage halt due to critical sea turbulence. Diverting to nearest shelter harbor at {shelter['shelter_port_name']} ({shelter['distance_nm']} NM, Depth: {shelter['harbor_depth_m']}m). Maintain continuous VHF Channel 16 watch."
        hi_msg = f"अति आवश्यक / पैन-पैन: जहाज {v_name} (MMSI: {v_mmsi}) गंभीर समुद्री तूफान के कारण आपातकालीन ठहराव कर रहा है। निकटतम सुरक्षित बंदरगाह {shelter['shelter_port_name']} ({shelter['distance_nm']} समुद्री मील) की ओर प्रस्थान। VHF चैनल 16 पर संपर्क बनाए रखें।"
    elif diversion["reroute_required"]:
        eng_msg = f"SECURITE ADVISORY: Vessel {v_name} (MMSI: {v_mmsi}) en route to {v_dest}. Active weather squall detected. Adopt Green Diversion Waypoint at {diversion['bypass_waypoint']['lat']}N, {diversion['bypass_waypoint']['lon']}E (+{diversion['distance_delta_nm']} NM, delay: +{diversion['eta_delay_minutes']}m). Standby on VHF CH 16."
        hi_msg = f"सुरक्षा चेतावनी: जहाज {v_name} (MMSI: {v_mmsi}) मार्ग {v_dest} पर आगे तूफान का संकेत है। सुरक्षित ग्रीन डायवर्जन वेपॉइंट {diversion['bypass_waypoint']['lat']}N, {diversion['bypass_waypoint']['lon']}E अपनाएं (+{diversion['distance_delta_nm']} समुद्री मील)। VHF चैनल 16 पर सतर्क रहें।"
    else:
        eng_msg = f"CLEARANCE NOTICE: Vessel {v_name} (MMSI: {v_mmsi}) en route to {v_dest}. Forward ocean physics favorable. Maintain direct cruising trajectory. No detour required."
        hi_msg = f"निकासी सूचना: जहाज {v_name} (MMSI: {v_mmsi}) के मार्ग पर समुद्र शांत व सुरक्षित है। सामान्य सीधा रास्ता जारी रखें।"

    return {
        "english": eng_msg,
        "hindi": hi_msg
    }
