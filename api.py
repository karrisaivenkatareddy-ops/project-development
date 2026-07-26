"""
=========================================================
 VisionEdge Backend
 api.py
=========================================================
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from datetime import datetime

from config import settings
from services import (
    process_image,
    process_video,
    get_detection_history,
    delete_detection_history,
    get_system_status
)

router = APIRouter(prefix="/api", tags=["VisionEdge API"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --------------------------------------------------
# Home API
# --------------------------------------------------

@router.get("/")
def api_home():

    return {
        "message": "VisionEdge Backend API",
        "version": "1.0.0"
    }


# --------------------------------------------------
# System Status
# --------------------------------------------------

@router.get("/status")
def system_status():

    return get_system_status()


# --------------------------------------------------
# Upload Image
# --------------------------------------------------

@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):

    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_image(filepath)

    return JSONResponse(result)


# --------------------------------------------------
# Upload Video
# --------------------------------------------------

@router.post("/upload/video")
async def upload_video(file: UploadFile = File(...)):

    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_video(filepath)

    return JSONResponse(result)


# --------------------------------------------------
# Detection History
# --------------------------------------------------

@router.get("/detections")
def detection_history():

    return get_detection_history()


# --------------------------------------------------
# Delete Detection History
# --------------------------------------------------

@router.delete("/detections")
def clear_detection_history():

    return delete_detection_history()


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@router.get("/health")
def health():

    return {
        "status": "Healthy",
        "service": "VisionEdge"
    }


# --------------------------------------------------
# API Information
# --------------------------------------------------

@router.get("/info")
def info():

    return {
        "project": "VisionEdge",
        "author": "Backend Team",
        "version": "1.0.0"
    }