import cupy as cp


class ZeroCopyGPU:

    def __init__(self):

        self.available = True


    def upload(
        self,
        frame
    ):

        return cp.asarray(
            frame
        )


    def download(
        self,
        frame
    ):

        return cp.asnumpy(
            frame
        )


    def normalize(
        self,
        frame
    ):

        return frame.astype(
            cp.float32
        ) / 255.0


    def resize(
        self,
        frame
    ):

        return frame