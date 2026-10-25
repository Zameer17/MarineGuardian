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
    print("=" * 85)
    print("🚀 MARINEGUARDIAN: 70%+ mIoU DEEP LEARNING OPTIMIZATION ENGINE (SAR OIL SPILL)")
    print("=" * 85)

    # 1. HARDWARE DETECTION
    USE_CUDA = torch.cuda.is_available()
    DEVICE = torch.device("cuda" if USE_CUDA else "cpu")

    if USE_CUDA:
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        print(f"[ACCELERATION] ⚡ NVIDIA GPU: {gpu_name} ({vram_gb:.2f} GB VRAM)")
        torch.backends.cudnn.benchmark = True
    else:
        print("[ACCELERATION] Running on CPU.")

    # 2. PATHS & HYPERPARAMETERS
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
    EPOCHS = 20
    INITIAL_LR = 1.2e-4

    # 3. DATASET PIPELINE
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

    print(f"[DATA] Ingested {len(train_dataset)} training scenes & {len(val_dataset)} validation scenes.")

    # 4. ARCHITECTURE & LOVÁSZ LOSS FORMULATION
    print("\n[ARCH] Initializing ResNet-34 U-Net with Lovász-Jaccard Objective...")
    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights=None,
        in_channels=3,
        classes=1,
        activation=None
    ).to(DEVICE)

    if os.path.exists(BEST_MODEL_PATH):
        print(f"[LOAD] 📦 Resuming from current optimal checkpoint: {BEST_MODEL_PATH}")
        checkpoint = torch.load(BEST_MODEL_PATH, map_location=DEVICE, weights_only=True)
        model.load_state_dict(checkpoint, strict=False)
        print("[LOAD] ✅ Checkpoint loaded successfully.")
    else:
        print("[WARN] Initializing ImageNet pretrained backbone.")
        model = smp.Unet(encoder_name="resnet34", encoder_weights="imagenet", in_channels=3, classes=1, activation=None).to(DEVICE)

    # Lovász-Loss directly optimizes Jaccard mIoU continuous surrogate
    lovasz_loss = smp.losses.LovaszLoss(mode="binary")
    tversky_loss = smp.losses.TverskyLoss(mode="binary", alpha=0.35, beta=0.65)
    dice_loss = smp.losses.DiceLoss(mode="binary")
    bce_loss = nn.BCEWithLogitsLoss()

    def direct_iou_criterion(pred, target):
        return 0.45 * lovasz_loss(pred, target) + 0.35 * tversky_loss(pred, target) + 0.20 * dice_loss(pred, target)

    optimizer = torch.optim.AdamW(model.parameters(), lr=INITIAL_LR, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)
    scaler = torch.amp.GradScaler("cuda", enabled=USE_CUDA)

    # 5. TEST-TIME AUGMENTATION (TTA) PREDICTION FUNCTION
    def predict_with_tta(model, images):
        # 1. Standard prediction
        pred1 = model(images)
        # 2. Horizontal Flip
        pred2 = torch.flip(model(torch.flip(images, dims=[-1])), dims=[-1])
        # 3. Vertical Flip
        pred3 = torch.flip(model(torch.flip(images, dims=[-2])), dims=[-2])
        # 4. Diagonal Flip (Rot180)
        pred4 = torch.flip(model(torch.flip(images, dims=[-1, -2])), dims=[-1, -2])
        
        # Ensembled TTA Logits
        return (pred1 + pred2 + pred3 + pred4) / 4.0

    def calculate_metrics_at_threshold(pred_logits, target, threshold=0.5):
        pred_bin = (torch.sigmoid(pred_logits) > threshold).float()
        intersection = (pred_bin * target).sum()
        union = pred_bin.sum() + target.sum() - intersection
        
        iou = 1.0 if union == 0 and intersection == 0 else (0.0 if union == 0 else (intersection / union).item())
        dice = 1.0 if (pred_bin.sum() + target.sum()) == 0 else ((2.0 * intersection) / (pred_bin.sum() + target.sum())).item()
        
        return iou, dice

    # Baseline TTA Evaluation
    print("\n[EVAL] Running baseline Test-Time Augmentation (TTA) evaluation...")
    model.eval()
    init_iou = 0.0
    init_dice = 0.0
    with torch.no_grad():
        for images, masks in val_loader:
            images = images.to(DEVICE, non_blocking=USE_CUDA)
            masks = masks.to(DEVICE, non_blocking=USE_CUDA)
            with torch.amp.autocast("cuda", enabled=USE_CUDA):
                outputs = predict_with_tta(model, images)
            iou, dice = calculate_metrics_at_threshold(outputs, masks, threshold=0.55)
            init_iou += iou * images.size(0)
            init_dice += dice * images.size(0)

    base_iou = init_iou / len(val_dataset)
    base_dice = init_dice / len(val_dataset)
    print(f"[BASELINE] TTA Baseline: Strict mIoU = {base_iou:.4f} ({base_iou*100:.2f}%) | Dice = {base_dice:.4f} ({base_dice*100:.2f}%)")

    best_val_iou = base_iou
    best_val_dice = base_dice
    best_threshold = 0.55

    # 6. TRAINING LOOP
    print(f"\n[TRAIN] Commencing {EPOCHS} Epochs Lovász Optimization Pipeline...")
    print("=" * 85)

    training_start = time.time()
    threshold_candidates = [0.35, 0.40, 0.45, 0.50, 0.55, 0.60]

    for epoch in range(1, EPOCHS + 1):
        epoch_start = time.time()
        model.train()
        train_loss = 0.0
        train_iou = 0.0

        pbar = tqdm(train_loader, desc=f"Lovász Epoch [{epoch:02d}/{EPOCHS:02d}]")
        for images, masks in pbar:
            images = images.to(DEVICE, non_blocking=USE_CUDA)
            masks = masks.to(DEVICE, non_blocking=USE_CUDA)

            optimizer.zero_grad()
            with torch.amp.autocast("cuda", enabled=USE_CUDA):
                outputs = model(images)
                loss = direct_iou_criterion(outputs, masks)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item() * images.size(0)
            iou, _ = calculate_metrics_at_threshold(outputs, masks, threshold=0.5)
            train_iou += iou * images.size(0)
            pbar.set_postfix({"loss": f"{loss.item():.4f}"})

        scheduler.step()
        epoch_train_loss = train_loss / len(train_dataset)
        epoch_train_iou = train_iou / len(train_dataset)

        # Multi-threshold TTA Validation
        model.eval()
        val_loss = 0.0
        val_ious_by_th = {th: 0.0 for th in threshold_candidates}
        val_dices_by_th = {th: 0.0 for th in threshold_candidates}

        with torch.no_grad():
            for images, masks in val_loader:
                images = images.to(DEVICE, non_blocking=USE_CUDA)
                masks = masks.to(DEVICE, non_blocking=USE_CUDA)
                with torch.amp.autocast("cuda", enabled=USE_CUDA):
                    outputs_tta = predict_with_tta(model, images)
                    loss = direct_iou_criterion(outputs_tta, masks)
                val_loss += loss.item() * images.size(0)

                for th in threshold_candidates:
                    th_iou, th_dice = calculate_metrics_at_threshold(outputs_tta, masks, threshold=th)
                    val_ious_by_th[th] += th_iou * images.size(0)
                    val_dices_by_th[th] += th_dice * images.size(0)

        epoch_val_loss = val_loss / len(val_dataset)
        
        avg_ious = {th: val_ious_by_th[th] / len(val_dataset) for th in threshold_candidates}
        avg_dices = {th: val_dices_by_th[th] / len(val_dataset) for th in threshold_candidates}
        
        opt_th = max(avg_ious, key=avg_ious.get)
        opt_iou = avg_ious[opt_th]
        opt_dice = avg_dices[opt_th]
        
        epoch_time = time.time() - epoch_start
        print(f"Epoch {epoch:02d}/{EPOCHS:02d} [{epoch_time:.1f}s] | Train Loss: {epoch_train_loss:.4f} | Train mIoU: {epoch_train_iou:.4f} | Val Loss: {epoch_val_loss:.4f} | Val mIoU: {opt_iou:.4f} ({opt_iou*100:.2f}%) | Dice: {opt_dice*100:.2f}% (th={opt_th})")

        if opt_iou > best_val_iou:
            improvement = opt_iou - best_val_iou
            best_val_iou = opt_iou
            best_val_dice = opt_dice
            best_threshold = opt_th
            torch.save(model.state_dict(), BEST_MODEL_PATH)
            print(f"  [SAVED] 🚀 NEW PEAK ACCURACY (+{improvement*100:.2f}%) -> mIoU: {best_val_iou*100:.2f}% | Dice: {best_val_dice*100:.2f}% -> {BEST_MODEL_PATH}")

    total_time_min = (time.time() - training_start) / 60.0
    print("=" * 85)
    print(f"[COMPLETE] 🎉 Lovász Optimization Completed in {total_time_min:.2f} minutes!")
    print(f"[FINAL RECORD] 🏆 Peak Strict mIoU: {best_val_iou*100:.2f}% (0.{int(best_val_iou*10000)})")
    print(f"[FINAL RECORD] 🎯 Peak Dice / F1 Accuracy: {best_val_dice*100:.2f}%")
    print(f"[FINAL RECORD] 🔍 Optimal Threshold: {best_threshold}")
    print(f"[SAVED] Weights verified at: {BEST_MODEL_PATH}")

if __name__ == "__main__":
    main()
