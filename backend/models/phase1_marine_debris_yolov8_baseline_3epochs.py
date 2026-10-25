import os
import sys
import json
import shutil
from collections import defaultdict
from tqdm import tqdm
from ultralytics import YOLO

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

DATASET_ROOT = r"c:\MarineGuardian\dataset"
ORIG_IMG_DIR = os.path.join(DATASET_ROOT, "original_data", "images")
INST_JSON_TRAIN = os.path.join(DATASET_ROOT, "instance_version", "instances_train_trashcan.json")
INST_JSON_VAL = os.path.join(DATASET_ROOT, "instance_version", "instances_val_trashcan.json")

YOLO_DIR = os.path.join(DATASET_ROOT, "yolo_debris")
RUNS_DIR = r"c:\MarineGuardian\backend\models\yolo_runs"
WEIGHTS_DIR = r"c:\MarineGuardian\backend\models\weights"

os.makedirs(os.path.join(YOLO_DIR, "train", "images"), exist_ok=True)
os.makedirs(os.path.join(YOLO_DIR, "train", "labels"), exist_ok=True)
os.makedirs(os.path.join(YOLO_DIR, "val", "images"), exist_ok=True)
os.makedirs(os.path.join(YOLO_DIR, "val", "labels"), exist_ok=True)
os.makedirs(RUNS_DIR, exist_ok=True)
os.makedirs(WEIGHTS_DIR, exist_ok=True)

TARGET_BEST_WEIGHTS = os.path.join(WEIGHTS_DIR, "best_marine_debris_yolov8.pt")

print("[1/2] Preparing YOLO-format labels from TrashCan COCO annotations...")

with open(INST_JSON_TRAIN, "r") as f:
    train_coco = json.load(f)

categories = train_coco.get("categories", [])
cat_to_id = {c["id"]: idx for idx, c in enumerate(categories)}
cat_names = [c["name"] for c in categories]

def convert_split(coco_json_path, split_name):
    with open(coco_json_path, "r") as f:
        data = json.load(f)

    images = {img["id"]: img for img in data["images"]}
    img_to_anns = defaultdict(list)
    for ann in data["annotations"]:
        img_to_anns[ann["image_id"]].append(ann)

    for img_id, img_info in tqdm(images.items(), desc=f"Converting {split_name}"):
        file_name = img_info["file_name"]
        W = img_info["width"]
        H = img_info["height"]

        src_path = os.path.join(ORIG_IMG_DIR, file_name)
        if not os.path.exists(src_path):
            continue

        dst_img_path = os.path.join(YOLO_DIR, split_name, "images", file_name)
        dst_lbl_path = os.path.join(YOLO_DIR, split_name, "labels", os.path.splitext(file_name)[0] + ".txt")

        if not os.path.exists(dst_img_path):
            try:
                os.link(src_path, dst_img_path)
            except Exception:
                shutil.copy2(src_path, dst_img_path)

        lines = []
        for ann in img_to_anns.get(img_id, []):
            cid = cat_to_id.get(ann["category_id"], 0)
            bx, by, bw, bh = ann["bbox"]
            if bw <= 0 or bh <= 0:
                continue

            x_center = (bx + bw / 2.0) / W
            y_center = (by + bh / 2.0) / H
            norm_w = bw / W
            norm_h = bh / H

            x_center = max(0.0, min(1.0, x_center))
            y_center = max(0.0, min(1.0, y_center))
            norm_w = max(0.0, min(1.0, norm_w))
            norm_h = max(0.0, min(1.0, norm_h))

            lines.append(f"{cid} {x_center:.6f} {y_center:.6f} {norm_w:.6f} {norm_h:.6f}")

        with open(dst_lbl_path, "w") as lf:
            lf.write("\n".join(lines))

convert_split(INST_JSON_TRAIN, "train")
convert_split(INST_JSON_VAL, "val")

# Write marine_debris.yaml
yaml_path = os.path.join(YOLO_DIR, "marine_debris.yaml")
yaml_content = f"""path: {YOLO_DIR}
train: train/images
val: val/images

names:
"""
for idx, name in enumerate(cat_names):
    yaml_content += f"  {idx}: {name}\n"

with open(yaml_path, "w") as yf:
    yf.write(yaml_content)

print(f"[OK] YOLO Dataset ready at: {yaml_path}")

print("\n[2/2] Training YOLOv8 for exactly 3 EPOCHS on Marine Debris Dataset...")
print("=" * 70)

model = YOLO("yolov8n.pt")

results = model.train(
    data=yaml_path,
    epochs=3,
    imgsz=512,
    batch=16,
    device="cpu",
    project=RUNS_DIR,
    name="debris_3epochs",
    save=True,
    plots=True,
    verbose=True
)

print("=" * 70)
print("[COMPLETE] 3-Epoch YOLOv8 Marine Debris Training Finished Successfully!")

# Save to weights directory
best_pt = os.path.join(RUNS_DIR, "debris_3epochs", "weights", "best.pt")
last_pt = os.path.join(RUNS_DIR, "debris_3epochs", "weights", "last.pt")

if os.path.exists(best_pt):
    shutil.copy2(best_pt, TARGET_BEST_WEIGHTS)
    print(f"[SAVED] Optimal Checkpoint Copied -> {TARGET_BEST_WEIGHTS}")
elif os.path.exists(last_pt):
    shutil.copy2(last_pt, TARGET_BEST_WEIGHTS)
    print(f"[SAVED] Final Checkpoint Copied -> {TARGET_BEST_WEIGHTS}")
