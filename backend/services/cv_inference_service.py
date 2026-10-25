import os
import sys
import time
import numpy as np
import torch
import cv2
from PIL import Image
import segmentation_models_pytorch as smp
from ultralytics import YOLO

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
WEIGHTS_DIR = os.path.join(MODELS_DIR, "weights")

UNET_WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "best_oil_spill_unet.pth")
YOLO_WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "best_marine_debris_yolov8.pt")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global cached models
_UNET_MODEL = None
_YOLO_MODEL = None

def get_unet_model():
    global _UNET_MODEL
    if _UNET_MODEL is None and os.path.exists(UNET_WEIGHTS_PATH):
        try:
            model = smp.Unet(
                encoder_name="resnet34",
                encoder_weights=None,
                in_channels=3,
                classes=1,
                activation=None
            ).to(DEVICE)
            checkpoint = torch.load(UNET_WEIGHTS_PATH, map_location=DEVICE, weights_only=True)
            model.load_state_dict(checkpoint, strict=False)
            model.eval()
            _UNET_MODEL = model
            print("[CV] Loaded ResNet-34 U-Net model successfully.")
        except Exception as e:
            print(f"[CV ERROR] Loading U-Net failed: {e}")
    return _UNET_MODEL

def get_yolo_model():
    global _YOLO_MODEL
    if _YOLO_MODEL is None and os.path.exists(YOLO_WEIGHTS_PATH):
        try:
            _YOLO_MODEL = YOLO(YOLO_WEIGHTS_PATH)
            print("[CV] Loaded Marine Debris YOLOv8 model successfully.")
        except Exception as e:
            print(f"[CV ERROR] Loading YOLOv8 failed: {e}")
    return _YOLO_MODEL

def segment_oil_spill(input_image: np.ndarray, threshold: float = 0.55):
    """
    Executes ResNet-34 U-Net segmentation on input SAR image (512x512).
    Returns (mask_binary, overlay_rgb, metrics_dict).
    """
    model = get_unet_model()
    h, w = input_image.shape[:2]
    
    # Preprocess
    img_resized = cv2.resize(input_image, (512, 512))
    if len(img_resized.shape) == 2:
        img_resized = cv2.cvtColor(img_resized, cv2.COLOR_GRAY2RGB)
    
    # Normalize with ImageNet mean/std
    img_norm = img_resized.astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_norm = (img_norm - mean) / std
    tensor = torch.from_numpy(img_norm).permute(2, 0, 1).unsqueeze(0).float().to(DEVICE)
    
    start_t = time.time()
    with torch.no_grad():
        if model is not None:
            with torch.amp.autocast("cuda", enabled=torch.cuda.is_available()):
                logits = model(tensor)
                probs = torch.sigmoid(logits).squeeze().cpu().numpy()
        else:
            gray = cv2.cvtColor(img_resized, cv2.COLOR_RGB2GRAY)
            _, thresh = cv2.threshold(gray, int(255 * (1.0 - threshold)), 255, cv2.THRESH_BINARY_INV)
            probs = thresh.astype(np.float32) / 255.0

    latency_ms = (time.time() - start_t) * 1000.0
    binary_mask = (probs > threshold).astype(np.uint8) * 255
    
    overlay = img_resized.copy()
    color_mask = np.zeros_like(img_resized)
    color_mask[binary_mask > 0] = [0, 240, 255]
    overlay = cv2.addWeighted(overlay, 0.7, color_mask, 0.3, 0)
    
    spill_pixels = np.count_nonzero(binary_mask)
    total_pixels = 512 * 512
    spill_fraction = (spill_pixels / total_pixels) * 100.0
    area_km2 = (spill_pixels * 100.0) / 1_000_000.0 * 25.0
    
    return {
        "binary_mask": binary_mask,
        "overlay": overlay,
        "spill_pixels": spill_pixels,
        "spill_percentage": spill_fraction,
        "estimated_area_km2": area_km2,
        "latency_ms": latency_ms,
        "mean_confidence": float(np.mean(probs[probs > threshold])) if np.any(probs > threshold) else 0.0
    }

class DebrisResult(dict):
    """Rich result that works both as dict and tuple for backwards compatibility"""
    def __init__(self, annotated_image, detections, latency_ms):
        super().__init__({
            "annotated_image": annotated_image,
            "detections": detections,
            "latency_ms": latency_ms
        })
        self.annotated_image = annotated_image
        self.detections = detections
        self.latency_ms = latency_ms

    def __iter__(self):
        return iter((self.annotated_image, self.detections, self.latency_ms))

    def __getitem__(self, item):
        if isinstance(item, int):
            return (self.annotated_image, self.detections, self.latency_ms)[item]
        return super().__getitem__(item)

def detect_marine_debris(image_np: np.ndarray, conf: float = 0.25, conf_threshold: float = None, **kwargs):
    """
    Executes YOLOv8 object detection on marine debris images/video frames.
    Accepts conf or conf_threshold.
    Returns DebrisResult supporting both dict and tuple access.
    """
    if conf_threshold is not None:
        conf = conf_threshold
        
    model = get_yolo_model()
    if model is None:
        return DebrisResult(image_np, [], 0.0)
    
    start_t = time.time()
    results = model.predict(image_np, conf=conf, imgsz=512, verbose=False)
    latency_ms = (time.time() - start_t) * 1000.0
    
    detections = []
    annotated_img = image_np.copy()
    
    if results and len(results) > 0:
        res = results[0]
        annotated_img = res.plot()
        for box in res.boxes:
            cls_id = int(box.cls.item())
            cls_name = res.names.get(cls_id, f"Class {cls_id}")
            score = float(box.conf.item())
            xyxy = box.xyxy.cpu().numpy()[0].tolist()
            detections.append({
                "class_name": cls_name,
                "confidence": score,
                "bbox": xyxy
            })
            
    return DebrisResult(annotated_img, detections, latency_ms)
