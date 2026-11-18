import { motion } from "motion/react";
import { Reveal, revealChild, revealChildX } from "./Reveal";

interface SectionHeaderProps {
  label: string;
  title: string;
  dark: boolean;
}

/* Reescrito para variants sob UM observer (ver Reveal). A versão anterior aninhava
   `whileInView` dentro de `whileInView` e animava `filter: blur()` no pai — com scroll
   instantâneo pelo menu, os dois observers disparavam no mesmo frame e o filho ficava
   preso em opacity 0. Como este header é usado por todas as seções, era ele a origem dos
   títulos que simplesmente não apareciam. */
export function SectionHeader({ label, title, dark }: SectionHeaderProps) {
  return (
    <Reveal className="mb-16">
      <motion.div variants={revealChildX} className="flex items-center gap-2.5">
        <span className="w-6 h-px bg-[color:var(--p-accent-ink)]" />
        <span
          className={`text-xs font-mono2 tracking-[0.22em] uppercase ${dark ? "text-white/55" : "text-black/60"}`}
        >
          {label}
        </span>
      </motion.div>
      <motion.h2
        variants={revealChild}
        className={`font-display text-4xl md:text-5xl font-bold mt-3 leading-tight ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}
      >
        {title}
      </motion.h2>
    </Reveal>
  );
}
