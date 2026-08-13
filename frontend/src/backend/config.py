import os


class Settings:
    APP_NAME = "VisionEdge Backend"
    HOST = os.getenv("VISIONEDGE_HOST", "0.0.0.0")
    PORT = int(os.getenv("VISIONEDGE_PORT", "8000"))

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    DEFAULT_VIDEO = os.getenv(
        "DEFAULT_VIDEO",
        ""
    )

    TENSORRT_ENGINE_DIR = os.getenv(
        "TENSORRT_ENGINE_DIR",
        "models"
    )

    MAX_STREAMS = int(
        os.getenv("MAX_STREAMS", "10")
    )


settings = Settings()