import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import type { Lang, Project, ProjectStatus, SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { projects } from "../../data";
import { ProjectModal } from "./ProjectModal";

const STATUS_STYLE: Record<ProjectStatus, string> = {
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  in_progress: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

/* Os cards eram <div onClick> sem foco: quem navega pelo teclado não abria nenhum projeto.
   role="button" + tabIndex + Enter/Espaço deixam o card inteiro acionável sem trocar o markup
   de bloco por um <button> (que só aceita conteúdo inline). */
function cardA11y(p: Project, lang: Lang, open: (p: Project) => void) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "dialog" as const,
    "aria-label": `${p.title} — ${lang === "pt" ? "ver detalhes" : "view details"}`,
    onClick: () => open(p),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(p);
      }
    },
  };
}

const FOCUS_RING = "outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080A]";

/** Prévia do card: toca sem som só enquanto está visível e para ao sair da tela.
    preload="none" + poster: nada do vídeo baixa até o card chegar perto da tela.
    Com movimento reduzido fica só o poster. */
function CardVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

function Tags({ tags, dark, max }: { tags: string[]; dark: boolean; max?: number }) {
  const shown = max ? tags.slice(0, max) : tags;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map(tag => (
        <span key={tag} className={`px-2 py-0.5 rounded text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/58" : "border-black/[0.16] bg-black/[0.07] text-black/70"}`}>{tag}</span>
      ))}
      {max && tags.length > max && <span className={`text-xs font-mono2 self-center ${dark ? "text-white/50" : "text-black/62"}`}>+{tags.length - max}</span>}
    </div>
  );
}

export function Projects({ dark, t, lang }: SectionProps) {
  const [sel, setSel] = useState<Project | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  const open = (p: Project) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setSel(p);
  };
  const close = useCallback(() => setSel(null), []);

  // Ao fechar, o foco volta para o card que abriu o modal.
  useEffect(() => {
    if (!sel) lastFocus.current?.focus();
  }, [sel]);

  const cardBase = `group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${FOCUS_RING} ${dark ? "bg-[#0d0d12]/95 border-white/[0.09]" : "bg-white border-black/[0.16]"}`;

  return (
    <section id="projetos" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.projects_label} title={t.projects_title} dark={dark} />

        {/* Destaques: os dois projetos com vídeo, lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              {...cardA11y(p, lang, open)}
              className={`${cardBase} flex flex-col hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)]`}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {p.video ? <CardVideo src={p.videoPreview ?? p.video} poster={p.image} /> : (
                  <img src={p.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-mono2">
                  ★ {lang === "pt" ? "Destaque" : "Featured"}
                </span>
                {p.video && (
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/85 text-xs font-mono2">
                    <Play size={11} fill="currentColor" /> {lang === "pt" ? "Ver vídeo" : "Watch video"}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className={`font-display text-xl font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{p.title}</h3>
                    <span className={`text-xs font-mono2 ${dark ? "text-white/50" : "text-black/66"}`}>{p.category[lang]} · {p.year}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-1 rounded-lg text-xs border ${STATUS_STYLE[p.status]}`}>{t[p.status]}</span>
                </div>
                <p className={`text-sm font-body mb-5 ${dark ? "text-white/68" : "text-black/74"}`}>{p.description[lang]}</p>
                <div className="mt-auto"><Tags tags={p.tags} dark={dark} /></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demais projetos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              {...cardA11y(p, lang, open)}
              className={`${cardBase} flex flex-col hover:shadow-[0_15px_40px_rgba(124,58,237,0.1)]`}
            >
              <div className="relative overflow-hidden">
                <img src={p.image} alt="" loading="lazy" decoding="async" className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${dark ? "from-[#08080A]/50" : "from-white/60"}`} />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className={`font-display font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{p.title}</h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs border ${STATUS_STYLE[p.status]}`}>{t[p.status]}</span>
                </div>
                <span className={`text-xs font-mono2 mb-3 ${dark ? "text-white/50" : "text-black/66"}`}>{p.category[lang]} · {p.year}</span>
                <p className={`text-sm font-body mb-4 ${dark ? "text-white/62" : "text-black/70"}`}>{p.description[lang]}</p>
                <div className="mt-auto"><Tags tags={p.tags} dark={dark} max={3} /></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {/* O modal é sempre escuro, nos dois temas: os vídeos são escuros e dissolvê-los
            num fundo branco deixava uma faixa cinza. Como no Apple TV+ e na Netflix. */}
        {sel && <ProjectModal project={sel} dark lang={lang} t={t} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
