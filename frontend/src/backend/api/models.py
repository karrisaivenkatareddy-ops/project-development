from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

from config import settings
from ai.tensorrt_engine import engine_manager


router = APIRouter()


@router.get("/")
async def list_models():

    return {
        "models": engine_manager.list_engines()
    }


@router.post("/upload")
async def upload_model(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )

    if not file.filename.endswith(".engine"):
        raise HTTPException(
            status_code=400,
            detail="Only TensorRT .engine files are allowed"
        )

    model_dir = Path(
        settings.TENSORRT_ENGINE_DIR
    )

    model_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    destination = model_dir / file.filename

    try:

        contents = await file.read()

        with open(destination, "wb") as output:

            output.write(contents)

        engine_manager.register_engine(
            file.filename,
            str(destination)
        )

        return {
            "success": True,
            "filename": file.filename,
            "path": str(destination)
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/{filename}/activate")
async def activate_model(filename: str):

    try:

        result = engine_manager.activate_engine(
            filename
        )

        return {
            "success": True,
            "model": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )