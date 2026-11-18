import { motion } from "motion/react";
import { Briefcase, Code2, FolderGit2, MapPin, Sparkles } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { projects } from "../../data";

/* Na ordem do posicionamento: o principal (estágio e projetos) primeiro, depois dados e apoio. */
const STACK = ["PHP", "Laravel", "React", "TypeScript", "MariaDB", "MySQL", "Supabase", "Tailwind CSS", "Python"];

const WITH_VIDEO = projects.filter(p => p.video).length;

/* Números que só aparecem aqui. Antes eram "41 repositórios" (fixo e já desatualizado),
   certificados (repetido na seção de Formação) e "∞ cafés". */
const CARDS = [
  { icon: Code2, val: "2022", lbl: { pt: "Estudando programação desde", en: "Studying programming since" }, clr: "text-black/60 dark:text-white/65", bg: "bg-black/[0.05] dark:bg-white/[0.05]" },
  { icon: Briefcase, val: "2026", lbl: { pt: "Estagiando em desenvolvimento desde abril", en: "Development intern since April" }, clr: "text-black/60 dark:text-white/65", bg: "bg-black/[0.05] dark:bg-white/[0.05]" },
  { icon: FolderGit2, val: `${projects.length}`, lbl: { pt: `Projetos no portfólio, ${WITH_VIDEO} com vídeo`, en: `Portfolio projects, ${WITH_VIDEO} with video` }, clr: "text-black/60 dark:text-white/65", bg: "bg-black/[0.05] dark:bg-white/[0.05]" },
];

export function About({ dark, t, lang }: SectionProps) {
  return (
    <section id="sobre" className="py-32 relative overflow-hidden">
      {/* Ambient background glow, echoes the Hero aurora for visual continuity */}
      <div
        className="absolute -left-40 top-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--p-accent-ink) 8%, transparent) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute -right-32 bottom-0 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--p-accent-ink) 7%, transparent) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader label={t.about_label} title={t.about_title} dark={dark} />

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-14 lg:gap-20 items-center mb-20">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto lg:mx-0 w-full max-w-[300px] sm:max-w-[320px]"
          >
            <div className="relative aspect-[4/5] rounded-[2rem]">

              {/* Photo */}
              <div
                className={`absolute inset-0 rounded-[2rem] overflow-hidden border ${dark ? "border-white/10" : "border-black/10"}`}
                style={{ boxShadow: "0 20px 60px -12px color-mix(in srgb, var(--p-accent-ink) 21%, transparent)" }}
              >
                <img
                  src="/profile.jpg"
                  alt="Nicolas Pichiteli dos Santos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating role chip */}
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`absolute -top-4 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono2 backdrop-blur-md ${dark ? "bg-[color:var(--p-surface)]/90 border-white/10 text-white/80" : "bg-white/90 border-black/10 text-black/80"}`}
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
              >
                <Code2 size={12} className="opacity-70" /> {t.role}
              </motion.div>

            </div>
          </motion.div>

          {/* Bio + stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className={`inline-flex items-center gap-1.5 mb-4 text-xs font-mono2 ${dark ? "text-white/50" : "text-black/62"}`}>
              <MapPin size={12} /> {t.location}
            </div>
            <p className={`font-body text-lg leading-relaxed mb-8 ${dark ? "text-white/68" : "text-black/74"}`}>{t.about_bio}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={13} className="opacity-60" />
              <span className={`text-[11px] font-mono2 uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-black/62"}`}>Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border transition-colors duration-300 cursor-default ${dark ? "border-white/10 bg-white/[0.04] text-white/68 hover:border-violet-500/40 hover:text-white" : "border-black/[0.16] bg-black/[0.07] text-black/74 hover:border-violet-400 hover:text-black"}`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {CARDS.map(({ icon: Icon, val, lbl, clr, bg }, i) => (
            <motion.div
              key={val}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
              className={`group flex items-center gap-4 p-4 sm:block sm:p-6 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-[color:var(--p-surface)]/95 border-white/[0.09] hover:border-violet-500/30 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--p-accent-ink)_7%,transparent)]" : "bg-white border-black/[0.16] hover:border-violet-300 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--p-accent-ink)_5%,transparent)]"}`}
            >
              {/* no celular vira uma linha (ícone ao lado do número); a partir de `sm`, card */}
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center sm:mb-4 transition-transform duration-300 group-hover:scale-110 ${bg}`}>
                <Icon size={18} className={clr} />
              </div>
              <div>
                <div className={`font-display text-3xl sm:text-4xl font-bold ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}>{val}</div>
                <div className={`text-xs mt-1 font-body ${dark ? "text-white/58" : "text-black/70"}`}>{lbl[lang]}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
