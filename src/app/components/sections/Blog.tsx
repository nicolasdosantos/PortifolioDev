import { motion } from "motion/react";
import { Clock } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";

const POSTS = [
  { title: { pt: "React na Prática: Componentes e Hooks no dia a dia", en: "React in Practice: Components and Hooks Day to Day" }, cat: "Frontend", grad: "from-violet-600/25 to-indigo-600/20" },
  { title: { pt: "Consumindo APIs com PHP e MySQL", en: "Consuming APIs with PHP and MySQL" }, cat: "Backend", grad: "from-blue-600/20 to-cyan-600/15" },
  { title: { pt: "Minha Jornada de Estudos em Full Stack", en: "My Full Stack Learning Journey" }, cat: "Carreira", grad: "from-emerald-600/20 to-teal-600/15" },
];

export function Blog({ dark, t, lang }: SectionProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.blog_label} title={t.blog_title} dark={dark} />
        <p className={`-mt-10 mb-10 text-sm font-body ${dark ? "text-white/38" : "text-black/60"}`}>{t.blog_coming}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative p-6 rounded-2xl border overflow-hidden cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/25" : "bg-white border-black/[0.16] hover:border-violet-200"}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.grad} opacity-50`} />
              <div className="relative">
                <span className={`text-xs font-mono2 px-2.5 py-1 rounded-lg mb-4 inline-block ${dark ? "bg-white/10 text-white/55" : "bg-black/[0.12] text-black/68"}`}>{p.cat}</span>
                <h3 className={`font-display font-bold text-sm leading-snug mb-4 ${dark ? "text-white" : "text-[#08080A]"}`}>{p.title[lang]}</h3>
                <div className={`flex items-center gap-2 text-xs font-body ${dark ? "text-white/30" : "text-black/54"}`}>
                  <Clock size={11} /> Em breve
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
