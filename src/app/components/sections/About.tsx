import { motion } from "motion/react";
import { Award, Briefcase, Code2, Coffee } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";

const STACK = ["React", "TypeScript", "JavaScript", "Tailwind CSS", "PHP", "Python", "MySQL", "Supabase"];

const CARDS = [
  { icon: Code2, val: "3+", lbl: { pt: "Anos", en: "Years" }, clr: "text-violet-400" },
  { icon: Briefcase, val: "41", lbl: { pt: "Repositórios", en: "Repositories" }, clr: "text-blue-400" },
  { icon: Award, val: "6", lbl: { pt: "Certificados", en: "Certificates" }, clr: "text-amber-400" },
  { icon: Coffee, val: "∞", lbl: { pt: "Cafés", en: "Coffees" }, clr: "text-emerald-400" },
];

export function About({ dark, t, lang }: SectionProps) {
  return (
    <section id="sobre" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.about_label} title={t.about_title} dark={dark} />
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className={`font-body text-lg leading-relaxed mb-8 ${dark ? "text-white/55" : "text-black/55"}`}>{t.about_bio}</p>
            <div className="flex flex-wrap gap-2">
              {STACK.map(tech => (
                <span key={tech} className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/55" : "border-black/10 bg-black/[0.04] text-black/55"}`}>
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {CARDS.map(({ icon: Icon, val, lbl, clr }, i) => (
              <motion.div
                key={val}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`p-6 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]" : "bg-white border-black/[0.07] hover:border-violet-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)]"}`}
              >
                <Icon size={22} className={`${clr} mb-3`} />
                <div className={`font-display text-4xl font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{val}</div>
                <div className={`text-xs mt-1 font-body ${dark ? "text-white/40" : "text-black/40"}`}>{lbl[lang]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
