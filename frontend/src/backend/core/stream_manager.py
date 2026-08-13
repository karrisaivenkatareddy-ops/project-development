import asyncio
import time

from config import settings

from video.rtsp_reader import RTSPReader
from video.frame_processor import FrameProcessor

from core.telemetry import telemetry


class StreamManager:

    def __init__(self):

        self.streams = {}

        self.tasks = {}

        self.lock = asyncio.Lock()


    async def create_stream(
        self,
        stream_id,
        source,
        name
    ):

        async with self.lock:

            if len(self.streams) >= settings.MAX_STREAMS:

                raise ValueError(
                    "Maximum stream limit reached"
                )

            if stream_id in self.streams:

                raise ValueError(
                    "Stream already exists"
                )

            reader = RTSPReader(
                source
            )

            processor = FrameProcessor(
                stream_id
            )

            self.streams[stream_id] = {
                "id": stream_id,
                "name": name,
                "source": source,
                "status": "stopped",
                "reader": reader,
                "processor": processor,
                "created_at": time.time()
            }

            return self._serialize(
                self.streams[stream_id]
            )


    async def start_stream(
        self,
        stream_id
    ):

        if stream_id not in self.streams:

            raise ValueError(
                "Stream not found"
            )

        stream = self.streams[
            stream_id
        ]

        if stream["status"] == "running":

            return self._serialize(
                stream
            )

        await stream["reader"].start()

        stream["status"] = "running"

        task = asyncio.create_task(
            self._process_stream(
                stream_id
            )
        )

        self.tasks[stream_id] = task

        return self._serialize(
            stream
        )


    async def stop_stream(
        self,
        stream_id
    ):

        if stream_id not in self.streams:

            raise ValueError(
                "Stream not found"
            )

        stream = self.streams[
            stream_id
        ]

        task = self.tasks.pop(
            stream_id,
            None
        )

        if task:

            task.cancel()

            try:
                await task
            except asyncio.CancelledError:
                pass

        await stream[
            "reader"
        ].stop()

        stream["status"] = "stopped"

        return self._serialize(
            stream
        )


    async def delete_stream(
        self,
        stream_id
    ):

        if stream_id not in self.streams:

            raise ValueError(
                "Stream not found"
            )

        await self.stop_stream(
            stream_id
        )

        del self.streams[
            stream_id
        ]


    async def _process_stream(
        self,
        stream_id
    ):

        stream = self.streams[
            stream_id
        ]

        reader = stream[
            "reader"
        ]

        processor = stream[
            "processor"
        ]

        try:

            while True:

                frame = await reader.read()

                if frame is None:

                    await asyncio.sleep(
                        0.01
                    )

                    continue

                start = time.perf_counter()

                result = processor.process(
                    frame
                )

                elapsed = (
                    time.perf_counter()
                    - start
                )

                fps = (
                    1 / elapsed
                    if elapsed > 0
                    else 0
                )

                telemetry.update_stream(
                    stream_id=stream_id,
                    fps=fps,
                    latency=elapsed * 1000,
                    objects=len(
                        result["detections"]
                    )
                )

                await asyncio.sleep(
                    0
                )

        except asyncio.CancelledError:

            raise

        except Exception as error:

            stream["status"] = "error"

            print(
                f"Stream {stream_id} error: {error}"
            )


    def get_stream(
        self,
        stream_id
    ):

        stream = self.streams.get(
            stream_id
        )

        if stream is None:
            return None

        return self._serialize(
            stream
        )


    def list_streams(self):

        return [
            self._serialize(stream)
            for stream in self.streams.values()
        ]


    def _serialize(self, stream):

        return {
            "id": stream["id"],
            "name": stream["name"],
            "source": stream["source"],
            "status": stream["status"],
            "created_at": stream["created_at"]
        }


    async def stop_all(self):

        for stream_id in list(
            self.streams.keys()
        ):

            try:

                await self.stop_stream(
                    stream_id
                )

            except Exception:
                pass


stream_manager = StreamManager()