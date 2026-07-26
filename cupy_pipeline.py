import cupy as cp
import cv2


class CuPyPipeline:

    def __init__(self):

        if cp.cuda.runtime.getDeviceCount() == 0:
            raise RuntimeError("No CUDA GPU detected.")

        self.device = cp.cuda.Device(0)
        self.device.use()

        self.stream = cp.cuda.Stream(non_blocking=True)

        self.memory_pool = cp.cuda.MemoryPool()
        cp.cuda.set_allocator(self.memory_pool.malloc)
    def upload(self, frame):
        """
        Upload image from CPU to GPU.
        """
        with self.stream:
            gpu_frame = cp.asarray(frame)

        return gpu_frame
    def normalize(self, gpu_frame):
        """
        Normalize image to range [0, 1].
        """
        with self.stream:
            gpu_frame = gpu_frame.astype(cp.float32)
            gpu_frame /= 255.0

        return gpu_frame
    def bgr_to_rgb(self, gpu_frame):
        """
        Convert BGR image to RGB.
        """
        return gpu_frame[:, :, ::-1]
    def to_chw(self, gpu_frame):
        """
        Convert HWC format to CHW format.
        """
        return cp.transpose(gpu_frame, (2, 0, 1))
    def add_batch_dimension(self, gpu_frame):
        """
        Add batch dimension.
        """
        return cp.expand_dims(gpu_frame, axis=0)
    
    