import time
import threading

import psutil


class Telemetry:

    def __init__(self):

        self.started_at = time.time()

        self.stream_metrics = {}

        self.lock = threading.Lock()


    def update_stream(
        self,
        stream_id,
        fps=None,
        latency=None,
        objects=None,
        decoder_utilization=None
    ):

        with self.lock:

            current = self.stream_metrics.get(
                stream_id,
                {}
            )

            if fps is not None:
                current["fps"] = round(
                    fps,
                    2
                )

            if latency is not None:
                current["latency"] = round(
                    latency,
                    2
                )

            if objects is not None:
                current["objects"] = objects

            if decoder_utilization is not None:
                current[
                    "decoder_utilization"
                ] = round(
                    decoder_utilization,
                    2
                )

            current["updated_at"] = time.time()

            self.stream_metrics[
                stream_id
            ] = current


    def get_stream_metrics(
        self,
        stream_id
    ):

        with self.lock:

            return self.stream_metrics.get(
                stream_id,
                {
                    "fps": 0,
                    "latency": 0,
                    "objects": 0,
                    "decoder_utilization": 0
                }
            )


    def get_gpu_metrics(self):

        gpu_memory = 0
        gpu_utilization = 0

        try:

            import pynvml

            pynvml.nvmlInit()

            handle = pynvml.nvmlDeviceGetHandleByIndex(
                0
            )

            memory = pynvml.nvmlDeviceGetMemoryInfo(
                handle
            )

            gpu_memory = (
                memory.used /
                memory.total
            ) * 100

            try:

                utilization = (
                    pynvml.nvmlDeviceGetUtilizationRates(
                        handle
                    )
                )

                gpu_utilization = (
                    utilization.gpu
                )

            except Exception:
                gpu_utilization = 0

        except Exception:

            gpu_memory = 0
            gpu_utilization = 0

        return {
            "gpu_memory": round(
                gpu_memory,
                2
            ),
            "gpu_utilization": round(
                gpu_utilization,
                2
            )
        }


    def get_metrics(self):

        with self.lock:

            streams = dict(
                self.stream_metrics
            )

        gpu = self.get_gpu_metrics()

        fps_values = [
            value.get("fps", 0)
            for value in streams.values()
        ]

        latency_values = [
            value.get("latency", 0)
            for value in streams.values()
        ]

        decoder_values = [
            value.get(
                "decoder_utilization",
                0
            )
            for value in streams.values()
        ]

        return {
            "fps": round(
                sum(fps_values),
                2
            ),
            "gpu_memory": gpu[
                "gpu_memory"
            ],
            "gpu_utilization": gpu[
                "gpu_utilization"
            ],
            "decoder_utilization": round(
                sum(decoder_values) /
                len(decoder_values)
                if decoder_values
                else 0,
                2
            ),
            "latency": round(
                sum(latency_values) /
                len(latency_values)
                if latency_values
                else 0,
                2
            ),
            "streams": streams
        }


telemetry = Telemetry()