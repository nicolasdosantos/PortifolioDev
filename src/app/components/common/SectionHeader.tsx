import { motion } from "motion/react";

interface SectionHeaderProps {
  label: string;
  title: string;
  dark: boolean;
}

export function SectionHeader({ label, title, dark }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2.5"
      >
        <span
          className="w-6 h-px bg-gradient-to-r from-violet-400 to-cyan-300 glow-pulse"
          style={{ boxShadow: "0 0 8px rgba(124,58,237,0.8)" }}
        />
        <span className={`text-xs font-mono2 tracking-[0.22em] uppercase bg-clip-text text-transparent bg-gradient-to-r ${dark ? "from-violet-300 via-fuchsia-300 to-cyan-300" : "from-violet-600 via-fuchsia-600 to-cyan-600"}`}>
          {label}
        </span>
      </motion.div>
      <h2 className={`font-display text-4xl md:text-5xl font-bold mt-3 leading-tight ${dark ? "text-white" : "text-[#08080A]"}`}>
        {title}
      </h2>
    </motion.div>
  );
}
