import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { ComponentType, CSSProperties } from "react";
import { ArrowRight, Bot, Database, Monitor, Rocket, Server, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { FaJava } from "react-icons/fa";
import { SiClaude, SiFigma, SiGit, SiJavascript, SiLaravel, SiMysql, SiPhp, SiPhpmyadmin, SiPython, SiReact, SiSupabase, SiTailwindcss, SiTypescript, SiVercel } from "react-icons/si";
import type { Lang } from "../../types";

/* react-icons e lucide-react têm tipos diferentes mas a mesma superfície útil aqui —
   este alias deixa as duas famílias conviverem na mesma lista de techs. */
type AnyIcon = ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;

/* Cubo, plataforma e cards são DOM (perspective + preserve-3d) e SVG, não imagens.
   O render de referência (public/hero/image.png) definiu layout e estilo; o conteúdo
   vem do stack declarado em data/skills.ts, não do mockup. */

/** paleta fixa do cubo — não segue a cor do card ativo */
const CORE_CYAN = "#67E8F9";
const CORE_VIOLET = "#A78BFA";

export interface StackCard {
  id: string;
  label: { pt: string; en: string };
  /** techs reais da categoria, com o ícone de marca */
  items: { name: string; icon: AnyIcon }[];
  color: string;
  icon: AnyIcon;
  /** posição no anel, em graus: 0 = direita, negativo = acima */
  angle: number;
}

/* As 5 categorias reais de data/skills.ts. O mockup mostrava 8 cards com AWS, Docker,
   Spring Boot, React Native etc. — techs que não constam no stack declarado, e num
   portfólio isso é afirmação sobre o próprio dono. */
export const STACK_CARDS: StackCard[] = [
  {
    id: "frontend",
    label: { pt: "Front-end", en: "Front-end" },
    items: [
      { name: "React", icon: SiReact },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
    color: "#67E8F9",
    icon: Monitor,
    angle: -92,
  },
  {
    id: "backend",
    label: { pt: "Back-end", en: "Back-end" },
    items: [
      { name: "PHP", icon: SiPhp },
      { name: "Laravel", icon: SiLaravel },
      { name: "Python", icon: SiPython },
      { name: "Java", icon: FaJava },
    ],
    color: "#FFB454",
    icon: Server,
    angle: -24,
  },
  {
    id: "database",
    label: { pt: "Dados", en: "Data" },
    items: [
      { name: "MySQL", icon: SiMysql },
      { name: "Supabase", icon: SiSupabase },
      { name: "phpMyAdmin", icon: SiPhpmyadmin },
    ],
    color: "#34D399",
    icon: Database,
    angle: 44,
  },
  {
    id: "tools",
    label: { pt: "Ferramentas", en: "Tooling" },
    items: [
      { name: "Git", icon: SiGit },
      { name: "Figma", icon: SiFigma },
      { name: "Vercel", icon: SiVercel },
    ],
    color: "#A78BFA",
    icon: Wrench,
    angle: 138,
  },
  {
    id: "ai",
    label: { pt: "IA no fluxo", en: "AI in the flow" },
    /* Bot em vez de um ícone de marca: react-icons não tem SiOpenai, e é o mesmo
       ícone que data/skills.ts já usa para ChatGPT */
    items: [
      { name: "ChatGPT", icon: Bot },
      { name: "Claude", icon: SiClaude },
    ],
    color: "#F0ABFC",
    icon: Sparkles,
    angle: -152,
  },
];

/** itens da lista da coluna de texto */
const FEATURES: { icon: AnyIcon; pt: string; en: string }[] = [
  { icon: Monitor, pt: "Interfaces modernas e responsivas", en: "Modern, responsive interfaces" },
  { icon: Server, pt: "APIs e regras de negócio", en: "APIs and business rules" },
  { icon: Database, pt: "Banco de dados modelado", en: "Properly modeled databases" },
  { icon: ShieldCheck, pt: "Código limpo e escalável", en: "Clean, scalable code" },
  { icon: Rocket, pt: "Deploy e acompanhamento", en: "Deploy and monitoring" },
];

export interface StackHeroConfig {
  /** altura da seção em viewports — define quanto scroll a sequência consome */
  pages: number;
  perspective: number;
  rotX: number;
  rotY: number;
  /** tamanho do cubo, em fração da menor dimensão do palco */
  cubeSize: number;
  /** raios do anel, em fração da largura/altura do palco */
  orbitRx: number;
  orbitRy: number;
  /** largura do card, em fração da largura do palco */
  cardW: number;
  /** quanto o card avança para fora do anel ao aparecer, em fração do raio */
  emerge: number;
  tStart: number;
  tStep: number;
  tDur: number;
  rimGlow: number;
  bgGlow: number;
  dimInactive: number;
}

export const STACK_HERO_DEFAULTS: StackHeroConfig = {
  pages: 3.2,
  perspective: 1500,
  rotX: 8,
  /* quase frontal, como na referência: o cubo é lido de frente, com a face de cima
     apenas insinuada — não em três quartos */
  rotY: -6,
  cubeSize: 0.4,
  orbitRx: 0.4,
  /* raio Y contido: com 0.4 o card do topo (ângulo -92°) subia além da borda do palco e
     era cortado. O limite é cy − alturaDoCard/2 − folga. */
  orbitRy: 0.3,
  cardW: 0.22,
  emerge: 0.16,
  tStart: 0.06,
  tStep: 0.17,
  tDur: 0.16,
  rimGlow: 1,
  bgGlow: 0.6,
  /* alto de propósito: na referência todos os cards brilham igual. O apagamento serve
     só para dar um leve destaque ao que acabou de entrar, não para sumir com os outros. */
  dimInactive: 0.92,
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const rad = (deg: number) => (deg * Math.PI) / 180;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** escurece (k<1) ou clareia (k>1) uma cor, devolvendo rgba */
const mix = (hex: string, k: number, a = 1) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(k <= 1 ? v * k : Math.min(255, v + (255 - v) * (k - 1)));
  return `rgba(${ch((n >> 16) & 255)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)}, ${a})`;
};

/* Grão fino. Gradiente largo em alfa baixo faz banding em tela de 8 bits, e são
   essas faixas que leem como "gráfico de baixa qualidade". */
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(#n)'/></svg>`,
)}")`;

/** espessura das arestas do cubo, em px */
const EDGE = 1.5;

/* Núcleo do cubo: placa de circuito em SVG — trilhas com dobras de 45°, barramentos,
   pads com via e die central. Vetor de propósito: repeating-linear-gradient com passo
   fora de pixel inteiro produz moiré em tela não-retina. */
const PCB_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'>
<g fill='none' stroke-linecap='round' stroke-linejoin='round'>
 <g stroke='${CORE_VIOLET}' stroke-width='.5' opacity='.18'>
  <path d='M0 30h240M0 60h240M0 90h240M0 150h240M0 180h240M0 210h240'/>
  <path d='M30 0v240M60 0v240M90 0v240M150 0v240M180 0v240M210 0v240'/>
 </g>
 <g stroke='${CORE_VIOLET}' stroke-width='2' opacity='.34'>
  <path d='M0 196h40l20-20h52M0 204h36l24-24h48M0 212h32l28-28h44'/>
  <path d='M240 44h-40l-20 20h-52M240 36h-36l-24 24h-48'/>
 </g>
 <g stroke='${CORE_CYAN}' stroke-width='1.4' opacity='.66'>
  <path d='M96 84V52L78 34H30M108 84V44L94 30H14M120 84V38M132 84V52h44l16 16v26'/>
  <path d='M144 84V60h30M156 96h34l14 14v40M156 120h58M156 132h26l18 18v52'/>
  <path d='M144 156v30l-14 14v40M120 156v54M108 156v26l-16 16H36'/>
  <path d='M84 132H50l-18 18v46M84 120H26M84 104H54L38 88V40'/>
 </g>
 <g stroke='${CORE_CYAN}' stroke-width='2.6' opacity='.42'>
  <path d='M0 120h26M214 120h26M120 0v38M120 210v30'/>
 </g>
 <rect x='84' y='84' width='72' height='72' rx='5' stroke='${CORE_CYAN}' stroke-width='1.6' opacity='.85'/>
 <rect x='96' y='96' width='48' height='48' rx='3' stroke='${CORE_VIOLET}' stroke-width='1' opacity='.6'/>
 <g stroke='${CORE_CYAN}' stroke-width='1.2' opacity='.55'>
  <path d='M96 84v-6M108 84v-6M120 84v-6M132 84v-6M144 84v-6'/>
  <path d='M96 156v6M108 156v6M120 156v6M132 156v6M144 156v6'/>
  <path d='M84 96h-6M84 108h-6M84 120h-6M84 132h-6M84 144h-6'/>
  <path d='M156 96h6M156 108h6M156 120h6M156 132h6M156 144h6'/>
 </g>
 <g fill='${CORE_CYAN}' stroke='none'>
  <circle cx='30' cy='34' r='3.4' opacity='.8'/><circle cx='14' cy='30' r='2.6' opacity='.6'/>
  <circle cx='174' cy='60' r='3.4' opacity='.8'/><circle cx='214' cy='120' r='3.4' opacity='.85'/>
  <circle cx='204' cy='150' r='2.6' opacity='.6'/><circle cx='200' cy='202' r='3.4' opacity='.75'/>
  <circle cx='120' cy='210' r='3.4' opacity='.85'/><circle cx='36' cy='198' r='3.4' opacity='.75'/>
  <circle cx='26' cy='120' r='3.4' opacity='.85'/><circle cx='38' cy='40' r='2.6' opacity='.6'/>
  <circle cx='192' cy='94' r='3' opacity='.7'/><circle cx='50' cy='132' r='2.6' opacity='.6'/>
 </g>
 <g fill='#07070B' stroke='none' opacity='.8'>
  <circle cx='30' cy='34' r='1.3'/><circle cx='174' cy='60' r='1.3'/><circle cx='214' cy='120' r='1.3'/>
  <circle cx='200' cy='202' r='1.3'/><circle cx='120' cy='210' r='1.3'/><circle cx='36' cy='198' r='1.3'/>
  <circle cx='26' cy='120' r='1.3'/>
 </g>
</g></svg>`;

const PCB_URL = `url("data:image/svg+xml,${encodeURIComponent(PCB_SVG)}")`;

/* As 12 arestas como elementos próprios. Depender do `border` das faces dá linha dupla
   em todo encontro de faces e nunca deixa a aresta mais brilhante que a face — e é esse
   contraste que faz vidro parecer vidro.
   `near`: 1 = aresta da frente, 0.4 = do fundo, -1 = corre em Z (usa gradiente). */
function cubeEdges(half: number): { t: string; near: number }[] {
  const e: { t: string; near: number }[] = [];
  for (const a of [-half, half])
    for (const z of [-half, half]) {
      const near = z > 0 ? 1 : 0.4;
      e.push({ t: `translate3d(0px, ${a}px, ${z}px)`, near });
      e.push({ t: `translate3d(${a}px, 0px, ${z}px) rotateZ(90deg)`, near });
    }
  for (const x of [-half, half]) for (const y of [-half, half]) e.push({ t: `translate3d(${x}px, ${y}px, 0px) rotateY(90deg)`, near: -1 });
  return e;
}

const KEYFRAMES = `
  @keyframes stackCorePulse { 0%,100% { opacity:.72; transform:scale(1) } 50% { opacity:1; transform:scale(1.13) } }
  @keyframes stackScan { 0% { transform: translateY(-120%) } 100% { transform: translateY(320%) } }
  @keyframes stackOrbitDots { to { stroke-dashoffset: -1000 } }
`;

interface StackHeroProps {
  dark?: boolean;
  lang?: Lang;
  config?: Partial<StackHeroConfig>;
  cards?: StackCard[];
  /** 0..1 fixa o progresso e ignora o scroll (usado pelo lab) */
  scrub?: number | null;
}

export function StackHero({ dark = true, lang = "pt", config, cards = STACK_CARDS, scrub = null }: StackHeroProps) {
  const cfg = { ...STACK_HERO_DEFAULTS, ...config };
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();

  /* já inicia com a medida real: começar em 0 escolheria o layout desktop no primeiro
     render e piscaria a coluna de texto no celular antes de corrigir */
  const [viewport] = useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));
  const isMobile = (size.w > 0 ? size.w : viewport) < 1024;
  const isStatic = !!reduced && !isMobile;

  /* Medimos a <section> (que nunca desmonta) e o palco separadamente. Um
     ResizeObserver registrado com deps [] fica preso no nó que o ref tinha no mount:
     se o ref passar a apontar para outro elemento, as medidas congelam. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      setSize({ w: el.clientWidth, h: window.innerHeight });
      const st = stageRef.current;
      if (st) setStage({ w: st.clientWidth, h: st.clientHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  /* Sem useSpring de propósito: em scroll-scrub a mola só adiciona latência — o scroll
     do usuário já é contínuo e o easeOut por card é que dá a suavidade. Medido: com
     mola o estado correto levava ~4s para assentar depois de um salto de scroll. */
  const progress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", v => {
    if (scrub == null && !isStatic) progress.set(v);
  });

  useEffect(() => {
    if (isStatic) progress.set(1);
    else if (scrub != null) progress.set(scrub);
  }, [scrub, isStatic, progress]);

  /* o card só passa a "ativo" quando já está visível (~50% da entrada), senão o glow
     de fundo troca antes de haver o que ver na tela */
  useMotionValueEvent(progress, "change", v => {
    const shifted = v - cfg.tDur * 0.5;
    const i = shifted < cfg.tStart ? -1 : Math.min(cards.length - 1, Math.floor((shifted - cfg.tStart) / cfg.tStep));
    setActive(i);
  });

  const accent = active >= 0 ? cards[active].color : CORE_VIOLET;

  /* geometria do palco */
  const base = Math.min(stage.w, stage.h);
  const cubePx = cfg.cubeSize * base;
  const cx = stage.w / 2;
  const cy = stage.h / 2;
  const rx = cfg.orbitRx * stage.w;
  const ry = cfg.orbitRy * stage.h;

  const opened = useTransform(progress, v => easeOut(clamp(v / 0.9)));
  const cubeScale = useTransform(opened, v => lerp(0.82, 1, v));
  const cubeSpin = useTransform(opened, v => lerp(cfg.rotY - 6, cfg.rotY, v));

  if (isMobile)
    return (
      <section id="stack" ref={sectionRef} className="relative" aria-label={lang === "pt" ? "Como eu construo" : "How I build"}>
        <style>{KEYFRAMES}</style>
        <MobileStack cards={cards} lang={lang} dark={dark} />
      </section>
    );

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative"
      style={{ height: isStatic ? "100vh" : `${cfg.pages * 100}vh` }}
      aria-label={lang === "pt" ? "Como eu construo" : "How I build"}
    >
      <style>{KEYFRAMES}</style>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* glow de fundo, seguindo a cor do card ativo */}
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-1000"
          style={{
            background: `radial-gradient(58% 58% at 68% 48%, ${rgba(accent, (dark ? 0.15 : 0.11) * cfg.bgGlow)} 0%, transparent 66%),
                         radial-gradient(80% 60% at 60% 108%, ${rgba(CORE_VIOLET, (dark ? 0.1 : 0.07) * cfg.bgGlow)} 0%, transparent 62%)`,
          }}
        />
        {/* grid de blueprint: malha fina + grossa, concentrada no palco */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${rgba(CORE_CYAN, dark ? 0.5 : 0.4)} 1px, transparent 1px),
                              linear-gradient(90deg, ${rgba(CORE_CYAN, dark ? 0.5 : 0.4)} 1px, transparent 1px),
                              linear-gradient(${rgba(CORE_VIOLET, dark ? 0.22 : 0.2)} 1px, transparent 1px),
                              linear-gradient(90deg, ${rgba(CORE_VIOLET, dark ? 0.22 : 0.2)} 1px, transparent 1px)`,
            backgroundSize: "144px 144px, 144px 144px, 36px 36px, 36px 36px",
            opacity: dark ? 0.075 : 0.13,
            maskImage: "radial-gradient(52% 60% at 68% 50%, #000 6%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(52% 60% at 68% 50%, #000 6%, transparent 100%)",
          }}
        />

        <div className="relative h-full max-w-7xl mx-auto px-6 grid items-center gap-8 lg:grid-cols-[minmax(0,33%)_minmax(0,1fr)]">
          <TextColumn lang={lang} dark={dark} />

          {/* palco: cubo ao centro, cards no anel */}
          <div ref={stageRef} className="relative h-full min-h-0">
            {stage.w > 0 && (
              <>
                <OrbitRing cx={cx} cy={cy} rx={rx} ry={ry} w={stage.w} h={stage.h} cards={cards} cfg={cfg} progress={progress} dark={dark} />

                <div className="absolute inset-0" style={{ perspective: `${cfg.perspective}px` }}>
                  <div
                    className="absolute"
                    style={{ left: cx, top: cy, transformStyle: "preserve-3d" }}
                  >
                    <CubePlatform size={cubePx} dark={dark} rimGlow={cfg.rimGlow} />
                    <motion.div style={{ rotateX: cfg.rotX, rotateY: cubeSpin, transformStyle: "preserve-3d" }}>
                      <CssCube size={cubePx} scale={cubeScale} dark={dark} rimGlow={cfg.rimGlow} />
                    </motion.div>
                  </div>
                </div>

                {cards.map((card, i) => (
                  <OrbitCard
                    key={card.id}
                    i={i}
                    card={card}
                    lang={lang}
                    dark={dark}
                    cfg={cfg}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    stageW={stage.w}
                    progress={progress}
                    isActive={active === i}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <StepDots count={cards.length} active={active} dark={dark} cards={cards} />

        {/* Lista semântica, sempre presente e só para leitor de tela: os nomes das
            techs são conteúdo de portfólio e não podem existir apenas dentro de
            elementos transformados em 3D, sem hierarquia. */}
        <ol className="sr-only">
          {cards.map(card => (
            <li key={card.id}>
              {card.label[lang]}: {card.items.map(it => it.name).join(", ")}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- coluna de texto */

function TextColumn({ lang, dark }: { lang: Lang; dark: boolean }) {
  const pt = lang === "pt";
  return (
    <div className="relative z-10 pointer-events-auto">
      <p className={`font-mono2 text-[11px] tracking-[0.24em] uppercase mb-5 ${dark ? "text-white/35" : "text-black/45"}`}>
        {pt ? "Como eu construo" : "How I build"}
      </p>

      {/* headline com gradiente por frase, como na referência */}
      <h2 className="font-display font-bold leading-[1.02] tracking-tight text-[clamp(2.1rem,3.7vw,3.4rem)]">
        <span className={dark ? "text-white" : "text-[#08080A]"}>{pt ? "Full stack," : "Full stack,"}</span>
        <span className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(92deg, ${CORE_VIOLET}, #7C3AED)` }}>
          {pt ? "do front-end" : "from the front-end"}
        </span>
        <span className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(92deg, ${CORE_CYAN}, #22D3EE)` }}>
          {pt ? "ao banco" : "to the"}
        </span>
        <span className="block bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(92deg, #34D399, #10B981)" }}>
          {pt ? "de dados." : "database."}
        </span>
      </h2>

      {/* filete com pontos */}
      <div className="flex items-center gap-2 mt-6 mb-6">
        <span className="h-[2px] w-16 rounded" style={{ background: `linear-gradient(90deg, ${CORE_VIOLET}, ${CORE_CYAN})` }} />
        <span className="w-1 h-1 rounded-full" style={{ background: rgba(CORE_CYAN, 0.8) }} />
        <span className="w-1 h-1 rounded-full" style={{ background: rgba(CORE_CYAN, 0.4) }} />
      </div>

      <p className={`font-body text-[15px] leading-relaxed max-w-sm ${dark ? "text-white/55" : "text-black/60"}`}>
        {pt
          ? "Desenvolvo aplicações completas, com foco em performance, escalabilidade e experiência de uso."
          : "I build complete applications, focused on performance, scalability and user experience."}
      </p>

      <ul className="mt-7 space-y-3">
        {FEATURES.map(f => {
          const Icon = f.icon;
          return (
            <li key={f.pt} className="flex items-center gap-3">
              <Icon size={15} className="shrink-0" style={{ color: CORE_CYAN }} aria-hidden />
              <span className={`font-body text-sm ${dark ? "text-white/70" : "text-black/70"}`}>{pt ? f.pt : f.en}</span>
            </li>
          );
        })}
      </ul>

      <a
        href="#projects"
        className={`inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl font-body text-sm font-medium border transition-colors duration-300 ${
          dark ? "border-white/15 text-white hover:bg-white/[0.07]" : "border-black/15 text-[#08080A] hover:bg-black/[0.05]"
        }`}
        style={{ boxShadow: `0 0 22px ${rgba(CORE_CYAN, dark ? 0.16 : 0.1)}` }}
      >
        {pt ? "Ver Projetos" : "View Projects"}
        <ArrowRight size={15} aria-hidden />
      </a>
    </div>
  );
}

/* ----------------------------------------------------------------- anel e HUD */

/* Anel pontilhado + linha de ligação do cubo até cada card. Em SVG porque a geometria
   é radial: em DOM daria uma pilha de divs rotacionados e com aliasing nas curvas. */
function OrbitRing({
  cx,
  cy,
  rx,
  ry,
  w,
  h,
  cards,
  cfg,
  progress,
  dark,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  w: number;
  h: number;
  cards: StackCard[];
  cfg: StackHeroConfig;
  progress: MotionValue<number>;
  dark: boolean;
}) {
  const ringOpacity = useTransform(progress, [0, 0.1], [0, 1]);
  return (
    <svg className="absolute inset-0 pointer-events-none" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <motion.g style={{ opacity: ringOpacity }}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={rgba(CORE_VIOLET, dark ? 0.3 : 0.35)}
          strokeWidth={1}
          strokeDasharray="2 9"
          style={{ animation: "stackOrbitDots 90s linear infinite" }}
        />
        <ellipse cx={cx} cy={cy} rx={rx * 0.72} ry={ry * 0.72} fill="none" stroke={rgba(CORE_CYAN, dark ? 0.1 : 0.16)} strokeWidth={1} strokeDasharray="1 12" />
      </motion.g>

      {cards.map((card, i) => (
        <Connector key={card.id} i={i} card={card} cfg={cfg} cx={cx} cy={cy} rx={rx} ry={ry} progress={progress} />
      ))}
    </svg>
  );
}

function Connector({
  i,
  card,
  cfg,
  cx,
  cy,
  rx,
  ry,
  progress,
}: {
  i: number;
  card: StackCard;
  cfg: StackHeroConfig;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  progress: MotionValue<number>;
}) {
  const start = cfg.tStart + i * cfg.tStep;
  const a = rad(card.angle);
  /* sai da superfície do cubo, não do centro dele */
  const x1 = cx + Math.cos(a) * rx * 0.3;
  const y1 = cy + Math.sin(a) * ry * 0.3;
  const x2 = cx + Math.cos(a) * rx;
  const y2 = cy + Math.sin(a) * ry;

  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));
  const dashOffset = useTransform(e, v => (1 - v) * 100);

  return (
    <motion.g style={{ opacity: e }}>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={rgba(card.color, 0.55)}
        strokeWidth={1.25}
        strokeDasharray="100"
        style={{ strokeDashoffset: dashOffset, pathLength: 1 }}
      />
      <circle cx={x2} cy={y2} r={3.5} fill={rgba(card.color, 0.95)} />
      <circle cx={x2} cy={y2} r={7} fill="none" stroke={rgba(card.color, 0.35)} strokeWidth={1} />
    </motion.g>
  );
}

/** indicador de etapas na borda direita, como na referência */
function StepDots({ count, active, dark, cards }: { count: number; active: number; dark: boolean; cards: StackCard[] }) {
  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          initial={false}
          animate={{
            width: i === active ? 8 : 6,
            height: i === active ? 8 : 6,
            backgroundColor: i <= active ? cards[i].color : dark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.18)",
            boxShadow: i === active ? `0 0 12px ${cards[i].color}` : "none",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- card do anel */

function OrbitCard({
  i,
  card,
  lang,
  dark,
  cfg,
  cx,
  cy,
  rx,
  ry,
  stageW,
  progress,
  isActive,
}: {
  i: number;
  card: StackCard;
  lang: Lang;
  dark: boolean;
  cfg: StackHeroConfig;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  stageW: number;
  progress: MotionValue<number>;
  isActive: boolean;
}) {
  const start = cfg.tStart + i * cfg.tStep;
  const c = card.color;
  const w = cfg.cardW * stageW;
  const a = rad(card.angle);

  /* posição no anel; ao aparecer, o card avança um pouco para FORA ao longo do próprio
     raio — leitura de "saiu do cubo" sem precisar atravessar a cena */
  const dirX = Math.cos(a);
  const dirY = Math.sin(a);
  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));

  const x = useTransform(e, v => cx + dirX * rx * lerp(1 - cfg.emerge, 1, v) - w / 2);
  const y = useTransform(e, v => cy + dirY * ry * lerp(1 - cfg.emerge, 1, v));
  const scale = useTransform(e, v => lerp(0.84, 1, v));
  const opacity = useTransform(e, [0, 0.45], [0, 1]);

  const Icon = card.icon;

  return (
    /* Dois níveis de propósito: o Motion controla o transform do externo (x/y/scale), e
       a centragem vertical fica no interno via classe. Pôr `translateY: "-50%"` junto de
       `y` no mesmo elemento faz os dois disputarem a mesma propriedade. */
    <motion.div className="absolute" style={{ left: 0, top: 0, x, y, scale, opacity, width: w, willChange: "transform, opacity" }}>
      <div
        className="relative rounded-2xl overflow-hidden -translate-y-1/2"
        style={{
          padding: w * 0.085,
          /* Contorno luminoso sobre corpo escuro, como na referência: aqui o card NÃO é
             preenchido com a cor — a cor vive na borda, no ícone, no título e no glow.
             Corpo quase opaco para o cubo não vazar através do texto. */
          border: `1.5px solid ${dark ? rgba(c, 0.75) : mix(c, 0.5, 0.8)}`,
          background: dark
            ? `radial-gradient(120% 120% at 50% 0%, ${rgba(c, 0.14)} 0%, transparent 62%),
               linear-gradient(160deg, rgba(16,18,26,.94) 0%, rgba(9,10,16,.97) 100%)`
            : `radial-gradient(120% 120% at 50% 0%, ${rgba(c, 0.2)} 0%, transparent 62%),
               linear-gradient(160deg, rgba(255,255,255,.97) 0%, rgba(248,248,252,.99) 100%)`,
          boxShadow: `0 0 ${w * 0.16}px ${rgba(c, 0.32 * cfg.rimGlow)},
                      0 ${w * 0.05}px ${w * 0.14}px rgba(0,0,0,${dark ? 0.5 : 0.12}),
                      inset 0 1px 0 ${rgba(c, dark ? 0.3 : 0.22)}`,
          opacity: isActive ? 1 : cfg.dimInactive,
          transition: "opacity .35s",
        }}
      >
        {/* grão: mata o banding do gradiente acima */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "120px 120px", opacity: dark ? 0.05 : 0.03 }}
        />

        <div className="relative flex items-center" style={{ gap: w * 0.055 }}>
          <span
            className="shrink-0 grid place-items-center rounded-lg"
            style={{
              width: w * 0.19,
              height: w * 0.19,
              border: `1px solid ${rgba(c, 0.4)}`,
              background: rgba(c, dark ? 0.12 : 0.16),
              boxShadow: `0 0 ${w * 0.06}px ${rgba(c, 0.35)}`,
            }}
          >
            <Icon size={w * 0.1} style={{ color: dark ? c : mix(c, 0.55) }} aria-hidden />
          </span>
          <span
            className="font-mono2 uppercase"
            style={{ fontSize: w * 0.058, letterSpacing: "0.16em", color: dark ? "rgba(255,255,255,.9)" : mix(c, 0.35) }}
          >
            {card.label[lang]}
          </span>
        </div>

        <ul className="relative" style={{ marginTop: w * 0.07, display: "grid", gap: w * 0.042 }}>
          {card.items.map(it => {
            const ItemIcon = it.icon;
            return (
              <li key={it.name} className="flex items-center" style={{ gap: w * 0.045 }}>
                <ItemIcon size={w * 0.055} className="shrink-0" style={{ color: dark ? c : mix(c, 0.5) }} aria-hidden />
                <span className="font-body" style={{ fontSize: w * 0.058, color: dark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.66)" }}>
                  {it.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------------- cubo e base */

/** plataforma sob o cubo, deitada no plano do piso — dá peso à cena */
function CubePlatform({ size: s, dark, rimGlow }: { size: number; dark: boolean; rimGlow: number }) {
  const w = s * 1.34;
  const d = s * 0.78;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: w,
        height: d,
        left: -w / 2,
        top: s * 0.5,
        transform: "rotateX(78deg)",
        transformOrigin: "50% 0%",
        borderRadius: "50%",
        /* sem `border`: uma borda num elemento girado 78° desenha um trapézio de contorno
           duro que lê como erro. O gradiente sozinho já dá a leitura de base iluminada. */
        background: `radial-gradient(ellipse at 50% 42%, ${rgba(CORE_CYAN, 0.22 * rimGlow)} 0%, ${rgba(CORE_VIOLET, 0.1 * rimGlow)} 42%, transparent 72%)`,
      }}
    />
  );
}

function CssCube({ size: s, scale, dark, rimGlow }: { size: number; scale: MotionValue<number>; dark: boolean; rimGlow: number }) {
  const half = s / 2;
  const core = s * 0.6;
  const coreHalf = core / 2;

  /* Brilho relativo por face. As faces vistas de raspão comprimem todo o range do
     Fresnel em poucos pixels de tela e lavam, por isso levam valor menor que a frontal. */
  const faces = [
    { t: `translateZ(${half}px)`, b: 1 },
    { t: `rotateY(180deg) translateZ(${half}px)`, b: 0.3 },
    { t: `rotateY(90deg) translateZ(${half}px)`, b: 0.42 },
    { t: `rotateY(-90deg) translateZ(${half}px)`, b: 0.46 },
    { t: `rotateX(90deg) translateZ(${half}px)`, b: 0.7 },
    { t: `rotateX(-90deg) translateZ(${half}px)`, b: 0.26 },
  ];
  const coreFaces = [
    `translateZ(${coreHalf}px)`,
    `rotateY(180deg) translateZ(${coreHalf}px)`,
    `rotateY(90deg) translateZ(${coreHalf}px)`,
    `rotateY(-90deg) translateZ(${coreHalf}px)`,
    `rotateX(90deg) translateZ(${coreHalf}px)`,
    `rotateX(-90deg) translateZ(${coreHalf}px)`,
  ];

  return (
    <motion.div className="absolute" style={{ width: s, height: s, left: -half, top: -half, scale, transformStyle: "preserve-3d" }}>
      {/* bloom externo — gradiente puro, sem filter: blur (que criaria uma camada de
          composição reescalada a cada frame e achataria o contexto 3D) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -s * 0.45,
          background: `radial-gradient(circle, ${rgba(CORE_CYAN, 0.2 * rimGlow)} 0%, ${rgba(CORE_CYAN, 0.1 * rimGlow)} 26%, ${rgba(CORE_VIOLET, 0.07 * rimGlow)} 48%, transparent 70%)`,
          transform: `translateZ(${-half - 2}px)`,
        }}
      />

      {/* núcleo de circuito */}
      <div className="absolute" style={{ width: core, height: core, left: (s - core) / 2, top: (s - core) / 2, transformStyle: "preserve-3d" }}>
        {coreFaces.map((t, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              /* rotateZ mantém a face no mesmo plano e rende 4 orientações aparentes de
                 uma textura só, para as 6 faces não ficarem clonadas */
              transform: `${t} rotateZ(${(i % 4) * 90}deg)`,
              backgroundImage: PCB_URL,
              backgroundSize: "100% 100%",
              opacity: i === 0 ? 1 : 0.34,
            }}
          />
        ))}
        <div
          className="absolute"
          style={{
            width: core * 0.26,
            height: core * 0.26,
            left: core * 0.37,
            top: core * 0.37,
            borderRadius: 6,
            /* sem filter: blur — o gradiente já entrega a borda suave, e um filter aqui
               gera uma camada de composição reescalada a cada frame do scroll */
            background: `radial-gradient(circle, #fff 0%, ${CORE_CYAN} 38%, ${rgba(CORE_VIOLET, 0.5)} 72%, transparent 100%)`,
            boxShadow: `0 0 ${core * 0.5}px ${rgba(CORE_CYAN, 0.85)}, 0 0 ${core}px ${rgba(CORE_VIOLET, 0.5)}`,
            animation: "stackCorePulse 3.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* faces de vidro: rim de Fresnel (vidro reflete no ângulo rasante, quase nada de
          frente — é isso que deixa o cubo claro SEM tapar o núcleo) + especular + frost.
          Sem `border` (as arestas são elementos próprios) e sem backdrop-filter, que em
          6 faces dentro de preserve-3d custa caro e deixa tudo turvo. */}
      {faces.map((f, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: f.t,
            /* frost baixo de propósito: na referência o cubo lê como wireframe luminoso
               com o circuito visível dentro, não como bloco leitoso. O Fresnel continua
               dando a borda clara, mas o miolo fica limpo. */
            background: dark
              ? `radial-gradient(112% 112% at 50% 50%, transparent 40%, rgba(255,255,255,${0.07 * f.b}) 78%, rgba(255,255,255,${0.18 * f.b}) 100%),
                 linear-gradient(133deg, rgba(255,255,255,${0.13 * f.b}) 0%, rgba(255,255,255,${0.02 * f.b}) 30%, transparent 55%),
                 linear-gradient(0deg, ${rgba(CORE_CYAN, 0.04 * f.b)}, ${rgba(CORE_VIOLET, 0.04 * f.b)}),
                 rgba(255,255,255,${0.022 * f.b})`
              : `radial-gradient(112% 112% at 50% 50%, transparent 34%, rgba(255,255,255,${0.55 * f.b}) 78%, rgba(255,255,255,${0.85 * f.b}) 100%),
                 linear-gradient(133deg, rgba(255,255,255,${0.62 * f.b}) 0%, rgba(255,255,255,${0.22 * f.b}) 34%, transparent 58%),
                 ${rgba(CORE_VIOLET, 0.07 * f.b)},
                 rgba(255,255,255,${0.3 * f.b})`,
            boxShadow: `inset 0 0 ${s * 0.3}px ${rgba(CORE_CYAN, 0.09 * f.b)}`,
          }}
        >
          {i === 0 && (
            <div
              className="absolute inset-x-0"
              style={{ height: "38%", background: `linear-gradient(180deg, transparent, ${rgba(CORE_CYAN, 0.1)}, transparent)`, animation: "stackScan 6.5s ease-in-out infinite" }}
            />
          )}
        </div>
      ))}

      {/* arestas — franja violeta→branco→ciano ao longo do comprimento, que é a leitura
          barata da aberração cromática da referência */}
      {cubeEdges(half).map((e, i) => (
        <div
          key={`e${i}`}
          className="absolute pointer-events-none"
          style={{
            width: s,
            height: EDGE,
            left: 0,
            top: (s - EDGE) / 2,
            transform: e.t,
            borderRadius: EDGE,
            /* no tema claro o miolo da aresta não pode ser branco (desaparece no fundo
               claro): usamos a própria cor escurecida, mantendo a franja */
            background:
              e.near < 0
                ? `linear-gradient(90deg, ${mix(CORE_VIOLET, dark ? 1 : 0.55, 0.85)} 0%, ${mix(CORE_CYAN, dark ? 1 : 0.55, 0.5)} 55%, ${mix(CORE_CYAN, dark ? 1 : 0.55, 0.22)} 100%)`
                : `linear-gradient(90deg, ${mix(CORE_VIOLET, dark ? 1 : 0.5, 0.9 * e.near)} 0%, ${
                    dark ? `rgba(255,255,255,${0.95 * e.near})` : mix(CORE_CYAN, 0.35, 0.9 * e.near)
                  } 46%, ${mix(CORE_CYAN, dark ? 1 : 0.5, 0.95 * e.near)} 100%)`,
            boxShadow: dark
              ? e.near < 0
                ? `0 0 4px ${rgba(CORE_CYAN, 0.35 * rimGlow)}`
                : `0 0 3px ${rgba(CORE_CYAN, 0.8 * e.near * rimGlow)}, 0 0 9px ${rgba(CORE_CYAN, 0.4 * e.near * rimGlow)}, 0 0 20px ${rgba(CORE_VIOLET, 0.28 * e.near * rimGlow)}`
              : undefined,
          }}
        />
      ))}
    </motion.div>
  );
}

/* --------------------------------------------------------------------- mobile */

/* Abaixo de 1024px o anel não cabe: o cubo mais 5 cards em volta exigem largura que
   não existe. Mesmo conteúdo, servido como lista vertical — e sem 3D, porque empilhar
   tantas camadas compostas em GPU de celular custa caro para o que entrega nesse
   tamanho. */
function MobileStack({ cards, lang, dark }: { cards: StackCard[]; lang: Lang; dark: boolean }) {
  const pt = lang === "pt";
  return (
    <div className="px-6 py-24 max-w-xl mx-auto">
      <p className={`font-mono2 text-[11px] tracking-[0.24em] uppercase mb-4 ${dark ? "text-white/35" : "text-black/45"}`}>
        {pt ? "Como eu construo" : "How I build"}
      </p>
      <h2 className="font-display font-bold leading-[1.06] tracking-tight text-[2rem] mb-5">
        <span className={dark ? "text-white" : "text-[#08080A]"}>Full stack,</span>
        <span className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(92deg, ${CORE_VIOLET}, ${CORE_CYAN}, #34D399)` }}>
          {pt ? "do front-end ao banco de dados." : "from the front-end to the database."}
        </span>
      </h2>
      <p className={`font-body text-[15px] leading-relaxed mb-10 ${dark ? "text-white/55" : "text-black/60"}`}>
        {pt
          ? "Desenvolvo aplicações completas, com foco em performance, escalabilidade e experiência de uso."
          : "I build complete applications, focused on performance, scalability and user experience."}
      </p>

      {/* o núcleo, achatado: mesma textura de PCB do cubo */}
      <div className="relative mx-auto mb-10" style={{ width: 148, height: 148 }}>
        <div
          className="absolute rounded-full"
          style={{ inset: -32, background: `radial-gradient(circle, ${rgba(CORE_CYAN, 0.18)} 0%, ${rgba(CORE_VIOLET, 0.08)} 45%, transparent 72%)` }}
        />
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            border: `1px solid ${rgba(CORE_CYAN, 0.45)}`,
            background: `${PCB_URL} center / 100% 100% no-repeat, rgba(255,255,255,${dark ? 0.05 : 0.4})`,
            boxShadow: `0 0 24px ${rgba(CORE_CYAN, 0.3)}, inset 0 0 30px ${rgba(CORE_VIOLET, 0.12)}`,
          }}
        >
          <div
            className="absolute rounded-sm"
            style={{
              width: 26,
              height: 26,
              left: "50%",
              top: "50%",
              marginLeft: -13,
              marginTop: -13,
              background: `radial-gradient(circle, #fff 0%, ${CORE_CYAN} 45%, ${rgba(CORE_VIOLET, 0.6)} 100%)`,
              boxShadow: `0 0 26px ${rgba(CORE_CYAN, 0.85)}`,
              animation: "stackCorePulse 3.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {cards.map(card => {
          const c = card.color;
          const Icon = card.icon;
          return (
            <li
              key={card.id}
              className="relative rounded-2xl overflow-hidden p-5"
              style={{
                border: `1.5px solid ${dark ? rgba(c, 0.7) : mix(c, 0.5, 0.8)}`,
                background: dark
                  ? `radial-gradient(120% 120% at 50% 0%, ${rgba(c, 0.14)} 0%, transparent 62%), linear-gradient(160deg, rgba(16,18,26,.94), rgba(9,10,16,.97))`
                  : `radial-gradient(120% 120% at 50% 0%, ${rgba(c, 0.2)} 0%, transparent 62%), linear-gradient(160deg, rgba(255,255,255,.97), rgba(248,248,252,.99))`,
                boxShadow: `0 0 20px ${rgba(c, 0.24)}, 0 10px 26px rgba(0,0,0,${dark ? 0.45 : 0.1}), inset 0 1px 0 ${rgba(c, dark ? 0.3 : 0.22)}`,
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: NOISE_URL, backgroundSize: "120px 120px", opacity: dark ? 0.05 : 0.03 }}
                aria-hidden
              />
              <div className="relative flex items-center gap-3">
                <span
                  className="shrink-0 grid place-items-center rounded-lg w-9 h-9"
                  style={{ border: `1px solid ${rgba(c, 0.4)}`, background: rgba(c, dark ? 0.12 : 0.16) }}
                >
                  <Icon size={17} style={{ color: dark ? c : mix(c, 0.55) }} aria-hidden />
                </span>
                <span className="font-mono2 text-[11px] uppercase tracking-[0.16em]" style={{ color: dark ? "rgba(255,255,255,.9)" : mix(c, 0.35) }}>
                  {card.label[lang]}
                </span>
              </div>
              <ul className="relative mt-4 grid gap-2">
                {card.items.map(it => {
                  const ItemIcon = it.icon;
                  return (
                    <li key={it.name} className="flex items-center gap-2.5">
                      <ItemIcon size={13} className="shrink-0" style={{ color: dark ? c : mix(c, 0.5) }} aria-hidden />
                      <span className="font-body text-sm" style={{ color: dark ? "rgba(255,255,255,.78)" : "rgba(0,0,0,.66)" }}>
                        {it.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <a
        href="#projects"
        className={`inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl font-body text-sm font-medium border ${
          dark ? "border-white/15 text-white" : "border-black/15 text-[#08080A]"
        }`}
      >
        {pt ? "Ver Projetos" : "View Projects"}
        <ArrowRight size={15} aria-hidden />
      </a>
    </div>
  );
}
