import { motion } from "motion/react";
import { CheckCircle2, ChevronRight, Code2, Figma, Layers, Terminal, Zap } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface DevProcessProps {
  dark: boolean;
  t: Translation;
}

const ICONS = [Terminal, Layers, Figma, Code2, CheckCircle2, Zap];

export function DevProcess({ dark, t }: DevProcessProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.process_label} title={t.process_title} dark={dark} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {t.process_steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className={`relative p-5 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_24px_rgba(124,58,237,0.1)]" : "bg-white border-black/[0.07] hover:border-violet-300 hover:shadow-[0_8px_24px_rgba(124,58,237,0.08)]"}`}
              >
                <div className={`text-xs font-mono2 mb-3 ${dark ? "text-violet-400/50" : "text-violet-400"}`}>0{i + 1}</div>
                <Icon size={19} className={`mb-3 ${dark ? "text-white/50" : "text-black/50"}`} />
                <div className={`font-display font-semibold text-sm mb-2 ${dark ? "text-white" : "text-[#08080A]"}`}>{step.title}</div>
                <div className={`text-xs leading-relaxed font-body ${dark ? "text-white/38" : "text-black/40"}`}>{step.desc}</div>
                {i < 5 && (
                  <div className={`absolute -right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex z-10 ${dark ? "text-white/15" : "text-black/15"}`}>
                    <ChevronRight size={14} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
