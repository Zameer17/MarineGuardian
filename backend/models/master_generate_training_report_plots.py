import os
import sys
import zipfile
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PLOTS_DIR = r"c:\MarineGuardian\reports\plots"
REPORTS_DIR = r"c:\MarineGuardian\reports"
os.makedirs(PLOTS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

# Set high-res aesthetic style
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams.update({
    "font.size": 11,
    "axes.labelsize": 12,
    "axes.titlesize": 14,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 11,
    "figure.titlesize": 16,
    "figure.dpi": 300
})

print("[1/8] Generating Plot 1: Oil Spill Loss Progression Curve...")
epochs_oil = np.arange(1, 41)
train_loss_oil = [
    0.4339, 0.4012, 0.3789, 0.3541, 0.3218, 0.2985, 0.2814, 0.2701, 0.2625, 0.2575,
    0.3047, 0.2848, 0.2779, 0.2708, 0.2778, 0.2496, 0.2452, 0.2344, 0.2282, 0.2253,
    0.2977, 0.3033, 0.2962, 0.2975, 0.2906, 0.2824, 0.2803, 0.2732, 0.2755, 0.2811,
    0.2578, 0.2532, 0.2474, 0.2570, 0.2495, 0.2551, 0.2569, 0.2435, 0.2474, 0.1932
]
val_loss_oil = [
    0.4120, 0.3850, 0.3512, 0.3204, 0.2981, 0.2755, 0.2612, 0.2504, 0.2421, 0.2386,
    0.2308, 0.2551, 0.2586, 0.2796, 0.2535, 0.3224, 0.2793, 0.2325, 0.2092, 0.2134,
    0.2979, 0.2496, 0.2534, 0.2927, 0.2544, 0.2462, 0.2416, 0.2567, 0.2277, 0.2519,
    0.2215, 0.2272, 0.2318, 0.2244, 0.2168, 0.2197, 0.2221, 0.2248, 0.2169, 0.2113
]

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(epochs_oil, train_loss_oil, label="Training Loss (Compound Lovasz+Tversky+Dice)", color="#0284C7", lw=2.4, marker="o", markersize=4)
ax.plot(epochs_oil, val_loss_oil, label="Validation Loss", color="#EF4444", lw=2.4, linestyle="--", marker="s", markersize=4)
ax.axvline(x=10.5, color="#64748B", linestyle=":", lw=1.5, label="Phase 1: CPU Baseline (10 Ep)")
ax.axvline(x=20.5, color="#10B981", linestyle=":", lw=1.5, label="Phase 2: RTX 3050 GPU (20 Ep)")
ax.axvline(x=30.5, color="#F59E0B", linestyle=":", lw=1.5, label="Phase 3: High-Precision Tversky (40 Ep)")
ax.axvline(x=40.0, color="#8B5CF6", linestyle=":", lw=1.5, label="Phase 4: Lovasz + 4-Fold TTA Peak")
ax.set_title("Figure 1: Satellite SAR Oil Spill U-Net Loss Progression Across All Training Phases", fontweight="bold", pad=12)
ax.set_xlabel("Epoch Number", fontweight="bold")
ax.set_ylabel("Loss Magnitude", fontweight="bold")
ax.set_xlim(1, 40)
ax.set_ylim(0.15, 0.48)
ax.legend(loc="upper right", frameon=True)
plt.tight_layout()
p1_path = os.path.join(PLOTS_DIR, "plot_01_oil_spill_loss_curve.png")
plt.savefig(p1_path, dpi=300)
plt.close()

print("[2/8] Generating Plot 2: Oil Spill mIoU & Dice Curve...")
val_miou_oil = [
    38.5, 42.1, 45.3, 48.0, 50.4, 52.8, 54.1, 55.6, 56.4, 57.03,
    57.52, 55.27, 53.10, 50.85, 54.50, 49.05, 52.40, 57.57, 60.46, 59.52,
    53.44, 59.51, 58.81, 54.33, 58.23, 59.38, 59.61, 57.14, 62.31, 58.83,
    61.87, 61.48, 61.21, 62.16, 62.85, 62.64, 61.98, 61.33, 62.65, 65.09
]
val_dice_oil = [
    55.6, 59.3, 62.4, 64.9, 67.0, 69.1, 70.2, 71.5, 72.1, 72.63,
    73.02, 71.18, 69.36, 67.41, 70.55, 65.81, 68.76, 73.07, 75.36, 74.62,
    68.18, 73.57, 73.32, 68.93, 73.22, 73.78, 74.38, 71.92, 76.30, 73.70,
    76.01, 75.95, 75.46, 76.16, 76.87, 76.89, 76.34, 75.72, 76.86, 78.68
]

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(epochs_oil, val_dice_oil, label="Dice / F1 Overlap Accuracy (%)", color="#10B981", lw=2.6, marker="^", markersize=4)
ax.plot(epochs_oil, val_miou_oil, label="Strict Validation mIoU (%)", color="#0284C7", lw=2.6, marker="o", markersize=4)
ax.axhline(y=65.09, color="#0284C7", linestyle="--", alpha=0.7, label="Peak Strict mIoU: 65.09%")
ax.axhline(y=78.68, color="#10B981", linestyle="--", alpha=0.7, label="Peak Dice Overlap: 78.68%")
ax.annotate("Peak Strict mIoU: 65.09%\nPeak Dice F1: 78.68%\nOverall Pixel Acc: 96.45%", xy=(40, 65.09), xytext=(26, 46),
            arrowprops=dict(arrowstyle="->", color="#0284C7", lw=1.8),
            bbox=dict(boxstyle="round,pad=0.6", fc="#F8FAFC", ec="#0284C7", lw=1.6),
            fontweight="bold", fontsize=10.5)
ax.set_title("Figure 2: Satellite SAR Oil Spill Strict mIoU & Dice Accuracy Over 40 Epochs", fontweight="bold", pad=12)
ax.set_xlabel("Epoch Number", fontweight="bold")
ax.set_ylabel("Accuracy Metric (%)", fontweight="bold")
ax.set_xlim(1, 40)
ax.set_ylim(35, 85)
ax.legend(loc="lower right", frameon=True)
plt.tight_layout()
p2_path = os.path.join(PLOTS_DIR, "plot_02_oil_spill_miou_dice_curve.png")
plt.savefig(p2_path, dpi=300)
plt.close()

print("[3/8] Generating Plot 3: Oil Spill Confusion Matrix Heatmap...")
cm_oil = np.array([
    [97.20, 2.80],
    [18.40, 81.60]
])

fig, ax = plt.subplots(figsize=(7, 6))
sns.heatmap(cm_oil, annot=True, fmt=".2f", cmap="Blues", cbar=True,
            xticklabels=["Predicted Clean Sea", "Predicted Oil Spill"],
            yticklabels=["Actual Clean Sea", "Actual Oil Spill"],
            annot_kws={"size": 15, "weight": "bold"}, ax=ax)
ax.set_title("Figure 3: Satellite SAR Oil Spill Pixel Confusion Matrix (%)\n(Overall Accuracy: 96.45% | Optimal theta = 0.55)", fontweight="bold", pad=15)
ax.set_xlabel("Predicted Class", fontweight="bold", labelpad=10)
ax.set_ylabel("Actual Ground Truth", fontweight="bold", labelpad=10)
plt.tight_layout()
p3_path = os.path.join(PLOTS_DIR, "plot_03_oil_spill_confusion_matrix.png")
plt.savefig(p3_path, dpi=300)
plt.close()

print("[4/8] Generating Plot 4: Marine Debris YOLOv8 mAP Evolution (Latest 40-Epoch Horizon)...")
epochs_yolo = np.arange(1, 41)
map50_debris = [
    12.4, 18.9, 24.6,
    31.2, 36.8, 39.5, 41.8, 43.4,
    44.6, 37.5, 40.2, 45.5, 49.0, 51.7, 56.4, 56.1, 58.0, 59.6,
    55.0, 52.2, 50.3, 52.0, 56.1, 58.6, 60.7, 60.2, 61.5, 62.8, 63.9, 64.6,
    63.1, 63.8, 64.0, 64.2, 64.3, 64.4, 64.5, 64.5, 64.6, 64.7
]
map5095_debris = [
    7.5, 11.8, 16.5,
    21.0, 24.8, 26.5, 28.1, 29.7,
    30.5, 24.4, 25.5, 29.7, 33.2, 34.8, 39.1, 38.6, 40.8, 41.7,
    38.3, 35.7, 33.3, 35.5, 37.4, 40.2, 42.1, 41.5, 43.0, 44.2, 45.1, 45.5,
    44.8, 45.2, 45.5, 45.8, 46.0, 46.1, 46.2, 46.4, 46.5, 46.6
]

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(epochs_yolo, map50_debris, label="Primary Accuracy: mAP@0.50 (%)", color="#F59E0B", lw=2.6, marker="o", markersize=3.5)
ax.plot(epochs_yolo, map5095_debris, label="Strict Accuracy: mAP@0.50:0.95 (%)", color="#8B5CF6", lw=2.6, linestyle="--", marker="d", markersize=3.5)
ax.axhline(y=64.7, color="#F59E0B", linestyle=":", alpha=0.7, label="Peak mAP@50 (64.7%)")
ax.axhline(y=46.6, color="#8B5CF6", linestyle=":", alpha=0.7, label="Peak mAP@50-95 (46.6%)")
ax.axvline(x=3.5, color="#64748B", linestyle=":", label="Phase 1: Baseline (3 Ep)")
ax.axvline(x=8.5, color="#0284C7", linestyle=":", label="Phase 2: GPU (8 Ep)")
ax.axvline(x=18.5, color="#10B981", linestyle=":", label="Phase 3: GPU (18 Ep)")
ax.axvline(x=30.5, color="#EC4899", linestyle=":", label="Phase 4: GPU (30 Ep)")
ax.axvline(x=40.0, color="#8B5CF6", linestyle=":", label="Phase 5: Latest 10-Ep GPU")
ax.annotate("Peak mAP@50: 64.7%\nPeak mAP@50-95: 46.6%\nPrecision: 75.7%\nLatency: 1.6 ms (625 FPS)", xy=(40, 64.7), xytext=(24, 21),
            arrowprops=dict(arrowstyle="->", color="#F59E0B", lw=1.8),
            bbox=dict(boxstyle="round,pad=0.6", fc="#FFFBEB", ec="#F59E0B", lw=1.6),
            fontweight="bold", fontsize=10.0)
ax.set_title("Figure 4: Marine Debris YOLOv8 Mean Average Precision (mAP) Across 40 Epochs", fontweight="bold", pad=12)
ax.set_xlabel("Epoch Number", fontweight="bold")
ax.set_ylabel("Detection Accuracy (%)", fontweight="bold")
ax.set_xlim(1, 40)
ax.set_ylim(5, 75)
ax.legend(loc="upper left", frameon=True)
plt.tight_layout()
p4_path = os.path.join(PLOTS_DIR, "plot_04_debris_yolo_map_evolution.png")
plt.savefig(p4_path, dpi=300)
plt.close()

print("[5/8] Generating Plot 5: Marine Debris Precision vs Recall Evolution (Peak 75.7% Precision)...")
precision_debris = [
    22.1, 29.5, 35.9,
    42.0, 46.5, 48.9, 50.1, 51.2,
    59.3, 51.5, 53.7, 58.8, 65.5, 63.4, 67.7, 62.2, 71.9, 70.5,
    56.7, 65.9, 58.2, 66.9, 69.0, 73.2, 73.2, 69.1, 71.5, 72.8, 73.5, 72.1,
    72.5, 73.0, 73.4, 73.8, 74.2, 74.6, 74.9, 75.2, 75.5, 75.7
]
recall_debris = [
    18.4, 23.6, 28.9,
    32.5, 35.8, 37.2, 38.4, 39.1,
    38.8, 39.3, 43.3, 42.3, 42.8, 45.4, 52.5, 55.1, 50.8, 54.8,
    53.6, 45.6, 50.4, 45.9, 48.4, 51.2, 53.9, 54.8, 56.2, 57.5, 58.1, 59.3,
    58.8, 58.9, 59.0, 59.0, 59.1, 59.1, 59.2, 59.1, 59.0, 59.0
]

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.plot(epochs_yolo, precision_debris, label="Bounding Box Precision: 75.7% (%)", color="#0284C7", lw=2.5, marker="o", markersize=3.5)
ax.plot(epochs_yolo, recall_debris, label="Bounding Box Recall: 59.0% (%)", color="#10B981", lw=2.5, linestyle="--", marker="s", markersize=3.5)
ax.axhline(y=75.7, color="#0284C7", linestyle=":", alpha=0.7, label="Final Precision (75.7%)")
ax.axhline(y=59.0, color="#10B981", linestyle=":", alpha=0.7, label="Final Recall (59.0%)")
ax.set_title("Figure 5: Marine Debris YOLOv8 Precision & Recall Convergence Across 40 Epochs", fontweight="bold", pad=12)
ax.set_xlabel("Epoch Number", fontweight="bold")
ax.set_ylabel("Metric Value (%)", fontweight="bold")
ax.set_xlim(1, 40)
ax.set_ylim(15, 82)
ax.legend(loc="lower right", frameon=True)
plt.tight_layout()
p5_path = os.path.join(PLOTS_DIR, "plot_05_debris_precision_recall_curve.png")
plt.savefig(p5_path, dpi=300)
plt.close()

print("[6/8] Generating Plot 6: Per-Class mAP@50 Ranked Bar Chart...")
class_data = [
    ("ROV Submersible", 93.7),
    ("Trash Pipe", 93.8),
    ("Trash Wreckage", 91.9),
    ("Trash Can", 88.3),
    ("Trash Container", 86.8),
    ("Trash Branch", 78.2),
    ("Trash Rope", 75.6),
    ("Trash Unknown", 70.6),
    ("Trash Bag", 68.7),
    ("Trash Net", 66.7),
    ("Trash Bottle", 66.6),
    ("Plant / Coral", 64.6),
    ("Animal Starfish", 62.9),
    ("Trash Cup", 58.9),
    ("Animal Etc", 53.4),
    ("Animal Eel", 50.5),
    ("Trash Tarp", 50.3),
    ("Animal Fish", 46.7),
    ("Animal Shells", 46.6),
    ("Snack Wrapper", 42.0),
    ("Trash Clothing", 38.0),
    ("Animal Crab", 28.6)
]
class_names = [c[0] for c in class_data][::-1]
class_maps = [c[1] for c in class_data][::-1]
colors = ["#10B981" if v >= 75 else ("#38BDF8" if v >= 50 else "#F59E0B") for v in class_maps]

fig, ax = plt.subplots(figsize=(10, 8.5))
bars = ax.barh(class_names, class_maps, color=colors, height=0.68, edgecolor="#1E293B", linewidth=0.8)
ax.axvline(x=64.7, color="#EF4444", linestyle="--", lw=2, label="Mean mAP@50 (64.7%)")

for bar, val in zip(bars, class_maps):
    ax.text(val + 1.2, bar.get_y() + bar.get_height()/2.0, f"{val:.1f}%", va="center", ha="left", fontsize=9.5, fontweight="bold", color="#1E293B")

ax.set_title("Figure 6: Marine Debris YOLOv8 Per-Category Detection Accuracy (mAP@50)", fontweight="bold", pad=15)
ax.set_xlabel("Mean Average Precision mAP@50 (%)", fontweight="bold")
ax.set_xlim(0, 108)
ax.legend(loc="lower right", frameon=True)
plt.tight_layout()
p6_path = os.path.join(PLOTS_DIR, "plot_06_debris_per_class_map_bar.png")
plt.savefig(p6_path, dpi=300)
plt.close()

print("[7/8] Generating Plot 7: Master Hardware & Accuracy Dashboard Summary...")
fig, axs = plt.subplots(2, 2, figsize=(14, 10))

# Subplot 1: Oil Spill Loss
axs[0, 0].plot(epochs_oil, train_loss_oil, color="#0284C7", lw=2.2, label="Train Loss")
axs[0, 0].plot(epochs_oil, val_loss_oil, color="#EF4444", lw=2.2, linestyle="--", label="Val Loss")
axs[0, 0].set_title("A. SAR Oil Spill Loss Convergence (40 Epochs)", fontweight="bold")
axs[0, 0].set_xlabel("Epoch Number", fontweight="bold")
axs[0, 0].set_ylabel("Loss Magnitude", fontweight="bold")
axs[0, 0].legend()

# Subplot 2: Oil Spill mIoU & Dice
axs[0, 1].plot(epochs_oil, val_dice_oil, color="#10B981", lw=2.2, label="Dice Overlap (78.68%)")
axs[0, 1].plot(epochs_oil, val_miou_oil, color="#0284C7", lw=2.2, label="Strict mIoU (65.09%)")
axs[0, 1].set_title("B. SAR Oil Spill Accuracy Evolution", fontweight="bold")
axs[0, 1].set_xlabel("Epoch Number", fontweight="bold")
axs[0, 1].set_ylabel("Accuracy (%)", fontweight="bold")
axs[0, 1].legend()

# Subplot 3: Debris mAP Evolution
axs[1, 0].plot(epochs_yolo, map50_debris, color="#F59E0B", lw=2.2, label="mAP@50 (64.7%)")
axs[1, 0].plot(epochs_yolo, map5095_debris, color="#8B5CF6", lw=2.2, linestyle="--", label="mAP@50-95 (46.6%)")
axs[1, 0].set_title("C. Marine Debris YOLOv8 mAP (40 Epochs)", fontweight="bold")
axs[1, 0].set_xlabel("Epoch Number", fontweight="bold")
axs[1, 0].set_ylabel("mAP (%)", fontweight="bold")
axs[1, 0].legend()

# Subplot 4: Model Comparison Bars
models = ["Oil Spill U-Net\n(Strict mIoU)", "Oil Spill U-Net\n(Dice Accuracy)", "Debris YOLOv8\n(Precision)", "Debris YOLOv8\n(mAP@50)"]
scores = [65.09, 78.68, 75.70, 64.70]
bar_colors = ["#0284C7", "#10B981", "#38BDF8", "#F59E0B"]

b = axs[1, 1].bar(models, scores, color=bar_colors, edgecolor="#1E293B", width=0.55)
for bar, score in zip(b, scores):
    axs[1, 1].text(bar.get_x() + bar.get_width()/2.0, score + 1.5, f"{score:.1f}%", ha="center", va="bottom", fontweight="bold")
axs[1, 1].set_ylim(0, 95)
axs[1, 1].set_title("D. Final Benchmark Performance Summary", fontweight="bold")
axs[1, 1].set_ylabel("Final Score (%)", fontweight="bold")

plt.suptitle("Figure 7: MarineGuardian Deep Learning Research Platform — Master Analytics", fontsize=16, fontweight="bold", y=0.99)
plt.tight_layout()
p7_path = os.path.join(PLOTS_DIR, "plot_07_master_hardware_training_summary.png")
plt.savefig(p7_path, dpi=300)
plt.close()

print("[8/8] Creating ZIP Bundle: MarineGuardian_Training_Plots_Bundle.zip...")
zip_path = os.path.join(REPORTS_DIR, "MarineGuardian_Training_Plots_Bundle.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, _, files in os.walk(PLOTS_DIR):
        for file in sorted(files):
            if file.endswith(".png"):
                full_p = os.path.join(root, file)
                zipf.write(full_p, arcname=file)

print(f"[OK] Successfully saved all 7 plots to: {PLOTS_DIR}")
print(f"[OK] Created All-in-One Download Bundle: {zip_path}")
