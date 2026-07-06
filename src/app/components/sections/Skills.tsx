import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { skillCategories } from "../../data";

export function Skills({ dark, t, lang }: SectionProps) {
  const [active, setActive] = useState("frontend");
  const cat = skillCategories.find(c => c.id === active)!;

  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.skills_label} title={t.skills_title} dark={dark} />
        <div className="flex flex-wrap gap-2 mb-10">
          {skillCategories.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-300 ${active === c.id
                  ? "bg-violet-600 border-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  : dark
                    ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]"
                    : "border-black/10 text-black/50 hover:text-black hover:bg-black/[0.05]"
                }`}
              >
                <Icon size={14} /> {c.label[lang]}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {cat.skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`p-5 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(124,58,237,0.12)]" : "bg-white border-black/[0.07] hover:border-violet-300 hover:shadow-[0_8px_25px_rgba(124,58,237,0.08)]"}`}
              >
                <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center text-xs font-mono2 font-bold" style={{ background: cat.color + "22", color: cat.color }}>
                  {skill.name.slice(0, 2)}
                </div>
                <div className={`font-body font-semibold text-sm mb-1 ${dark ? "text-white" : "text-[#08080A]"}`}>{skill.name}</div>
                <div className={`text-xs mb-3 font-body ${dark ? "text-white/38" : "text-black/40"}`}>{skill.desc}</div>
                <div className={`h-1 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-black/8"}`}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.05 }}
                  />
                </div>
                <div className={`text-xs font-mono2 mt-1.5 ${dark ? "text-white/28" : "text-black/30"}`}>{skill.level}%</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
