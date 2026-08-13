import tensorrt as tr
import os


ONNX_FILE = "models/yolov10.onnx"
ENGINE_FILE = "models/yolov10.engine"


TRT_LOGGER = tr.Logger(
    tr.Logger.WARNING
)


def build_engine():

    print("Creating TensorRT builder...")

    builder = tr.Builder(
        TRT_LOGGER
    )

    network = builder.create_network(
        1 << int(
            tr.NetworkDefinitionCreationFlag.EXPLICIT_BATCH
        )
    )

    parser = tr.OnnxParser(
        network,
        TRT_LOGGER
    )

    print("Reading ONNX model...")

    with open(
        ONNX_FILE,
        "rb"
    ) as model_file:

        if not parser.parse(
            model_file.read()
        ):

            print(
                "ONNX parsing failed."
            )

            for i in range(
                parser.num_errors
            ):

                print(
                    parser.get_error(i)
                )

            return False

    print(
        "ONNX model parsed successfully."
    )

    config = builder.create_builder_config()

    config.set_memory_pool_limit(
        tr.MemoryPoolType.WORKSPACE,
        4 << 30
    )

    if builder.platform_has_fast_fp16:

        print(
            "FP16 supported. Enabling FP16."
        )

        config.set_flag(
            tr.BuilderFlag.FP16
        )

    print(
        "Building TensorRT engine..."
    )

    serialized_engine = builder.build_serialized_network(
        network,
        config
    )

    if serialized_engine is None:

        print(
            "TensorRT engine build failed."
        )

        return False

    os.makedirs(
        os.path.dirname(
            ENGINE_FILE
        ),
        exist_ok=True
    )

    with open(
        ENGINE_FILE,
        "wb"
    ) as engine_file:

        engine_file.write(
            serialized_engine
        )

    print(
        f"TensorRT engine saved: {ENGINE_FILE}"
    )

    return True


if __name__ == "__main__":

    build_engine()