import time

import cv2

from ai.yolo import YOLOInference


MODEL = "yolov10n.pt"
IMAGE = "test.jpg"

ITERATIONS = 100


def benchmark():

    model = YOLOInference(
        MODEL
    )

    frame = cv2.imread(
        IMAGE
    )

    print(
        "Running PyTorch benchmark..."
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
        f"PyTorch FPS: {fps:.2f}"
    )

    return fps


if __name__ == "__main__":

    benchmark()