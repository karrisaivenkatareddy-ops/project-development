import av


class NVDECDecoder:

    def __init__(
        self,
        source
    ):

        self.source = source
        self.container = None
        self.stream = None


    def open(self):

        print(
            "Opening video source:"
        )

        print(
            self.source
        )

        self.container = av.open(
            self.source
        )

        self.stream = (
            self.container.streams.video[0]
        )

        self.stream.thread_type = "AUTO"


    def frames(self):

        if self.container is None:

            self.open()

        for frame in self.container.decode(
            self.stream
        ):

            yield frame


    def close(self):

        if self.container:

            self.container.close()

            self.container = None