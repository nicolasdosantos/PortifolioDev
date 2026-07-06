import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Download, Github, Linkedin, Mail, MapPin, MessageSquare } from "lucide-react";
import type { Translation } from "../../types";

interface HeroProps {
  dark: boolean;
  t: Translation;
}

const SOCIALS = [
  { Icon: Github, href: "https://github.com/nicolasdosantos" },
  { Icon: Linkedin, href: "https://linkedin.com/in/nicolas-pichiteli-dos-santos" },
  { Icon: Mail, href: "mailto:nicolaspichiteli245@gmail.com" },
];

export function Hero({ dark, t }: HeroProps) {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} 1px,transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className={`font-display text-[clamp(3.5rem,10vw,7rem)] font-bold leading-[0.92] tracking-tight mb-5 ${dark ? "text-white" : "text-[#08080A]"}`}
            >
              {t.name.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span className="text-violet-500">{w}</span> : w}
                </span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className={`text-xl font-mono2 ${dark ? "text-white/30" : "text-black/30"}`}>—</span>
              <span className={`text-lg font-body font-medium ${dark ? "text-white/65" : "text-black/60"}`}>{t.role}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className={`font-body text-base max-w-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-black/50"}`}
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
              >
                {t.cta_projects} <ArrowRight size={15} />
              </button>
              <button
                onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 ${dark ? "border-white/12 text-white/75 hover:bg-white/[0.05] hover:border-white/22" : "border-black/12 text-black/70 hover:bg-black/[0.04]"}`}
              >
                {t.cta_contact} <MessageSquare size={15} />
              </button>
              <a
                href="/nicolas-pichiteli-cv.pdf"
                download="Nicolas-Pichiteli-CV.pdf"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 ${dark ? "border-white/12 text-white/75 hover:bg-white/[0.05]" : "border-black/12 text-black/70 hover:bg-black/[0.04]"}`}
              >
                <Download size={15} /> {t.cta_cv}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className={`flex items-center gap-1.5 text-xs font-mono2 ${dark ? "text-white/35" : "text-black/35"}`}>
                <MapPin size={12} /> {t.location}
              </div>
              <div className={`w-px h-4 ${dark ? "bg-white/10" : "bg-black/10"}`} />
              <div className="flex items-center gap-2">
                {SOCIALS.map(({ Icon, href }, i) => (
                  <a key={i} href={href} className={`p-2 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${dark ? "border-white/10 text-white/45 hover:text-white hover:bg-white/[0.05] hover:border-white/20" : "border-black/10 text-black/45 hover:text-black hover:bg-black/[0.04]"}`}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Code card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className={`w-72 rounded-2xl border overflow-hidden ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-black/[0.02] border-black/[0.07]"}`}>
              <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${dark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                {["#FF5F57", "#FFBD2E", "#28C840"].map(c => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                <span className={`ml-2 text-xs font-mono2 ${dark ? "text-white/25" : "text-black/25"}`}>developer.ts</span>
              </div>
              <div className="p-5 space-y-1.5">
                {[
                  { code: <><span className="text-violet-400/70">const </span><span className="text-blue-400/70">dev</span><span className="text-white/25"> = {"{"}</span></> },
                  { indent: true, code: <><span className="text-white/30">name: </span><span className="text-emerald-400/70">&quot;Nicolas Santos&quot;</span><span className="text-white/20">,</span></> },
                  { indent: true, code: <><span className="text-white/30">role: </span><span className="text-amber-400/70">&quot;Full Stack Dev&quot;</span><span className="text-white/20">,</span></> },
                  { indent: true, code: <><span className="text-white/30">xp: </span><span className="text-sky-400/70">&quot;3+ years&quot;</span><span className="text-white/20">,</span></> },
                  { indent: true, code: <><span className="text-white/30">open: </span><span className="text-emerald-400/70">true</span><span className="text-white/20">,</span></> },
                  { code: <span className="text-white/25">{"}"}</span> },
                ].map((line, i) => (
                  <div key={i} className={`text-xs font-mono2 ${line.indent ? "pl-5" : ""}`}>{line.code}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className={`text-xs font-mono2 ${dark ? "text-white/25" : "text-black/25"}`}>{t.scroll_hint}</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={16} className={dark ? "text-white/25" : "text-black/25"} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
