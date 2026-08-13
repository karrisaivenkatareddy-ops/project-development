from ultralytics import YOLO
import os


MODEL_NAME = "yolov10n.pt"
OUTPUT_DIR = "models"


def export_model():

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )

    print("Loading YOLO model...")

    model = YOLO(
        MODEL_NAME
    )

    print("Exporting YOLO to ONNX...")

    output = model.export(
        format="onnx",
        imgsz=640,
        dynamic=False,
        simplify=True,
        opset=17
    )

    print("ONNX export completed.")

    print(
        f"Model exported to: {output}"
    )


if __name__ == "__main__":

    export_model()