from core.telemetry import Telemetry


def test_metrics():

    telemetry = Telemetry()

    telemetry.update_stream(
        stream_id="CAM-001",
        fps=30,
        latency=40,
        objects=3
    )

    result = telemetry.get_stream_metrics(
        "CAM-001"
    )

    assert result["fps"] == 30
    assert result["latency"] == 40
    assert result["objects"] == 3