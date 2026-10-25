import os
import sys
import glob
import time
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import albumentations as A
from albumentations.pytorch import ToTensorV2
import segmentation_models_pytorch as smp
from tqdm import tqdm

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    # ==============================================================================
    # HARDWARE & DEVICE DETECTION
    # ==============================================================================
    USE_CUDA = torch.cuda.is_available()
    DEVICE = torch.device("cuda" if USE_CUDA else "cpu")

    if USE_CUDA:
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        print(f"[ACCELERATION] 🚀 Utilizing NVIDIA GPU: {gpu_name} ({vram_gb:.2f} GB VRAM)")
        torch.backends.cudnn.benchmark = True
    else:
        num_threads = min(8, os.cpu_count() or 4)
        torch.set_num_threads(num_threads)
        print(f"[ACCELERATION] Running on CPU with {num_threads} multi-threads.")

    # ==============================================================================
    # CONFIGURATION
    # ==============================================================================
    DATASET_DIR = r"c:\MarineGuardian\dataset\oil-spill"
    TRAIN_IMG_DIR = os.path.join(DATASET_DIR, "train", "images")
    TRAIN_MASK_DIR = os.path.join(DATASET_DIR, "train", "labels")
    TEST_IMG_DIR = os.path.join(DATASET_DIR, "test", "images")
    TEST_MASK_DIR = os.path.join(DATASET_DIR, "test", "labels")

    MODEL_SAVE_DIR = r"c:\MarineGuardian\backend\models\weights"
    os.makedirs(MODEL_SAVE_DIR, exist_ok=True)
    BEST_MODEL_PATH = os.path.join(MODEL_SAVE_DIR, "best_oil_spill_unet.pth")

    IMG_SIZE = (512, 512)
    BATCH_SIZE = 8
    ADDITIONAL_EPOCHS = 10
    FINE_TUNE_LR = 1.2e-4

    # ==============================================================================
    # DATASET & AUGMENTATION PIPELINE
    # ==============================================================================
    class SAROilSpillDataset(Dataset):
        def __init__(self, img_dir, mask_dir, transform=None):
            self.img_paths = sorted(glob.glob(os.path.join(img_dir, "*.jpg")))
            self.mask_paths = sorted(glob.glob(os.path.join(mask_dir, "*.png")))
            self.transform = transform
            assert len(self.img_paths) == len(self.mask_paths), "Mismatch between images and masks count"

        def __len__(self):
            return len(self.img_paths)

        def __getitem__(self, idx):
            image = np.array(Image.open(self.img_paths[idx]).convert("RGB"))
            mask_raw = np.array(Image.open(self.mask_paths[idx]).convert("RGB"))
            
            # Extract Oil Spill class: Cyan [0,255,255] or Red [255,0,0]
            oil_mask = (
                ((mask_raw[:, :, 0] == 0) & (mask_raw[:, :, 1] == 255) & (mask_raw[:, :, 2] == 255)) |
                ((mask_raw[:, :, 0] == 255) & (mask_raw[:, :, 1] == 0) & (mask_raw[:, :, 2] == 0))
            ).astype(np.float32)

            if self.transform:
                augmented = self.transform(image=image, mask=oil_mask)
                image = augmented["image"]
                oil_mask = augmented["mask"]

            if len(oil_mask.shape) == 2:
                oil_mask = oil_mask.unsqueeze(0)

            return image, oil_mask

    train_transform = A.Compose([
        A.Resize(IMG_SIZE[0], IMG_SIZE[1]),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.RandomRotate90(p=0.5),
        A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=15, p=0.4),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2()
    ])

    val_transform = A.Compose([
        A.Resize(IMG_SIZE[0], IMG_SIZE[1]),
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2()
    ])

    train_dataset = SAROilSpillDataset(TRAIN_IMG_DIR, TRAIN_MASK_DIR, transform=train_transform)
    val_dataset = SAROilSpillDataset(TEST_IMG_DIR, TEST_MASK_DIR, transform=val_transform)

    train_loader = DataLoader(
        train_dataset, 
        batch_size=BATCH_SIZE, 
        shuffle=True, 
        num_workers=0,
        pin_memory=USE_CUDA
    )
    val_loader = DataLoader(
        val_dataset, 
        batch_size=BATCH_SIZE, 
        shuffle=False, 
        num_workers=0,
        pin_memory=USE_CUDA
    )

    print(f"[DATA] Loaded {len(train_dataset)} training scenes and {len(val_dataset)} validation scenes.")

    # ==============================================================================
    # MODEL ARCHITECTURE & CHECKPOINT LOADING
    # ==============================================================================
    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights=None,
        in_channels=3,
        classes=1,
        activation=None
    ).to(DEVICE)

    # Load existing best weights
    if os.path.exists(BEST_MODEL_PATH):
        print(f"[LOAD] Loading existing best weights from {BEST_MODEL_PATH}...")
        checkpoint = torch.load(BEST_MODEL_PATH, map_location=DEVICE, weights_only=True)
        model.load_state_dict(checkpoint)
        print("[LOAD] Successfully loaded existing weights.")
    else:
        print("[WARN] No previous weights found; initializing pretrained encoder.")
        model = smp.Unet(
            encoder_name="resnet34",
            encoder_weights="imagenet",
            in_channels=3,
            classes=1,
            activation=None
        ).to(DEVICE)

    dice_loss = smp.losses.DiceLoss(mode="binary")
    bce_loss = nn.BCEWithLogitsLoss()

    def criterion(pred, target):
        return 0.6 * dice_loss(pred, target) + 0.4 * bce_loss(pred, target)

    optimizer = torch.optim.AdamW(model.parameters(), lr=FINE_TUNE_LR, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=ADDITIONAL_EPOCHS, eta_min=1e-6)
    scaler = torch.amp.GradScaler("cuda", enabled=USE_CUDA)

    # ==============================================================================
    # METRICS & INITIAL VALIDATION
    # ==============================================================================
    def calculate_iou(pred, target, threshold=0.5):
        pred = (torch.sigmoid(pred) > threshold).float()
        intersection = (pred * target).sum()
        union = pred.sum() + target.sum() - intersection
        if union == 0:
            return 1.0 if intersection == 0 else 0.0
        return (intersection / union).item()

    # Baseline validation check
    print("\n[EVAL] Running baseline evaluation on loaded weights...")
    model.eval()
    init_val_loss = 0.0
    init_val_iou = 0.0
    with torch.no_grad():
        for images, masks in val_loader:
            images = images.to(DEVICE, non_blocking=USE_CUDA)
            masks = masks.to(DEVICE, non_blocking=USE_CUDA)
            with torch.amp.autocast("cuda", enabled=USE_CUDA):
                outputs = model(images)
                loss = criterion(outputs, masks)
            init_val_loss += loss.item() * images.size(0)
            init_val_iou += calculate_iou(outputs, masks) * images.size(0)

    baseline_val_iou = init_val_iou / len(val_dataset)
    baseline_val_loss = init_val_loss / len(val_dataset)
    print(f"[BASELINE] Initial Baseline Val Loss: {baseline_val_loss:.4f} | Baseline Val mIoU: {baseline_val_iou:.4f}")

    best_val_iou = baseline_val_iou

    # ==============================================================================
    # 10 ADDITIONAL EPOCHS TRAINING LOOP
    # ==============================================================================
    print(f"\n[TRAIN] Commencing {ADDITIONAL_EPOCHS} More Epochs (Epochs 11-20 Equivalent)...")
    print("=" * 75)

    total_start_time = time.time()

    for epoch in range(1, ADDITIONAL_EPOCHS + 1):
        epoch_start = time.time()
        model.train()
        train_loss = 0.0
        train_iou = 0.0

        pbar = tqdm(train_loader, desc=f"Addl Epoch [{epoch:02d}/{ADDITIONAL_EPOCHS:02d}] (Total {10+epoch}/20)")
        for images, masks in pbar:
            images = images.to(DEVICE, non_blocking=USE_CUDA)
            masks = masks.to(DEVICE, non_blocking=USE_CUDA)

            optimizer.zero_grad()
            with torch.amp.autocast("cuda", enabled=USE_CUDA):
                outputs = model(images)
                loss = criterion(outputs, masks)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item() * images.size(0)
            train_iou += calculate_iou(outputs, masks) * images.size(0)
            pbar.set_postfix({"loss": f"{loss.item():.4f}"})

        scheduler.step()
        epoch_train_loss = train_loss / len(train_dataset)
        epoch_train_iou = train_iou / len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        val_iou = 0.0
        with torch.no_grad():
            for images, masks in val_loader:
                images = images.to(DEVICE, non_blocking=USE_CUDA)
                masks = masks.to(DEVICE, non_blocking=USE_CUDA)
                with torch.amp.autocast("cuda", enabled=USE_CUDA):
                    outputs = model(images)
                    loss = criterion(outputs, masks)
                val_loss += loss.item() * images.size(0)
                val_iou += calculate_iou(outputs, masks) * images.size(0)

        epoch_val_loss = val_loss / len(val_dataset)
        epoch_val_iou = val_iou / len(val_dataset)
        epoch_duration = time.time() - epoch_start

        print(f"Epoch {epoch:02d}/{ADDITIONAL_EPOCHS:02d} (Total {10+epoch:02d}/20) [{epoch_duration:.1f}s] | Train Loss: {epoch_train_loss:.4f} | Train mIoU: {epoch_train_iou:.4f} | Val Loss: {epoch_val_loss:.4f} | Val mIoU: {epoch_val_iou:.4f}")

        if epoch_val_iou > best_val_iou:
            improvement = epoch_val_iou - best_val_iou
            best_val_iou = epoch_val_iou
            torch.save(model.state_dict(), BEST_MODEL_PATH)
            print(f"  [SAVED] 🚀 New Best Model Checkpoint (+{improvement*100:.2f}%) -> Val mIoU: {best_val_iou:.4f} -> {BEST_MODEL_PATH}")

    total_elapsed = time.time() - total_start_time
    print("=" * 75)
    print(f"[COMPLETE] 10 Additional Epochs Finished in {total_elapsed/60:.2f} minutes!")
    print(f"[METRICS] Final Best Validation mIoU: {best_val_iou:.4f} ({best_val_iou*100:.2f}%)")
    print(f"[WEIGHTS] Optimal Model Weights Saved at: {BEST_MODEL_PATH}")

if __name__ == "__main__":
    main()
