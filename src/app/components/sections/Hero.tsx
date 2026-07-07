import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Download, Github, Linkedin, Mail, MapPin, MessageSquare } from "lucide-react";
import type { Lang, Translation } from "../../types";

interface HeroProps {
  dark: boolean;
  t: Translation;
  lang: Lang;
}

const SOCIALS = [
  { Icon: Github, href: "https://github.com/nicolasdosantos" },
  { Icon: Linkedin, href: "https://linkedin.com/in/nicolas-pichiteli-dos-santos" },
  { Icon: Mail, href: "mailto:nicolaspichiteli245@gmail.com" },
];

export function Hero({ dark, t, lang }: HeroProps) {
  const cvHref = lang === "en" ? "/nicolas-pichiteli-cv-en.pdf" : "/nicolas-pichiteli-cv.pdf";
  const cvFilename = lang === "en" ? "Nicolas-Pichiteli-CV-EN.pdf" : "Nicolas-Pichiteli-CV.pdf";

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
              style={{ boxShadow: "0 0 20px rgba(124,58,237,0.15)" }}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
              </span>
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
                  {i === 1 ? (
                    <span
                      className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 text-shimmer"
                      style={{ filter: "drop-shadow(0 0 30px rgba(124,58,237,0.35))" }}
                    >
                      {w}
                    </span>
                  ) : (
                    w
                  )}
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
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,58,237,0.45)] overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
                />
                <span className="relative flex items-center gap-2">
                  {t.cta_projects} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
              <button
                onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 ${dark ? "border-white/12 text-white/75 hover:bg-white/[0.05] hover:border-white/22" : "border-black/12 text-black/70 hover:bg-black/[0.04]"}`}
              >
                {t.cta_contact} <MessageSquare size={15} />
              </button>
              <a
                href={cvHref}
                download={cvFilename}
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
            whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
            className="relative group/card w-full"
          >
            <motion.div
              className="absolute -inset-8 rounded-3xl -z-10"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)", filter: "blur(24px)" }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className={`relative w-full max-w-[25rem] mx-auto lg:mx-0 rounded-2xl border overflow-hidden transition-shadow duration-300 ease-out group-hover/card:shadow-[0_0_50px_rgba(124,58,237,0.25)] ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-black/[0.02] border-black/[0.07]"}`}
            >
              <motion.div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #C4B5FD, #67E8F9, transparent)", backgroundSize: "200% auto" }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${dark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                {["#FF5F57", "#FFBD2E", "#28C840"].map(c => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                <span className={`ml-2 text-xs font-mono2 ${dark ? "text-white/25" : "text-black/25"}`}>developer.ts</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono2 text-emerald-400/70">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                  </span>
                  online
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                {(() => {
                  const lines = [
                    { code: <><span className="text-violet-400/70">const </span><span className="text-blue-400/70">dev</span><span className="text-white/25"> = {"{"}</span></> },
                    { indent: true, code: <><span className="text-white/30">name: </span><span className="text-emerald-400/70">&quot;Nicolas Santos&quot;</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">fullName: </span><span className="text-emerald-400/70">&quot;Nicolas Pichiteli dos Santos&quot;</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">age: </span><span className="text-sky-400/70">19</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">role: </span><span className="text-amber-400/70">&quot;Full Stack Developer&quot;</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">location: </span><span className="text-amber-400/70">&quot;Birigui, BR&quot;</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">xp: </span><span className="text-sky-400/70">&quot;3+ years&quot;</span><span className="text-white/20">,</span></> },
                    {
                      indent: true,
                      wrap: true,
                      code: (
                        <>
                          <span className="text-white/30">stack: </span>
                          <span className="text-white/25">[</span>
                          {["React", "TypeScript", "Node", "PHP", "Python"].map((s, idx, arr) => (
                            <span key={s}>
                              <span className="text-sky-400/70">&quot;{s}&quot;</span>
                              {idx < arr.length - 1 && <span className="text-white/20">, </span>}
                            </span>
                          ))}
                          <span className="text-white/25">],</span>
                        </>
                      ),
                    },
                    { indent: true, code: <><span className="text-white/30">focus: </span><span className="text-emerald-400/70">&quot;clean code &amp; UX&quot;</span><span className="text-white/20">,</span></> },
                    { indent: true, code: <><span className="text-white/30">open: </span><span className="text-emerald-400/70">true</span><span className="text-white/20">,</span></> },
                    { code: <span className="text-white/25">{"}"}</span> },
                    { blank: true },
                    { code: <span className="text-white/25">{"// building the future, one commit at a time"}</span> },
                  ];
                  let elapsed = 0.7;
                  return lines.map((line, i) => {
                    const delay = elapsed;
                    const duration = line.blank ? 0.1 : 0.45;
                    elapsed += line.blank ? 0.08 : duration * 0.55;
                    return (
                      <div key={i} className={`overflow-hidden ${line.blank ? "h-1.5" : ""}`}>
                        <motion.div
                          initial={{ clipPath: "inset(0 100% 0 0)" }}
                          animate={{ clipPath: "inset(0 0% 0 0)" }}
                          transition={{ duration, delay, ease: "linear" }}
                          className={`text-xs font-mono2 ${line.wrap ? "whitespace-normal break-words" : "whitespace-nowrap"} ${line.indent ? "pl-5" : ""}`}
                        >
                          {line.code}
                        </motion.div>
                      </div>
                    );
                  });
                })()}
                <motion.span
                  className="inline-block w-[6px] h-[12px] bg-cyan-300/80 align-middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 3.4 }}
                />
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
