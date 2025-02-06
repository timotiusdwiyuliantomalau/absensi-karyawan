import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const LoadingElement = () => {
  return (
    <div className="w-full min-h-full fixed z-10 bg-black opacity-70">
      <DotLottieReact
        src="https://lottie.host/dc5484ab-5d74-43a9-a2df-3f70341707d2/W8d78B8d2x.lottie"
        loop
        autoplay
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[200px] h-[200px]"
      />
    </div>
  );
};
