import { useRef } from "react";
import Webcam from "react-webcam";
import { Camera as CameraIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { setImgURL } from "../../../slice/appSlice";

const Camera = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef<Webcam>(null);
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      dispatch(setImgURL(imageSrc));
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full rounded-lg"
      />
      <button
        onClick={capture}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 flex items-center p-2 rounded-lg text-white"
      >
        <CameraIcon className="w-4 h-4 mr-2" />
        <p>Capture</p>
      </button>
    </div>
  );
};

export default Camera;
