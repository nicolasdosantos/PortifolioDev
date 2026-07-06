import { useEffect } from "react";
import { motion } from "motion/react";

interface IntroProps {
  onDone: () => void;
}

export function Intro({ onDone }: IntroProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#08080A] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        style={{ background: "radial-gradient(ellipse 700px 500px at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)" }}
      />
      {/* Luminous vertical line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-violet-400 to-transparent"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 160, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
      />
      {/* Logo */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, filter: "blur(24px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="mx-auto mb-6 w-24 h-24 rounded-full p-[3px]"
          style={{
            background: "linear-gradient(135deg, #C4B5FD, #7C3AED, #4C1D95)",
            boxShadow: "0 0 40px rgba(124,58,237,0.45)",
          }}
        >
          <img
            src="/profile.jpg"
            alt="Nicolas Santos"
            className="w-full h-full rounded-full object-cover border-2 border-[#08080A]"
          />
        </div>
        <h1
          className="font-display text-4xl md:text-6xl font-bold tracking-tight"
          style={{ textShadow: "0 0 80px rgba(124,58,237,0.55)" }}
        >
          <span className="text-white">Nicolas </span>
          <span className="bg-gradient-to-br from-violet-300 via-violet-500 to-violet-700 bg-clip-text text-transparent">Santos</span>
        </h1>
        <motion.p
          className="text-violet-400/75 mt-3 text-xs font-mono2 tracking-[0.45em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 1.7 }}
        >
          Full Stack Developer
        </motion.p>
        <motion.span
          className="block mt-4 font-mono2 text-sm text-violet-400/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 1.9 }}
        >
          {"</>"}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
