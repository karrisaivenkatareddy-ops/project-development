import cv2
import time
from ultralytics import YOLO

# -----------------------------
# Load Models
# -----------------------------

print("Loading PyTorch Model...")
pytorch_model = YOLO("yolov8n.pt")

print("Loading TensorRT Engine...")
trt_model = YOLO("yolov8n.engine")

# -----------------------------
# Video Source
# -----------------------------

cap = cv2.VideoCapture("input/sample.mp4")

if not cap.isOpened():
    print("Error opening video.")
    exit()

# Warm-up
for _ in range(10):
    ret, frame = cap.read()
    if not ret:
        break
    pytorch_model(frame, verbose=False)
    trt_model(frame, verbose=False)

cap.release()

# -----------------------------
# Benchmark Function
# -----------------------------

def benchmark(model, model_name):

    cap = cv2.VideoCapture("input/sample.mp4")

    frame_count = 0
    total_time = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        start = time.perf_counter()

        model(frame, verbose=False)

        end = time.perf_counter()

        total_time += (end - start)

        frame_count += 1

    cap.release()

    avg_time = total_time / frame_count

    fps = frame_count / total_time

    print("\n---------------------------")
    print(model_name)
    print("---------------------------")
    print(f"Frames Processed : {frame_count}")
    print(f"Average Inference : {avg_time*1000:.2f} ms")
    print(f"FPS : {fps:.2f}")

    return avg_time, fps

# -----------------------------
# Run Benchmark
# -----------------------------

benchmark(pytorch_model, "PyTorch")

benchmark(trt_model, "TensorRT")