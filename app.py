from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import project modules
from config import settings
from database import init_database
from api import router

# ----------------------------------------------------
# Create FastAPI App
# ----------------------------------------------------

app = FastAPI(
    title="VisionEdge API",
    version="1.0.0",
    description="Hardware Accelerated Video Analytics Backend"
)

# ----------------------------------------------------
# Enable CORS
# ----------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Startup Event
# ----------------------------------------------------

@app.on_event("startup")
def startup():

    print("=" * 60)
    print("VisionEdge Backend Starting...")
    print("=" * 60)

    init_database()

    print("Database Connected")
    print("API Ready")

# ----------------------------------------------------
# Shutdown Event
# ----------------------------------------------------

@app.on_event("shutdown")
def shutdown():

    print("=" * 60)
    print("VisionEdge Backend Stopped")
    print("=" * 60)

# ----------------------------------------------------
# Root Endpoint
# ----------------------------------------------------

@app.get("/")
def home():

    return {
        "project": "VisionEdge",
        "version": "1.0.0",
        "status": "Running"
    }

# ----------------------------------------------------
# Health Check
# ----------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "Healthy"
    }

# ----------------------------------------------------
# Register API Routes
# ----------------------------------------------------

app.include_router(router)

# ----------------------------------------------------
# Run Server
# ----------------------------------------------------

if __name__ == "__main__":

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )