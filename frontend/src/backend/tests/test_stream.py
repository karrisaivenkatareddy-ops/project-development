from video.rtsp_reader import RTSPReader


def test_reader_creation():

    reader = RTSPReader(
        "test.mp4"
    )

    assert reader.source == "test.mp4"