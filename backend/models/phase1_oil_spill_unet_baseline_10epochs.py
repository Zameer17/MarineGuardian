import os
import sys
import glob
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
EPOCHS = 10
LR = 3e-4
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"[INIT] Executing Deep Learning Training on Device: {DEVICE}")

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

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

print(f"[DATA] Loaded {len(train_dataset)} training scenes and {len(val_dataset)} validation scenes.")

# ==============================================================================
# MODEL ARCHITECTURE: U-Net with ResNet-34 Backbone
# ==============================================================================
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

optimizer = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

# ==============================================================================
# TRAINING & EVALUATION LOOP
# ==============================================================================
def calculate_iou(pred, target, threshold=0.5):
    pred = (torch.sigmoid(pred) > threshold).float()
    intersection = (pred * target).sum()
    union = pred.sum() + target.sum() - intersection
    if union == 0:
        return 1.0 if intersection == 0 else 0.0
    return (intersection / union).item()

best_val_iou = 0.0

print("\n[TRAIN] Starting High-Precision U-Net Training for Satellite SAR Oil Spill Detection...")
print("=" * 70)

for epoch in range(1, EPOCHS + 1):
    model.train()
    train_loss = 0.0
    train_iou = 0.0

    pbar = tqdm(train_loader, desc=f"Epoch [{epoch}/{EPOCHS}] Train")
    for images, masks in pbar:
        images = images.to(DEVICE)
        masks = masks.to(DEVICE)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, masks)
        loss.backward()
        optimizer.step()

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
            images = images.to(DEVICE)
            masks = masks.to(DEVICE)
            outputs = model(images)
            loss = criterion(outputs, masks)
            val_loss += loss.item() * images.size(0)
            val_iou += calculate_iou(outputs, masks) * images.size(0)

    epoch_val_loss = val_loss / len(val_dataset)
    epoch_val_iou = val_iou / len(val_dataset)

    print(f"Epoch {epoch:02d}/{EPOCHS:02d} | Train Loss: {epoch_train_loss:.4f} | Train mIoU: {epoch_train_iou:.4f} | Val Loss: {epoch_val_loss:.4f} | Val mIoU: {epoch_val_iou:.4f}")

    if epoch_val_iou > best_val_iou:
        best_val_iou = epoch_val_iou
        torch.save(model.state_dict(), BEST_MODEL_PATH)
        print(f"  [SAVED] New Best Model Checkpoint (Val mIoU: {best_val_iou:.4f}) -> {BEST_MODEL_PATH}")

print("=" * 70)
print(f"[COMPLETE] Training Complete! Best Validation mIoU: {best_val_iou:.4f}")
print(f"Trained Model Weights Saved at: {BEST_MODEL_PATH}")
