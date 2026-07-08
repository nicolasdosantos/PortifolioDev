import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "../ui/use-mobile";

interface IntroProps {
  onDone: () => void;
}

const NAME = "Nicolas Santos";

const SYMBOLS = ["{ }", "</>", ";", "=>", "01", "10", "( )", "&&", "#!", "[ ]", "0x1F", "==", "++"];

function buildParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: SYMBOLS[i % SYMBOLS.length],
    x: Math.round((Math.sin(i * 12.9898) * 43758.5453) % 1 * 10000) / 100,
    delay: (i % 10) * 0.4,
    duration: 6 + (i % 5) * 1.4,
    size: 11 + (i % 3) * 2,
    hue: i % 3,
  }));
}

const TERMINAL_LINES = [
  { prompt: "whoami", out: "nicolas.santos" },
  { prompt: "cat role.txt", out: "Full Stack Developer" },
  { prompt: "npm run build", out: "" },
];

export function Intro({ onDone }: IntroProps) {
  const isMobile = useIsMobile();
  const particles = useMemo(() => buildParticles(isMobile ? 10 : 22), [isMobile]);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(onDone, 3900);
    const start = performance.now();
    const raf = { id: 0 };
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / 3300) * 100);
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (labelRef.current) labelRef.current.textContent = pct < 100 ? `compiling... ${Math.round(pct)}%` : "build ready";
      if (pct < 100) {
        raf.id = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    raf.id = requestAnimationFrame(tick);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.id);
    };
  }, [onDone]);

  const letters = useMemo(() => NAME.split(""), []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#08080A] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Animated aurora background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {isMobile ? (
          <div
            className="absolute -inset-[20%]"
            style={{
              background:
                "radial-gradient(ellipse 800px 600px at 20% 30%, rgba(124,58,237,0.22) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 80% 70%, rgba(6,182,212,0.14) 0%, transparent 60%)",
            }}
          />
        ) : (
          <>
            {/* Two static gradient layers cross-fade via opacity instead of animating
                the `background` property directly, which forces a full-viewport repaint
                every frame instead of a cheap GPU-composited opacity blend. */}
            <div
              className="absolute -inset-[20%]"
              style={{
                background:
                  "radial-gradient(ellipse 800px 600px at 20% 30%, rgba(124,58,237,0.22) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 80% 70%, rgba(6,182,212,0.14) 0%, transparent 60%)",
              }}
            />
            <motion.div
              className="absolute -inset-[20%]"
              style={{
                background:
                  "radial-gradient(ellipse 800px 600px at 75% 25%, rgba(236,72,153,0.16) 0%, transparent 60%), radial-gradient(ellipse 700px 500px at 25% 75%, rgba(124,58,237,0.22) 0%, transparent 60%)",
                willChange: "opacity",
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </motion.div>

      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
        }}
      />

      {/* Falling code symbols */}
      {particles.map((p) => {
        const colors = ["#C4B5FD", "#67E8F9", "#F0ABFC"];
        return (
          <motion.span
            key={p.id}
            className="absolute pointer-events-none font-mono2"
            style={{
              left: `${p.x}%`,
              top: "-5%",
              fontSize: p.size,
              color: colors[p.hue],
              textShadow: `0 0 10px ${colors[p.hue]}`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0.8, 0], y: ["0vh", "110vh"] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {p.symbol}
          </motion.span>
        );
      })}

      {/* Rotating orbital rings */}
      <motion.div
        className="absolute rounded-full border border-violet-400/20 w-[200px] h-[200px] sm:w-[340px] sm:h-[340px]"
        style={{ willChange: "transform" }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 1, delay: 0.4 },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <motion.span
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300"
          style={{ boxShadow: "0 0 12px 3px rgba(103,232,249,0.8)" }}
        />
      </motion.div>
      <motion.div
        className="absolute rounded-full border border-fuchsia-400/15 w-[260px] h-[260px] sm:w-[440px] sm:h-[440px]"
        style={{ willChange: "transform" }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: -360 }}
        transition={{
          opacity: { duration: 1, delay: 0.6 },
          rotate: { duration: 28, repeat: Infinity, ease: "linear" },
        }}
      >
        <motion.span
          className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-300"
          style={{ boxShadow: "0 0 10px 3px rgba(240,171,252,0.8)" }}
        />
      </motion.div>

      {/* Luminous vertical line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-violet-400 to-transparent"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 160, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
      />

      {/* Main content */}
      <motion.div
        className="text-center relative z-10 px-4 w-full max-w-lg"
        initial={{ opacity: 0, filter: "blur(24px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Avatar with pulsing glow ring */}
        <div className="relative mx-auto mb-5 sm:mb-6 w-16 h-16 sm:w-24 sm:h-24">
          <motion.div
            className="absolute -inset-2 sm:-inset-3 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #C4B5FD, #67E8F9, #F0ABFC, #C4B5FD)",
              filter: "blur(10px)",
              willChange: "transform, opacity",
            }}
            animate={{ rotate: 360, opacity: [0.5, 0.9, 0.5] }}
            transition={{
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <div
            className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full p-[3px]"
            style={{
              background: "linear-gradient(135deg, #C4B5FD, #7C3AED, #4C1D95)",
              boxShadow: "0 0 40px rgba(124,58,237,0.55)",
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0B0B0F] border-2 border-[#08080A] flex items-center justify-center">
              <span
                className="font-display text-lg sm:text-2xl font-bold bg-gradient-to-br from-violet-200 via-violet-400 to-cyan-300 bg-clip-text text-transparent"
                style={{ filter: "drop-shadow(0 0 10px rgba(124,58,237,0.6))" }}
              >
                NS
              </span>
            </div>
          </div>
        </div>

        {/* Name with per-letter reveal */}
        <h1
          className="font-display text-[clamp(2.1rem,9vw,3.75rem)] sm:text-6xl font-bold tracking-tight flex items-center justify-center flex-wrap max-w-full"
          style={{ textShadow: "0 0 80px rgba(124,58,237,0.55)" }}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className={
                i < 8
                  ? "text-white inline-block"
                  : "inline-block bg-gradient-to-br from-violet-300 via-violet-500 to-violet-700 bg-clip-text text-transparent"
              }
              style={{ whiteSpace: "pre" }}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.95 + i * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-violet-400/75 mt-3 text-[10px] sm:text-xs font-mono2 tracking-[0.25em] sm:tracking-[0.45em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 1.85 }}
        >
          Full Stack Developer
        </motion.p>

        {/* Mini terminal */}
        <motion.div
          className="mt-6 mx-auto w-[min(340px,85vw)] rounded-lg border border-white/10 bg-white/[0.03] text-left overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.0 }}
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
            <span className="ml-2 text-[10px] font-mono2 text-white/25">zsh</span>
          </div>
          <div className="px-3 py-2.5 space-y-1 font-mono2 text-[11px] leading-relaxed">
            {TERMINAL_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 2.15 + i * 0.28 }}
              >
                <span className="text-cyan-300/80">$ </span>
                <span className="text-white/70">{line.prompt}</span>
                {line.out && <div className="text-violet-300/70 pl-3">{line.out}</div>}
              </motion.div>
            ))}
            <motion.span
              className="inline-block w-[6px] h-[12px] bg-cyan-300/80 align-middle ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mt-6 mx-auto w-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.3 }}
        >
          <div className="h-[2px] rounded-full bg-white/10 overflow-hidden">
            <div
              ref={barRef}
              className="h-full rounded-full"
              style={{
                width: "0%",
                background: "linear-gradient(90deg, #C4B5FD, #67E8F9)",
                boxShadow: "0 0 10px rgba(124,58,237,0.8)",
              }}
            />
          </div>
          <div ref={labelRef} className="mt-1.5 text-center text-[10px] font-mono2 text-white/30">
            compiling... 0%
          </div>
        </motion.div>
      </motion.div>

      {/* Flash sweep on exit-ready */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              background:
                "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(196,181,253,0.35) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
