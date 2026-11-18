import { motion } from "motion/react";
import { Code2, Sparkles } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";

/* Na ordem do posicionamento: o principal (estágio e projetos) primeiro, depois dados e apoio. */
const STACK = ["PHP", "Laravel", "React", "TypeScript", "MariaDB", "MySQL", "Supabase", "Tailwind CSS", "Python"];



export function About({ dark, t }: SectionProps) {
  return (
    <section id="sobre" className="py-24 md:py-32 relative overflow-hidden">
      {/* Ambient background glow, echoes the Hero aurora for visual continuity */}
      <div
        className="absolute -left-40 top-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--p-accent-ink) 8%, transparent) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute -right-32 bottom-0 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--p-accent-ink) 7%, transparent) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
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
            <div className="relative aspect-[4/5] rounded-xl">

              {/* Photo */}
              <div
                className={`absolute inset-0 rounded-xl overflow-hidden border ${dark ? "border-white/10" : "border-black/10"}`}
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
                className={`absolute -top-4 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-body backdrop-blur-md ${dark ? "bg-[color:var(--p-surface)]/90 border-white/10 text-white/90" : "bg-white/90 border-black/10 text-black/85"}`}
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
            <p className={`font-body text-base leading-relaxed mb-8 max-w-[62ch] ${dark ? "text-white/70" : "text-black/70"}`}>{t.about_bio}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={13} className="opacity-60" />
              <span className={`text-xs font-body uppercase tracking-[0.16em] ${dark ? "text-white/50" : "text-black/70"}`}>Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border cursor-default ${dark ? "border-white/10 bg-white/[0.04] text-white/70" : "border-black/[0.16] bg-black/[0.07] text-black/70"}`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
