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
        <span className="w-6 h-px bg-gradient-to-r from-violet-400 to-cyan-300 glow-pulse" style={{ boxShadow: "0 0 8px rgba(124,58,237,0.8)" }} />
        <span
          className={`text-xs font-mono2 tracking-[0.22em] uppercase bg-clip-text text-transparent bg-gradient-to-r ${
            dark ? "from-violet-300 via-fuchsia-300 to-cyan-300" : "from-violet-600 via-fuchsia-600 to-cyan-600"
          }`}
        >
          {label}
        </span>
      </motion.div>
      <motion.h2
        variants={revealChild}
        className={`font-display text-4xl md:text-5xl font-bold mt-3 leading-tight ${dark ? "text-white" : "text-[#08080A]"}`}
      >
        {title}
      </motion.h2>
    </Reveal>
  );
}
