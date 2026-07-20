from ultralytics import YOLO

def export_to_onnx():
    try:
        print("Loading YOLO model...")
        model = YOLO("yolov8n.pt")

        print("Exporting model to ONNX...")
        model.export(format="onnx")

        print("\n✅ ONNX model exported successfully!")
        print("Output file: yolov8n.onnx")

    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    export_to_onnx()