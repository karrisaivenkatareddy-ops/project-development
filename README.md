# VisionEdge – AI Video Intelligence & Object Detection System

An AI-powered video processing project that uses computer vision and deep learning to detect objects in video frames, generate annotated video output, and export detection information into CSV files.

## 📌 Project Overview

VisionEdge is designed to process video input and identify objects using the YOLOv8 object detection model. It uses OpenCV for video processing and provides structured detection information for further analysis.

This project was developed as part of the Axlero Solutions internship program.

## ✨ Key Features

- **Object Detection:** Detects objects in video frames using YOLOv8.
- **Video Processing:** Processes video input using OpenCV.
- **Annotated Output:** Generates video output with detected objects highlighted.
- **Detection Logs:** Exports detection details into CSV format.
- **Timestamp Information:** Records timestamps associated with detections.
- **Confidence Scores:** Stores confidence values for detected objects.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core development |
| YOLOv8 | Object detection |
| OpenCV | Video processing |
| PyTorch | Deep learning framework |
| CSV | Detection data export |
| Git & GitHub | Version control and collaboration |

## 📂 Project Structure

```text
project-development/
│
├── backend/              # Backend-related files
├── frontend/             # Frontend-related files
├── input/                # Input files
│
├── detect.py             # Object detection and video processing
├── api.py                # API-related implementation
├── app.py                # Application entry point
├── benchmark.py          # Performance benchmarking
├── requirements.txt      # Python dependencies
│
├── server.js             # Server implementation
├── index.html            # HTML interface
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/karrisaivenkatareddy-ops/project-development.git
```

### 2. Navigate to the Project Directory

```bash
cd project-development
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

Refer to the application files and their required arguments for the appropriate execution commands.

## 🔄 Project Workflow

1. Provide video input.
2. Process video frames using OpenCV.
3. Apply the YOLOv8 model to detect objects.
4. Generate annotated video output.
5. Extract detection information, including timestamps and confidence scores.
6. Export detection results into CSV files.

## 📊 Sample Output

Add actual project screenshots in this section to demonstrate:

- Video input.
- Object detection with bounding boxes.
- Annotated video output.
- CSV detection records.

## 👥 Team Contributions

This project was developed collaboratively as part of the Axlero Solutions internship program.

- Worked collaboratively on developing an AI-based video intelligence and object detection system.
- Contributed to video processing and object detection using OpenCV and YOLOv8.
- Worked on generating annotated video outputs and structured detection logs.
- Collaborated on integrating project components and testing the application.

## 🎯 Project Objective

To explore practical applications of computer vision and deep learning through automated video analysis and object detection.

## 📄 Internship

Developed as part of the Python Developer Internship at **Axlero Solutions**.

---

**Note:** This project is intended for learning, development, and demonstration purposes.
