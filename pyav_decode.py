import av
import cv2

video_path = "input/sample.mp4"

container = av.open(video_path)

for frame in container.decode(video=0):
    img = frame.to_ndarray(format="bgr24")

    cv2.imshow("PyAV Video", img)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()