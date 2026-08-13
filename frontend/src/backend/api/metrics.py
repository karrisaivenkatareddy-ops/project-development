from fastapi import APIRouter

from core.telemetry import telemetry


router = APIRouter()


@router.get("/")
async def get_metrics():

    return telemetry.get_metrics()


@router.get("/{stream_id}")
async def get_stream_metrics(
    stream_id: str
):

    return telemetry.get_stream_metrics(
        stream_id
    )