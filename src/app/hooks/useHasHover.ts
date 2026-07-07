import { useEffect, useState } from "react";

/** True on devices with a real mouse (fine pointer + hover support); false on touch-only devices. */
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setHasHover(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return hasHover;
}
