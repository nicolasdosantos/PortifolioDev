import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { Lang, Translation } from "../../types";
import { goToSection } from "../../utils/sections";

interface HeroProps {
  dark: boolean;
  t: Translation;
  lang: Lang;
}

const SOCIALS = [
  { Icon: Github, href: "https://github.com/nicolasdosantos", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:nicolaspichiteli245@gmail.com", label: "E-mail" },
];

/* O card de código é sempre escuro (preto suave, não #000), nos dois temas: as cores da
   sintaxe seguem o tema escuro mesmo com o site no claro. */
const codeDark = true;

export function Hero({ dark, t, lang }: HeroProps) {
  /* Nome completo, como no currículo, no LinkedIn e na busca: "Nicolas Pichiteli" em
     cima e "dos Santos" com o degradê. Cada linha quebra nos espaços em telas estreitas. */
  const words = t.fullName.split(" ");
  const nameLines = [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  const cvHref = lang === "en" ? "/nicolas-pichiteli-cv-en.pdf" : "/nicolas-pichiteli-cv.pdf";
  const cvFilename = lang === "en" ? "Nicolas-Pichiteli-CV-EN.pdf" : "Nicolas-Pichiteli-CV.pdf";

  /* o brilho do nome pausa quando o Hero sai da tela (regra [data-paused] no theme.css) */
  const sectionRef = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="home" ref={sectionRef} data-paused={!onScreen || undefined} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} 1px,transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className={`font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight mb-6 ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}
            >
              {nameLines.map((w, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span
                      className="bg-clip-text text-transparent name-sweep"
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
              className="flex items-start gap-3 mb-6"
            >
              <span className={`text-xl font-body ${dark ? "text-white/50" : "text-black/70"}`}>—</span>
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`text-lg font-body font-medium ${dark ? "text-white/90" : "text-black/85"}`}>{t.role}</span>
                <span className={`text-sm font-body ${dark ? "text-white/50" : "text-black/70"}`}>{t.role_stack}</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className={`font-body text-base max-w-lg leading-relaxed mb-8 ${dark ? "text-white/70" : "text-black/70"}`}
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <a
                href="#projetos"
                onClick={e => { e.preventDefault(); goToSection("projetos"); }}
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-[color:var(--p-on-accent)] text-sm font-body font-medium transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--p-accent), var(--p-accent-strong))" }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, var(--p-accent-strong), var(--p-accent))" }}
                />
                <span className="relative flex items-center gap-2">
                  {t.cta_projects} <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
              {/* Hierarquia: "Ver Projetos" é a ação principal, o CV é secundário (contorno) e o
                  contato vira link de texto. Antes eram três botões, dois deles com o mesmo peso. */}
              <a
                href={cvHref}
                download={cvFilename}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-body font-medium transition-colors duration-300 ${dark ? "border-white/15 text-white/90 hover:bg-white/[0.05] hover:border-white/25" : "border-black/[0.18] text-black/85 hover:bg-black/[0.07]"}`}
              >
                <Download size={15} aria-hidden /> {t.cta_cv}
              </a>
              <a
                href="#contato"
                onClick={e => { e.preventDefault(); goToSection("contato"); }}
                className={`group flex items-center gap-1.5 px-2 py-3 text-sm font-body font-medium underline underline-offset-4 transition-colors ${dark ? "text-white/70 decoration-white/25 hover:text-white hover:decoration-brand-ink" : "text-black/70 decoration-black/25 hover:text-black hover:decoration-brand"}`}
              >
                {t.cta_contact}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className={`flex items-center gap-1.5 text-xs font-body ${dark ? "text-white/50" : "text-black/70"}`}>
                <MapPin size={12} /> {t.location}
              </div>
              <div className={`w-px h-4 ${dark ? "bg-white/10" : "bg-black/[0.14]"}`} />
              <div className="flex items-center gap-2">
                {SOCIALS.map(({ Icon, href, label }, i) => (
                  /* GitHub e LinkedIn abriam na MESMA aba, tirando o visitante do
                     portfólio. mailto continua na aba atual, que é o certo para ele.
                     aria-label porque o link só tem ícone. */
                  <a
                    key={i}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
                    className={`p-2 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${dark ? "border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] hover:border-white/20" : "border-black/[0.16] text-black/70 hover:text-black hover:bg-black/[0.07]"}`}
                  >
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
            className="relative group/card w-full"
          >
            <div
              style={{ background: "linear-gradient(160deg, #18181C 0%, #0F0F12 60%, #121216 100%)" }}
              className={`relative w-full max-w-[22rem] mx-auto lg:mx-0 rounded-xl border overflow-hidden ${codeDark ? "border-white/[0.09]" : ""}`}
            >
              <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${codeDark ? "border-white/[0.06]" : "border-black/[0.15]"}`}>
                {[0, 1, 2].map(i => <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/15" />)}
                <span className={`ml-2 text-xs font-mono2 ${codeDark ? "text-white/50" : "text-black/70"}`}>developer.ts</span>
              </div>
              <div className="p-5 space-y-1.5">
                {(() => {
                  /* Sintaxe em dois tons da paleta: palavras-chave e números no vinho, strings num creme
                     mais quente, chaves e pontuação apagadas. Antes eram azul, verde, ciano e amarelo. */
                  const kw = "text-brand-ink";
                  const ident = "text-white/90";
                  const punct = codeDark ? "text-white/50" : "text-black/70";
                  const key = codeDark ? "text-white/50" : "text-black/70";
                  const comma = codeDark ? "text-white/35" : "text-black/70";
                  const str = "text-[color:color-mix(in_srgb,var(--p-secondary)_80%,#C08A4A)]";
                  const num = "text-brand-ink/85";
                  const kw2 = str;
                  const lines = [
                    { code: <><span className={kw}>const </span><span className={ident}>dev</span><span className={punct}> = {"{"}</span></> },
                    { indent: true, code: <><span className={key}>role: </span><span className={kw2}>&quot;Full Stack Developer&quot;</span><span className={comma}>,</span></> },
                    { indent: true, code: <><span className={key}>location: </span><span className={kw2}>&quot;Birigui, BR&quot;</span><span className={comma}>,</span></> },
                    { indent: true, code: <><span className={key}>studyingSince: </span><span className={num}>2022</span><span className={comma}>,</span></> },
                    {
                      indent: true,
                      wrap: true,
                      code: (
                        <>
                          <span className={key}>stack: </span>
                          <span className={punct}>[</span>
                          {["PHP", "Laravel", "React", "TypeScript"].map((s, idx, arr) => (
                            <span key={s}>
                              <span className={num}>&quot;{s}&quot;</span>
                              {idx < arr.length - 1 && <span className={comma}>, </span>}
                            </span>
                          ))}
                          <span className={punct}>],</span>
                        </>
                      ),
                    },
                    { indent: true, code: <><span className={key}>automation: </span><span className={num}>&quot;Python&quot;</span><span className={comma}>,</span></> },
                    { indent: true, code: <><span className={key}>learning: </span><span className={num}>&quot;Java&quot;</span><span className={comma}>,</span></> },
                    { indent: true, code: <><span className={key}>open: </span><span className={str}>true</span><span className={comma}>,</span></> },
                    { code: <span className={punct}>{"}"}</span> },
                    { blank: true },
                    { code: <span className={punct}>{"// now: B4 Charge + Laravel at work"}</span> },
                  ];
                  let elapsed = 0.7;
                  const rendered = lines.map((line, i) => {
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
                  /* o cursor começa a piscar quando a última linha termina de "digitar":
                     antes era um 3.4s fixo, que descompassava ao mudar o número de linhas */
                  const typingEnd = elapsed + 0.45;
                  return (
                    <>
                      {rendered}
                      <motion.span
                        className={`inline-block w-[6px] h-[12px] align-middle ${codeDark ? "bg-cream/80" : "bg-brand-dark"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: typingEnd }}
                      />
                    </>
                  );
                })()}
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
          <span className={`text-xs font-body ${dark ? "text-white/50" : "text-black/70"}`}>{t.scroll_hint}</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={16} className={dark ? "text-white/50" : "text-black/70"} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
