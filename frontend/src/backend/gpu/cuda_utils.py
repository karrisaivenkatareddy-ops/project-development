import torch


class CUDA:

    @staticmethod
    def available():

        return torch.cuda.is_available()


    @staticmethod
    def device():

        if not torch.cuda.is_available():

            return "CPU"

        return torch.cuda.get_device_name(0)


    @staticmethod
    def memory():

        if not torch.cuda.is_available():

            return {
                "allocated_mb": 0,
                "reserved_mb": 0
            }

        allocated = (
            torch.cuda.memory_allocated()
            / 1024
            / 1024
        )

        reserved = (
            torch.cuda.memory_reserved()
            / 1024
            / 1024
        )

        return {
            "allocated_mb": round(
                allocated,
                2
            ),
            "reserved_mb": round(
                reserved,
                2
            )
        }


    @staticmethod
    def synchronize():

        if torch.cuda.is_available():

            torch.cuda.synchronize()