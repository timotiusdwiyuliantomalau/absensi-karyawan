import { IoIosRefreshCircle } from "react-icons/io";

const LoadingRefresh = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <IoIosRefreshCircle className="text-5xl  text-black animate-spin"/>
    </div>
  );
};

export default LoadingRefresh;