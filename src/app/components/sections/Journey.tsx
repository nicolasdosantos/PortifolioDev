import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Briefcase, Code2, GraduationCap, Rocket, Terminal } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { journeyItems } from "../../data";
import { useHasHover } from "../../hooks/useHasHover";

const ICONS = [Terminal, GraduationCap, Code2, Rocket, Briefcase];

export function Journey({ dark, t, lang }: SectionProps) {
  const hasHover = useHasHover();
  const [hovered, setHovered] = useState<number | null>(null);
  const isLast = journeyItems.length - 1;

  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader label={t.journey_label} title={t.journey_title} dark={dark} />
        <div className="relative">
          <motion.div
            className={`absolute left-[15px] top-2 bottom-2 w-px origin-top ${dark ? "bg-gradient-to-b from-violet-500/60 via-white/10 to-transparent" : "bg-gradient-to-b from-violet-500/50 via-black/10 to-transparent"}`}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute left-[11px] w-2 h-2 rounded-full bg-violet-400 blur-[2px] pointer-events-none"
            initial={{ top: "0%", opacity: 0 }}
            whileInView={{ top: ["0%", "96%"], opacity: [0, 0.9, 0.9, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 2.6, delay: 1, ease: "easeInOut" }}
          />
          <div className="space-y-4">
            {journeyItems.map((item, i) => {
              const Icon = ICONS[i] ?? Code2;
              const isHovered = hasHover ? hovered === i : false;
              const current = i === isLast;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onHoverStart={() => hasHover && setHovered(i)}
                  onHoverEnd={() => hasHover && setHovered(null)}
                  className="relative flex gap-5"
                >
                  <div className="relative flex-shrink-0 w-8 flex flex-col items-center pt-0.5">
                    <motion.div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                        dark
                          ? isHovered ? "bg-violet-500/15 border-violet-400/50" : "bg-[#0d0d12] border-white/15"
                          : isHovered ? "bg-violet-500/10 border-violet-400/60" : "bg-white border-black/[0.18]"
                      }`}
                      animate={current ? { boxShadow: ["0 0 0 0 rgba(124,58,237,0.35)", "0 0 0 6px rgba(124,58,237,0)"] } : undefined}
                      transition={current ? { duration: 1.8, repeat: Infinity, ease: "easeOut" } : undefined}
                    >
                      <Icon size={14} className={isHovered || current ? "text-violet-400" : dark ? "text-white/45" : "text-black/55"} />
                    </motion.div>
                  </div>

                  <div
                    className={`flex-1 pb-6 pt-0.5 ${i < isLast ? "border-b" : ""} ${dark ? "border-white/[0.06]" : "border-black/[0.08]"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-mono2 ${dark ? "text-violet-400" : "text-violet-600"}`}>{item.year}</span>
                      {current && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono2 text-emerald-400/80">
                          <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                          </span>
                          {t.in_progress}
                        </span>
                      )}
                    </div>
                    <div className={`font-display font-semibold mb-1.5 transition-colors duration-300 ${isHovered ? "text-violet-400" : dark ? "text-white" : "text-[#08080A]"}`}>
                      {item.title[lang]}
                    </div>
                    <div className={`text-sm font-body leading-relaxed ${dark ? "text-white/45" : "text-black/65"}`}>{item.desc[lang]}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
