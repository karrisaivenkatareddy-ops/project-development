import cv2
import csv
from datetime import datetime
from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8n.pt")

# Video Source
# Webcam -> 0
# Video -> "input/sample.mp4"
# RTSP -> "rtsp://username:password@ip/live"

video_source = "input/sample.mp4"

cap = cv2.VideoCapture(video_source)

if not cap.isOpened():
    print("Error: Unable to open video source")
    exit()

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

# Save output video
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(
    "output/output.mp4",
    fourcc,
    fps,
    (width, height)
)

# CSV Log
csv_file = open("output/detection_logs.csv", "w", newline="")
writer = csv.writer(csv_file)

writer.writerow([
    "Timestamp",
    "Object",
    "Confidence"
])

while True:

    ret, frame = cap.read()

    if not ret:
        break

    results = model(frame)

    annotated_frame = results[0].plot()

    for box in results[0].boxes:

        cls = int(box.cls[0])

        conf = float(box.conf[0])

        label = model.names[cls]

        writer.writerow([
            datetime.now(),
            label,
            round(conf, 2)
        ])

    out.write(annotated_frame)

    cv2.imshow("VisionEdge Detection", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
csv_file.close()

cv2.destroyAllWindows()

print("Detection Completed Successfully!")