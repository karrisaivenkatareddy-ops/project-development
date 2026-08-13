import asyncio

import cv2


class RTSPReader:

    def __init__(
        self,
        source
    ):

        self.source = source

        self.capture = None

        self.running = False


    async def start(self):

        if self.running:
            return

        self.capture = cv2.VideoCapture(
            self.source
        )

        if not self.capture.isOpened():

            raise RuntimeError(
                f"Unable to open video source: {self.source}"
            )

        self.running = True


    async def read(self):

        if not self.running:
            return None

        loop = asyncio.get_running_loop()

        ret, frame = await loop.run_in_executor(
            None,
            self.capture.read
        )

        if not ret:

            return None

        return frame


    async def stop(self):

        self.running = False

        if self.capture:

            self.capture.release()

            self.capture = None