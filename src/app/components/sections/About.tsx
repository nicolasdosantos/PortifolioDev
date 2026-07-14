import { motion } from "motion/react";
import { Award, Briefcase, Code2, Coffee, MapPin, Sparkles } from "lucide-react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";

const STACK = ["React", "TypeScript", "JavaScript", "Tailwind CSS", "PHP", "Python", "MySQL", "Supabase"];

const CARDS = [
  { icon: Code2, val: "3+", lbl: { pt: "Anos", en: "Years" }, clr: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Briefcase, val: "41", lbl: { pt: "Repositórios", en: "Repositories" }, clr: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Award, val: "6", lbl: { pt: "Certificados", en: "Certificates" }, clr: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Coffee, val: "∞", lbl: { pt: "Cafés", en: "Coffees" }, clr: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export function About({ dark, t, lang }: SectionProps) {
  return (
    <section id="sobre" className="py-32 relative overflow-hidden">
      {/* Ambient background glow, echoes the Hero aurora for visual continuity */}
      <div
        className="absolute -left-40 top-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute -right-32 bottom-0 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
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
              {/* Soft pulsing glow behind the frame */}
              <motion.div
                className="absolute -inset-6 rounded-[2.5rem] pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.25))", filter: "blur(36px)" }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Photo */}
              <div
                className={`absolute inset-0 rounded-[2rem] overflow-hidden border ${dark ? "border-white/10" : "border-black/10"}`}
                style={{ boxShadow: "0 20px 60px -12px rgba(124,58,237,0.35)" }}
              >
                <img
                  src="/profile.jpg"
                  alt="Nicolas Pichiteli dos Santos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Rotating gradient ring, same technique as the intro logo mark */}
              <div
                className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none"
                style={{
                  padding: 2,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              >
                <motion.div
                  className="absolute"
                  style={{
                    width: "220%",
                    height: "220%",
                    top: "-60%",
                    left: "-60%",
                    background: "conic-gradient(from 0deg, #8B5CF6, #67E8F9, #F0ABFC, #8B5CF6)",
                    willChange: "transform",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Floating role chip */}
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`absolute -top-4 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono2 backdrop-blur-md ${dark ? "bg-[#0B0B0F]/90 border-white/10 text-white/80" : "bg-white/90 border-black/10 text-black/80"}`}
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
              >
                <Code2 size={12} className="text-violet-400" /> {t.role}
              </motion.div>

              {/* Floating availability pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className={`absolute -bottom-4 -right-2 sm:-right-6 flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-md ${dark ? "bg-[#0B0B0F]/90 border-white/10" : "bg-white/90 border-black/10"}`}
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                </span>
                <span className={`text-xs font-body font-medium whitespace-nowrap ${dark ? "text-white/80" : "text-black/80"}`}>{t.badge}</span>
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
            <div className={`inline-flex items-center gap-1.5 mb-4 text-xs font-mono2 ${dark ? "text-white/35" : "text-black/55"}`}>
              <MapPin size={12} /> {t.location}
            </div>
            <p className={`font-body text-lg leading-relaxed mb-8 ${dark ? "text-white/55" : "text-black/72"}`}>{t.about_bio}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={13} className="text-violet-400" />
              <span className={`text-[11px] font-mono2 uppercase tracking-[0.18em] ${dark ? "text-white/35" : "text-black/50"}`}>Stack</span>
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border transition-colors duration-300 cursor-default ${dark ? "border-white/10 bg-white/[0.04] text-white/55 hover:border-violet-500/40 hover:text-white" : "border-black/[0.16] bg-black/[0.07] text-black/72 hover:border-violet-400 hover:text-black"}`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CARDS.map(({ icon: Icon, val, lbl, clr, bg }, i) => (
            <motion.div
              key={val}
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
              className={`group p-6 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)]" : "bg-white border-black/[0.16] hover:border-violet-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)]"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${bg}`}>
                <Icon size={18} className={clr} />
              </div>
              <div className={`font-display text-4xl font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{val}</div>
              <div className={`text-xs mt-1 font-body ${dark ? "text-white/40" : "text-black/62"}`}>{lbl[lang]}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
