import time

import cv2

from ai.inference import VisionInference


MODEL = "models/yolov10.engine"

IMAGE = "test.jpg"

ITERATIONS = 100


def benchmark():

    model = VisionInference(
        MODEL
    )

    frame = cv2.imread(
        IMAGE
    )

    print(
        "Running TensorRT benchmark..."
    )

    start = time.perf_counter()

    for _ in range(
        ITERATIONS
    ):

        model.detect(
            frame
        )

    elapsed = (
        time.perf_counter()
        - start
    )

    fps = (
        ITERATIONS /
        elapsed
    )

    print(
        f"TensorRT FPS: {fps:.2f}"
    )

    return fps


if __name__ == "__main__":

    benchmark()