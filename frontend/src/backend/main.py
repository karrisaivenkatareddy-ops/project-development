from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings

from api.streams import router as streams_router
from api.models import router as models_router
from api.metrics import router as metrics_router

from core.stream_manager import stream_manager
from core.webrtc import active_peer_connections


app = FastAPI(
    title=settings.APP_NAME,
    description="VisionEdge Hardware-Accelerated Video Pipeline",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    streams_router,
    prefix="/api/streams",
    tags=["Streams"]
)

app.include_router(
    models_router,
    prefix="/api/models",
    tags=["Models"]
)

app.include_router(
    metrics_router,
    prefix="/api/metrics",
    tags=["Metrics"]
)


@app.get("/")
async def root():
    return {
        "name": "VisionEdge",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "active_streams": len(
            stream_manager.streams
        ),
        "active_webrtc_connections": len(
            active_peer_connections
        )
    }


@app.on_event("shutdown")
async def shutdown():
    await stream_manager.stop_all()

    for peer in list(active_peer_connections):
        try:
            await peer.close()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )