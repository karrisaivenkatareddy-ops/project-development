import tensorrt as tr
import numpy as np
import pycuda.driver as cuda
import pycuda.autoinit


class TensorRTEngine:

    def __init__(
        self,
        engine_path
    ):

        self.engine_path = engine_path

        self.logger = tr.Logger(
            tr.Logger.WARNING
        )

        self.runtime = tr.Runtime(
            self.logger
        )

        self.engine = None
        self.context = None

        self.inputs = []
        self.outputs = []

        self.stream = cuda.Stream()

        self.load_engine()


    def load_engine(self):

        print(
            "Loading TensorRT engine..."
        )

        with open(
            self.engine_path,
            "rb"
        ) as file:

            engine_data = file.read()

        self.engine = self.runtime.deserialize_cuda_engine(
            engine_data
        )

        if self.engine is None:

            raise RuntimeError(
                "Could not load TensorRT engine"
            )

        self.context = self.engine.create_execution_context()

        print(
            "TensorRT engine loaded."
        )


    def get_input_shape(self):

        return self.engine.get_tensor_shape(
            self.engine.get_tensor_name(0)
        )


    def infer(
        self,
        input_data
    ):

        input_data = np.ascontiguousarray(
            input_data,
            dtype=np.float32
        )

        input_name = (
            self.engine.get_tensor_name(0)
        )

        output_name = (
            self.engine.get_tensor_name(1)
        )

        output_shape = (
            self.engine.get_tensor_shape(
                output_name
            )
        )

        output_shape = tuple(
            int(x)
            for x in output_shape
        )

        d_input = cuda.mem_alloc(
            input_data.nbytes
        )

        output_size = (
            np.prod(output_shape)
            * np.dtype(
                np.float32
            ).itemsize
        )

        d_output = cuda.mem_alloc(
            int(output_size)
        )

        output = np.empty(
            output_shape,
            dtype=np.float32
        )

        cuda.memcpy_htod_async(
            d_input,
            input_data,
            self.stream
        )

        self.context.set_tensor_address(
            input_name,
            int(d_input)
        )

        self.context.set_tensor_address(
            output_name,
            int(d_output)
        )

        self.context.execute_async_v3(
            self.stream.handle
        )

        cuda.memcpy_dtoh_async(
            output,
            d_output,
            self.stream
        )

        self.stream.synchronize()

        d_input.free()
        d_output.free()

        return output