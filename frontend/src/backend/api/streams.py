from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.stream_manager import stream_manager


router = APIRouter()


class StreamCreate(BaseModel):
    stream_id: str
    source: str
    name: Optional[str] = None


@router.get("/")
async def get_streams():
    return {
        "streams": stream_manager.list_streams()
    }


@router.post("/")
async def create_stream(data: StreamCreate):

    try:

        stream = await stream_manager.create_stream(
            stream_id=data.stream_id,
            source=data.source,
            name=data.name or data.stream_id
        )

        return {
            "success": True,
            "stream": stream
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/{stream_id}/start")
async def start_stream(stream_id: str):

    try:

        result = await stream_manager.start_stream(
            stream_id
        )

        return {
            "success": True,
            "stream": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.post("/{stream_id}/stop")
async def stop_stream(stream_id: str):

    try:

        result = await stream_manager.stop_stream(
            stream_id
        )

        return {
            "success": True,
            "stream": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.delete("/{stream_id}")
async def delete_stream(stream_id: str):

    try:

        await stream_manager.delete_stream(
            stream_id
        )

        return {
            "success": True
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.get("/{stream_id}")
async def get_stream(stream_id: str):

    stream = stream_manager.get_stream(
        stream_id
    )

    if stream is None:

        raise HTTPException(
            status_code=404,
            detail="Stream not found"
        )

    return stream