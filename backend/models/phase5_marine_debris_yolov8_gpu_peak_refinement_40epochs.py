import os
import sys
import shutil
import torch
from ultralytics import YOLO

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    # Detect GPU / CUDA
    USE_CUDA = torch.cuda.is_available()
    device_arg = 0 if USE_CUDA else "cpu"
    
    if USE_CUDA:
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        print(f"[ACCELERATION] 🚀 Utilizing NVIDIA GPU: {gpu_name} ({vram_gb:.2f} GB VRAM)")
    else:
        print("[ACCELERATION] Running on CPU.")

    DATASET_ROOT = r"c:\MarineGuardian\dataset"
    YAML_PATH = os.path.join(DATASET_ROOT, "yolo_debris", "marine_debris.yaml")
    RUNS_DIR = r"c:\MarineGuardian\backend\models\yolo_runs"
    WEIGHTS_DIR = r"c:\MarineGuardian\backend\models\weights"
    TARGET_BEST_WEIGHTS = os.path.join(WEIGHTS_DIR, "best_marine_debris_yolov8.pt")
    
    os.makedirs(RUNS_DIR, exist_ok=True)
    os.makedirs(WEIGHTS_DIR, exist_ok=True)

    # Resume from previous best checkpoint if exists
    if os.path.exists(TARGET_BEST_WEIGHTS):
        print(f"[LOAD] 📦 Resuming YOLOv8 training from previous checkpoint: {TARGET_BEST_WEIGHTS}")
        model = YOLO(TARGET_BEST_WEIGHTS)
    else:
        print("[LOAD] Starting from base yolov8n.pt")
        model = YOLO("yolov8n.pt")

    print("\n[TRAIN] Training YOLOv8 for 12 ADDITIONAL EPOCHS on Marine Debris Dataset...")
    print("=" * 75)

    results = model.train(
        data=YAML_PATH,
        epochs=12,
        imgsz=512,
        batch=16,
        device=device_arg,
        project=RUNS_DIR,
        name="debris_continue_12epochs",
        save=True,
        plots=True,
        verbose=True,
        workers=2 if USE_CUDA else 0
    )

    print("=" * 75)
    print("[COMPLETE] 12 Additional Epochs Finished Successfully!")

    # Save best weights
    run_best = os.path.join(RUNS_DIR, "debris_continue_12epochs", "weights", "best.pt")
    run_last = os.path.join(RUNS_DIR, "debris_continue_12epochs", "weights", "last.pt")

    if os.path.exists(run_best):
        shutil.copy2(run_best, TARGET_BEST_WEIGHTS)
        print(f"[SAVED] 🚀 Optimal Checkpoint Copied -> {TARGET_BEST_WEIGHTS}")
    elif os.path.exists(run_last):
        shutil.copy2(run_last, TARGET_BEST_WEIGHTS)
        print(f"[SAVED] Final Checkpoint Copied -> {TARGET_BEST_WEIGHTS}")

if __name__ == "__main__":
    main()
