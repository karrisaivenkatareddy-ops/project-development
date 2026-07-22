from ultralytics import YOLO
from pathlib import Path
import torch
import sys

# Get current directory
BASE_DIR = Path(__file__).resolve().parent

# Model path
MODEL_PATH = BASE_DIR / "yolov8n.pt"

# Check model
if not MODEL_PATH.exists():
    print(f"ERROR: Model not found -> {MODEL_PATH}")
    sys.exit(1)

# Check CUDA
if not torch.cuda.is_available():
    print("ERROR: CUDA GPU not found.")
    print("TensorRT export requires NVIDIA GPU + CUDA + TensorRT.")
    sys.exit(1)

print("CUDA Device :", torch.cuda.get_device_name(0))

# Load model
model = YOLO(str(MODEL_PATH))

print("Exporting TensorRT Engine...")

model.export(
    format="engine",
    device=0,
    half=True,
    simplify=True,
    dynamic=False,
    imgsz=640
)

print("TensorRT Engine Generated Successfully!")