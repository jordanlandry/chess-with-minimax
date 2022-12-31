import { useEffect, useState } from "react";

export default function useHeight() {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("fullscreenchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("fullscreenchange", handleResize);
    };
  }, []);

  return height;
}
