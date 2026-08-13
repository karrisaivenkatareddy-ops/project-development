import time

from ai.inference import inference_engine
from video.decoder import VideoDecoder


class FrameProcessor:

    def __init__(
        self,
        stream_id
    ):

        self.stream_id = stream_id

        self.decoder = VideoDecoder()


    def process(self, frame):

        decoded_frame = self.decoder.decode(
            frame
        )

        if decoded_frame is None:

            return {
                "frame": None,
                "detections": []
            }

        start = time.perf_counter()

        detections = inference_engine.detect(
            decoded_frame
        )

        inference_time = (
            time.perf_counter()
            - start
        ) * 1000

        return {
            "frame": decoded_frame,
            "detections": detections,
            "inference_time_ms": round(
                inference_time,
                2
            )
        }