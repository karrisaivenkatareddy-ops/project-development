import cv2


class VideoDecoder:

    def __init__(self):

        self.frame_count = 0


    def decode(self, frame):

        if frame is None:
            return None

        self.frame_count += 1

        return frame


    def resize(
        self,
        frame,
        width,
        height
    ):

        return cv2.resize(
            frame,
            (width, height)
        )