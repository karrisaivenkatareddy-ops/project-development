import cv2
import numpy as np

from ai.tensorrt_engine import TensorRTEngine


class VisionInference:

    def __init__(
        self,
        engine_path
    ):

        self.engine = TensorRTEngine(
            engine_path
        )

        self.input_width = 640
        self.input_height = 640


    def preprocess(
        self,
        frame
    ):

        image = cv2.resize(
            frame,
            (
                self.input_width,
                self.input_height
            )
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        image = image.astype(
            np.float32
        ) / 255.0

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        image = np.expand_dims(
            image,
            axis=0
        )

        return np.ascontiguousarray(
            image
        )


    def detect(
        self,
        frame
    ):

        input_tensor = self.preprocess(
            frame
        )

        output = self.engine.infer(
            input_tensor
        )

        return output