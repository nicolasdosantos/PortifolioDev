import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Code2, Figma, Layers, Terminal, Zap } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { useHasHover } from "../../hooks/useHasHover";

interface DevProcessProps {
  dark: boolean;
  t: Translation;
}

const ICONS = [Terminal, Layers, Figma, Code2, CheckCircle2, Zap];

export function DevProcess({ dark, t }: DevProcessProps) {
  const hasHover = useHasHover();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.process_label} title={t.process_title} dark={dark} />
        {/* Seis colunas só a partir de `xl`. Em `lg` (1024px) cada card ficava com 108px de
            conteúdo e "Desenvolvimento" — a palavra mais longa da lista — vazava 19px para
            fora do cartão. Com três colunas até 1280px cada passo respira. */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {t.process_steps.map((step, i) => {
            const Icon = ICONS[i];
            const isHovered = hasHover ? hovered === i : false;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onHoverStart={() => hasHover && setHovered(i)}
                onHoverEnd={() => hasHover && setHovered(null)}
                className={`relative p-5 rounded-xl border cursor-default transition-colors duration-300 ${
                  dark
                    ? isHovered ? "bg-[color:var(--p-surface-2)]/95 border-white/[0.14]" : "bg-[color:var(--p-surface)]/95 border-white/[0.09]"
                    : isHovered ? "bg-black/[0.03] border-black/[0.22]" : "bg-white border-black/[0.16]"
                }`}
              >
                <div className={`text-xs font-mono2 mb-3 ${dark ? "text-white/50" : "text-black/70"}`}>0{i + 1}</div>
                <Icon size={18} className={`mb-3 transition-colors duration-300 ${dark ? "text-white/70" : "text-black/70"}`} />
                {/* `break-words`: em 2 colunas no celular o card tem ~120px de conteúdo e
                    "Desenvolvimento" não caberia numa linha só. */}
                <div className={`font-display font-semibold text-sm leading-snug mb-2 break-words ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}>{step.title}</div>
                <div className={`text-xs leading-relaxed font-body ${dark ? "text-white/70" : "text-black/70"}`}>{step.desc}</div>

                {i < 5 && (
                  <div
                    /* `xl` acompanha o grid: em 3 colunas a seta do 3º card apontaria para a
                       quebra de linha, não para o próximo passo. */
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hidden xl:flex z-20"
                    style={{ left: "calc(100% + 0.5rem)" }}
                  >
                    <ArrowRight size={13} className={dark ? "text-white/35" : "text-black/40"} />
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
