import { useEffect, useRef, useState } from "react";
import { useHasHover } from "../../hooks/useHasHover";

export function Cursor() {
  const hasHover = useHasHover();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovRef = useRef(false);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (!hasHover) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf: number;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, target.current.x - 20, 0.1);
      ring.current.y = lerp(ring.current.y, target.current.y - 20, 0.1);
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
      const isHov = !!((e.target as Element).closest?.("a,button,[data-hover]"));
      if (isHov !== hovRef.current) {
        hovRef.current = isHov;
        setHov(isHov);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [hasHover]);

  if (!hasHover) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-violet-400 pointer-events-none"
        style={{ mixBlendMode: "difference", boxShadow: "0 0 8px 2px rgba(124,58,237,0.9)" }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9998] rounded-full border pointer-events-none transition-[width,height,border-color,background-color,box-shadow] duration-200 ${hov ? "w-12 h-12 border-cyan-300/70 bg-violet-400/10" : "w-10 h-10 border-white/25"}`}
        style={hov ? { boxShadow: "0 0 24px rgba(103,232,249,0.35)" } : undefined}
      />
    </>
  );
}
