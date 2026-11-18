import { motion } from "motion/react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { experience } from "../../data";

export function Experience({ dark, t, lang }: SectionProps) {
  return (
    <section id="experiencia" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.experience_label} title={t.experience_title} dark={dark} />
        {/* Linha do tempo sem caixas: período numa coluna à esquerda, fio vertical com um
            ponto por cargo e o conteúdo à direita. No celular o período sobe para cima do
            cargo. A largura de leitura fica limitada e alinhada à esquerda. */}
        <ol className="max-w-4xl">
          {experience.map((exp, i) => (
            <motion.li
              key={exp.company}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid sm:grid-cols-[10.5rem_1fr] gap-x-6"
            >
              <div className={`text-xs font-mono2 pt-1 mb-2 sm:mb-0 whitespace-nowrap ${dark ? "text-white/50" : "text-black/58"}`}>{exp.period[lang]}</div>
              <div className={`relative pl-7 border-l ${i < experience.length - 1 ? "pb-14" : "pb-2"} ${dark ? "border-white/[0.12]" : "border-black/[0.14]"}`}>
                <span
                  aria-hidden
                  className={`absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full ${i === 0 ? "bg-brand-ink" : dark ? "bg-white/40" : "bg-black/35"}`}
                />
                <h3 className={`font-display font-semibold text-lg leading-snug ${dark ? "text-white/90" : "text-black/85"}`}>{exp.role[lang]}</h3>
                <p className={`text-sm font-body mt-0.5 ${dark ? "text-white/70" : "text-black/70"}`}>
                  {exp.company} <span className={dark ? "text-white/35" : "text-black/40"}>·</span> {exp.type[lang]}
                </p>
                <ul className={`mt-4 space-y-2 text-sm font-body leading-relaxed ${dark ? "text-white/70" : "text-black/70"}`}>
                  {exp.highlights[lang].map(item => (
                    <li key={item} className="flex gap-3">
                      <span className={`mt-[0.6em] w-1 h-1 rounded-full flex-shrink-0 ${dark ? "bg-white/35" : "bg-black/35"}`} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-5">
                  {exp.tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded-lg text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/70" : "border-black/[0.16] bg-black/[0.07] text-black/70"}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
