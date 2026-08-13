from ai.inference import InferenceEngine


def test_inference_engine():

    engine = InferenceEngine()

    result = engine.detect(
        None
    )

    assert isinstance(
        result,
        list
    )