import { motion } from "motion/react";

interface SectionHeaderProps {
  label: string;
  title: string;
  dark: boolean;
}

export function SectionHeader({ label, title, dark }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <span className={`text-xs font-mono2 tracking-[0.22em] uppercase ${dark ? "text-violet-400" : "text-violet-600"}`}>
        {label}
      </span>
      <h2 className={`font-display text-4xl md:text-5xl font-bold mt-3 leading-tight ${dark ? "text-white" : "text-[#08080A]"}`}>
        {title}
      </h2>
    </motion.div>
  );
}
