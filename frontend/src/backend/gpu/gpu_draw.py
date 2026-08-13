import cupy as cp


class GPUDrawer:

    def __init__(self):

        self.kernel = cp.RawKernel(
            r'''
            extern "C" __global__
            void draw_box(
                unsigned char* image,
                int width,
                int height,
                int x1,
                int y1,
                int x2,
                int y2
            )
            {
                int x = blockIdx.x *
                        blockDim.x +
                        threadIdx.x;

                int y = blockIdx.y *
                        blockDim.y +
                        threadIdx.y;

                if (
                    x >= width ||
                    y >= height
                )
                    return;

                bool border =
                    (
                        x >= x1 &&
                        x <= x2 &&
                        y >= y1 &&
                        y <= y1 + 2
                    )
                    ||
                    (
                        x >= x1 &&
                        x <= x2 &&
                        y >= y2 - 2 &&
                        y <= y2
                    )
                    ||
                    (
                        y >= y1 &&
                        y <= y2 &&
                        x >= x1 &&
                        x <= x1 + 2
                    )
                    ||
                    (
                        y >= y1 &&
                        y <= y2 &&
                        x >= x2 - 2 &&
                        x <= x2
                    );

                if (border)
                {
                    int index =
                        (y * width + x) * 3;

                    image[index] = 0;
                    image[index + 1] = 255;
                    image[index + 2] = 0;
                }
            }
            ''',
            "draw_box"
        )


    def draw(
        self,
        gpu_image,
        x1,
        y1,
        x2,
        y2
    ):

        height = gpu_image.shape[0]
        width = gpu_image.shape[1]

        threads = (
            16,
            16
        )

        blocks = (
            (width + 15) // 16,
            (height + 15) // 16
        )

        self.kernel(
            blocks,
            threads,
            (
                gpu_image,
                width,
                height,
                int(x1),
                int(y1),
                int(x2),
                int(y2)
            )
        )

        return gpu_image