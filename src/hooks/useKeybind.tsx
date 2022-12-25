import { useEffect } from "react";

export default function useKeybind(key: string, callback: () => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };

    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  }, [key, callback]);
}
