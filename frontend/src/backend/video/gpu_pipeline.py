import time

import cupy as cp

from gpu.zero_copy import ZeroCopyGPU
from gpu.gpu_draw import GPUDrawer


class GPUPipeline:

    def __init__(
        self,
        inference_engine
    ):

        self.inference_engine = (
            inference_engine
        )

        self.gpu = ZeroCopyGPU()

        self.drawer = GPUDrawer()


    def process(
        self,
        frame
    ):

        start = time.perf_counter()

        gpu_frame = self.gpu.upload(
            frame
        )

        detections = (
            self.inference_engine.detect(
                frame
            )
        )

        for detection in detections:

            if not isinstance(
                detection,
                dict
            ):
                continue

            self.drawer.draw(
                gpu_frame,
                detection["x1"],
                detection["y1"],
                detection["x2"],
                detection["y2"]
            )

        elapsed = (
            time.perf_counter()
            - start
        )

        return {
            "frame": gpu_frame,
            "detections": detections,
            "latency_ms": round(
                elapsed * 1000,
                2
            )
        }