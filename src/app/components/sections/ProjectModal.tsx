import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Github, Lock, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import type { Lang, Project, Translation } from "../../types";

interface ProjectModalProps {
  project: Project;
  dark: boolean;
  lang: Lang;
  t: Translation;
  onClose: () => void;
}

const DEFAULT_ACCENT = "#7C3AED";

/* O vídeo some na cor do card por máscara, não por um véu por cima: assim nada cobre a imagem
   e o fim do vídeo vira o fundo do texto. Os controles nativos ficariam dentro da parte
   transparente, por isso há controles próprios no canto e a barra de progresso no topo. */
const FADE = "linear-gradient(to bottom, #000 0%, #000 40%, rgba(0,0,0,.5) 70%, transparent 92%)";
const FADE_MASK: CSSProperties = { maskImage: FADE, WebkitMaskImage: FADE };

/** Cores claras (como o dourado do Obsidian) pedem texto escuro no botão. */
function inkFor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? "#08080A" : "#FFFFFF";
}

function MediaButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid place-items-center w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white/90 border border-white/15 hover:bg-black/65 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      {children}
    </button>
  );
}

export function ProjectModal({ project: p, dark, lang, t, onClose }: ProjectModalProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const accent = p.accent ?? DEFAULT_ACCENT;
  const pt = lang === "pt";
  // "Nexo — Controle Financeiro": o nome vai grande e o complemento vira subtítulo.
  const [name, subtitle] = p.title.split(" — ");

  // Foco no fechar, Esc fecha e a página de trás não rola enquanto o modal está aberto.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  /* A pessoa clicou para abrir, então tenta tocar com som. Se o navegador recusar,
     toca mudo e o botão de som fica à vista. Com movimento reduzido não toca sozinho. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [reduced]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const onTime = () => {
    const v = videoRef.current;
    if (v && progressRef.current && v.duration) progressRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
  };

  const paragraphs = p.fullDesc[lang].split("\n\n");
  const story = [
    { label: pt ? "O problema" : "The problem", text: p.problem[lang] },
    { label: pt ? "O que eu fiz" : "What I built", text: p.solution[lang] },
    { label: pt ? "Onde está hoje" : "Where it stands", text: p.results[lang] },
  ];

  const surface = dark ? "#0D0D12" : "#FFFFFF";
  const ink = dark ? "text-white" : "text-[#08080A]";
  const body = dark ? "text-white/70" : "text-black/72";
  const muted2 = dark ? "text-white/50" : "text-black/55";
  const hairline = dark ? "border-white/[0.08]" : "border-black/[0.09]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={`relative z-10 w-full md:max-w-4xl max-h-[94vh] md:max-h-[90vh] overflow-y-auto overscroll-contain rounded-t-[28px] md:rounded-[28px] border ${hairline}`}
        style={{
          background: surface,
          boxShadow: `0 40px 120px -20px ${accent}55, 0 0 0 1px ${accent}1f`,
        }}
      >
        {/* Mídia: ponta a ponta, dissolvendo no fundo do card */}
        <div className="relative">
          {/* brilho da cor do projeto atrás do vídeo, que continua por baixo do degradê */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[120%] pointer-events-none"
            style={{ background: `radial-gradient(70% 60% at 50% 35%, ${accent}${dark ? "40" : "26"}, transparent 70%)` }}
          />
          {p.video ? (
            <video
              ref={videoRef}
              src={p.video}
              poster={p.image}
              playsInline
              preload="auto"
              onClick={togglePlay}
              onPlay={() => { setPlaying(true); setEnded(false); }}
              onPause={() => setPlaying(false)}
              onEnded={() => setEnded(true)}
              onTimeUpdate={onTime}
              className="relative block w-full aspect-video object-cover cursor-pointer"
              style={FADE_MASK}
            />
          ) : (
            <img src={p.image} alt="" className="relative block w-full aspect-[16/7] object-cover object-top" style={FADE_MASK} />
          )}

          {p.video && (
            <div className="absolute top-0 inset-x-0 h-[3px] bg-white/10 overflow-hidden md:rounded-t-[28px]">
              <div ref={progressRef} className="h-full origin-left" style={{ background: accent, transform: "scaleX(0)" }} />
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            {p.video && (
              <>
                <MediaButton onClick={togglePlay} label={ended ? (pt ? "Ver de novo" : "Replay") : playing ? (pt ? "Pausar" : "Pause") : (pt ? "Reproduzir" : "Play")}>
                  {ended ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
                </MediaButton>
                <MediaButton onClick={toggleMute} label={muted ? (pt ? "Ativar som" : "Unmute") : (pt ? "Tirar som" : "Mute")}>
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </MediaButton>
              </>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={pt ? "Fechar" : "Close"}
              className="grid place-items-center w-10 h-10 rounded-full bg-white text-black hover:bg-white/85 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ ["--tw-ring-color" as string]: accent }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Cabeçalho apoiado no fim do degradê */}
        <div className="relative px-6 md:px-12 -mt-3 md:-mt-12">
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-body ${muted2}`}>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === "completed" ? "#34D399" : "#FBBF24" }} />
              {t[p.status]}
            </span>
            <span aria-hidden="true" className={dark ? "text-white/20" : "text-black/20"}>/</span>
            <span>{p.category[lang]}</span>
            <span aria-hidden="true" className={dark ? "text-white/20" : "text-black/20"}>/</span>
            <span>{p.year}</span>
          </div>
          <h2 id="project-modal-title" className={`font-display font-bold tracking-[-0.03em] leading-[0.95] text-4xl md:text-6xl mt-3 ${ink}`}>
            {name}
          </h2>
          {subtitle && <p className={`mt-2 font-display text-lg md:text-2xl font-semibold tracking-[-0.01em] ${dark ? "text-white/55" : "text-black/50"}`}>{subtitle}</p>}
          <p className={`mt-5 max-w-2xl text-base md:text-lg font-body leading-relaxed ${dark ? "text-white/80" : "text-black/78"}`}>
            {p.description[lang]}
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            {p.demo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-medium transition-[filter] hover:brightness-110 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: accent, color: inkFor(accent), boxShadow: `0 10px 30px -8px ${accent}99`, ["--tw-ring-color" as string]: accent, ["--tw-ring-offset-color" as string]: surface }}
              >
                {p.demoLabel?.[lang] ?? (pt ? "Abrir projeto" : "Open project")}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-medium border transition-colors outline-none focus-visible:ring-2 ${dark ? "border-white/15 text-white/85 hover:bg-white/[0.06]" : "border-black/15 text-black/80 hover:bg-black/[0.05]"}`}
                style={{ ["--tw-ring-color" as string]: accent }}
              >
                <Github size={16} /> {pt ? "Ver código" : "View code"}
              </a>
            ) : (
              <span className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm border border-dashed ${dark ? "border-white/15 text-white/55" : "border-black/20 text-black/55"}`}>
                <Lock size={14} /> {pt ? "Código privado" : "Private code"}
              </span>
            )}
          </div>
        </div>

        {/* Corpo */}
        <div className="px-6 md:px-12 pt-10 md:pt-12 pb-10 md:pb-12">
          <div className={`grid md:grid-cols-[1fr_220px] gap-10 md:gap-12 pt-10 border-t ${hairline}`}>
            <div className={`space-y-4 max-w-[62ch] text-[15px] font-body leading-[1.75] ${body}`}>
              {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <aside>
              <h3 className={`text-sm font-body mb-3 ${muted2}`}>Stack</h3>
              <ul className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => (
                  <li
                    key={tag}
                    className={`px-2.5 py-1 rounded-full text-xs font-body border ${dark ? "border-white/10 text-white/75" : "border-black/12 text-black/72"}`}
                    style={{ background: `${accent}${dark ? "14" : "10"}` }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Problema, solução e resultado como uma leitura contínua, não três caixas iguais */}
          <dl className={`mt-12 border-t ${hairline}`}>
            {story.map(({ label, text }) => (
              <div key={label} className={`grid md:grid-cols-[180px_1fr] gap-1 md:gap-8 py-5 border-b ${hairline}`}>
                <dt className="text-sm font-display font-semibold" style={{ color: dark ? `color-mix(in srgb, ${accent} 60%, white)` : accent }}>{label}</dt>
                <dd className={`text-[15px] font-body leading-relaxed max-w-[62ch] ${body}`}>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </motion.div>
  );
}
