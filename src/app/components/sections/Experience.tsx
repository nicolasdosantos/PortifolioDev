import { motion } from "motion/react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { experience } from "../../data";

export function Experience({ dark, t, lang }: SectionProps) {
  return (
    <section id="experiencia" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader label={t.experience_label} title={t.experience_title} dark={dark} />
        <div className="space-y-5">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ x: 5 }}
              className={`p-6 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/25 hover:shadow-[0_0_28px_rgba(124,58,237,0.08)]" : "bg-white border-black/[0.16] hover:border-violet-300 hover:shadow-[0_8px_28px_rgba(124,58,237,0.07)]"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className={`font-display font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{exp.role[lang]}</div>
                  <div className="text-violet-500 font-body text-sm font-medium">{exp.company}</div>
                  <div className={`text-xs font-mono2 mt-0.5 ${dark ? "text-white/35" : "text-black/58"}`}>{exp.type[lang]}</div>
                </div>
                <span className={`text-xs font-mono2 px-3 py-1.5 rounded-xl flex-shrink-0 ${dark ? "bg-white/[0.05] text-white/45" : "bg-black/[0.07] text-black/65"}`}>
                  {exp.period[lang]}
                </span>
              </div>
              <p className={`text-sm font-body leading-relaxed mb-4 ${dark ? "text-white/48" : "text-black/68"}`}>{exp.desc[lang]}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map(tag => (
                  <span key={tag} className={`px-2 py-1 rounded-md text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/45" : "border-black/[0.16] bg-black/[0.07] text-black/65"}`}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
