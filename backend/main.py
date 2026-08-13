from fastapi import FastAPI

app = FastAPI(
    title="VisionEdge Backend",
    description="Hardware-Accelerated Video Pipeline",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "VisionEdge Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }