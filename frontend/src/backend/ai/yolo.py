from ultralytics import YOLO


class YOLOInference:

    def __init__(
        self,
        model_path="yolov10n.pt"
    ):

        self.model = YOLO(
            model_path
        )


    def detect(
        self,
        frame,
        confidence=0.5
    ):

        results = self.model(
            frame,
            conf=confidence,
            verbose=False
        )

        detections = []

        for result in results:

            if result.boxes is None:
                continue

            for box in result.boxes:

                coordinates = (
                    box.xyxy[0]
                    .cpu()
                    .numpy()
                    .tolist()
                )

                confidence_score = float(
                    box.conf[0]
                )

                class_id = int(
                    box.cls[0]
                )

                detections.append({
                    "x1": coordinates[0],
                    "y1": coordinates[1],
                    "x2": coordinates[2],
                    "y2": coordinates[3],
                    "confidence": confidence_score,
                    "class_id": class_id
                })

        return detections