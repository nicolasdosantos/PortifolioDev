import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import { SiReact, SiSupabase } from "react-icons/si";
import type { Lang } from "../../types";

/* Cubo e painéis são DOM em 3D (perspective + preserve-3d), não imagens.
   O render do Gemini serviu só de referência visual; a imagem do cubo fica
   disponível em cubeMode: "image" para comparação. */
const CUBE_IMG = "/hero/cube.webp";
const CUBE_IMG_ASPECT = 1219 / 1377;

/** paleta fixa do cubo — não segue a cor da camada ativa */
const CORE_CYAN = "#67E8F9";
const CORE_VIOLET = "#A78BFA";

export interface StackLayer {
  id: string;
  kicker: { pt: string; en: string };
  tech: string;
  note: { pt: string; en: string };
  /** 3 itens curtos — preenchem o corpo do card, que antes era só espaço morto */
  bullets: { pt: string[]; en: string[] };
  color: string;
  icons: IconType[];
}

export const STACK_LAYERS: StackLayer[] = [
  {
    id: "react",
    kicker: { pt: "Front-end", en: "Front-end" },
    tech: "React",
    note: { pt: "Interfaces que as pessoas entendem", en: "Interfaces people actually understand" },
    bullets: {
      pt: ["Componentes reusáveis", "Estado previsível", "Acessibilidade"],
      en: ["Reusable components", "Predictable state", "Accessibility"],
    },
    color: "#67E8F9",
    icons: [SiReact],
  },
  {
    id: "java",
    kicker: { pt: "Back-end", en: "Back-end" },
    tech: "Java",
    note: { pt: "Regra de negócio no lugar certo", en: "Business logic where it belongs" },
    bullets: {
      pt: ["APIs REST", "Regras de negócio", "Testes automatizados"],
      en: ["REST APIs", "Business rules", "Automated tests"],
    },
    color: "#FFB454",
    icons: [FaJava],
  },
  {
    id: "data",
    kicker: { pt: "Dados", en: "Data" },
    tech: "MySQL + Supabase",
    note: { pt: "Dados modelados para durar", en: "Data modeled to last" },
    bullets: {
      pt: ["Modelagem relacional", "Consultas indexadas", "Auth e RLS"],
      en: ["Relational modeling", "Indexed queries", "Auth & RLS"],
    },
    color: "#34D399",
    /* só o símbolo do Supabase: o ícone do MySQL é um wordmark e em ~24px vira borrão
       ilegível — o "MySQL" já está no título da camada */
    icons: [SiSupabase],
  },
];

export interface StackHeroConfig {
  pages: number;
  perspective: number;
  rotY: number;
  rotYEnd: number;
  rotX: number;
  cubeMode: "css" | "image";
  cubeSize: number;
  cubeX: number;
  cubeY: number;
  cubeDriftX: number;
  cubeShrink: number;
  panelW: number;
  panelRatio: number;
  fanGap: number;
  fanX: number;
  fanY: number;
  fanZ: number;
  fanScale: number;
  thickness: number;
  radius: number;
  tStart: number;
  tStep: number;
  tDur: number;
  glassTint: number;
  glassBlur: number;
  rimGlow: number;
  bgGlow: number;
  dimInactive: number;
  labelMode: "panel" | "legend" | "both";
}

export const STACK_HERO_DEFAULTS: StackHeroConfig = {
  pages: 2.8,
  perspective: 1700,
  rotY: -17,
  rotYEnd: -23,
  rotX: 7,
  cubeMode: "css",
  cubeSize: 0.38,
  cubeX: 0.53,
  cubeY: 0.5,
  cubeDriftX: -0.07,
  cubeShrink: 0.82,
  panelW: 0.27,
  panelRatio: 0.95,
  fanGap: 0.32,
  fanX: 0.175,
  /* quase plano de propósito: a deriva anterior (-0.032) jogava o leque para o canto
     superior direito num diagonal solto, deixando o inferior direito vazio — era isso
     que fazia os elementos parecerem jogados em vez de compostos */
  fanY: -0.012,
  /* positivo = cada camada nova chega na frente da anterior */
  fanZ: 0.035,
  /* scaleEnd já cancela o aumento médio que a folga em Z causa, mas não o keystone:
     o painel é oblíquo (mundo girado em rotY) e longe do perspective-origin, então a
     borda mais próxima projeta maior. Sem isto a última camada fica ~30% maior que a
     primeira e encosta na borda da tela. */
  fanScale: 0.94,
  thickness: 7,
  radius: 16,
  /* tDur <= tStep: uma camada termina de entrar antes da próxima começar */
  tStart: 0.07,
  tStep: 0.27,
  tDur: 0.25,
  /* opacidade do corpo do card. Precisa ser alta: com ~0.85 os cards se atravessavam
     e o texto de uma camada aparecia dentro da seguinte. Cor forte pede corpo sólido —
     a leitura de vidro vem do bisel, do especular e do rim, não da transparência. */
  glassTint: 0.97,
  glassBlur: 7,
  rimGlow: 1,
  bgGlow: 0.55,
  /* com cor forte, 0.82 não distinguia nada — a camada ativa precisa saltar */
  dimInactive: 0.7,
  labelMode: "panel",
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/* Escurece (k<1) ou clareia (k>1) uma cor, devolvendo rgba. É com isto que o corpo
   do card é construído A PARTIR da cor da camada, em vez de branco + uma tinta fraca
   por cima: é a diferença entre um card que lê "ciano" de imediato e um card cinza. */
const mix = (hex: string, k: number, a = 1) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(k <= 1 ? v * k : Math.min(255, v + (255 - v) * (k - 1)));
  return `rgba(${ch((n >> 16) & 255)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)}, ${a})`;
};

/* As cores das camadas são claras de propósito, para brilhar no tema escuro — e por
   isso reprovam em contraste sobre fundo claro. Escurecemos só o TEXTO no tema claro;
   os grafismos (bordas, glow, trilhas) continuam na cor original. */
const readable = (hex: string, dark: boolean) => (dark ? hex : mix(hex, 0.55));

/* Grão fino. Gradiente largo em alfa baixo faz banding em tela de 8 bits, e são
   justamente essas faixas que leem como "gráfico de baixa qualidade". O ruído quebra
   a escada — é o mesmo recurso que o Aurora já usa no resto do site. */
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(#n)'/></svg>`,
)}")`;

/** espessura das arestas do cubo, em px */
const EDGE = 1.5;

/* Núcleo do cubo: placa de circuito de verdade em SVG — trilhas com dobras de 45°,
   barramentos, pads com via, die central e uma segunda camada em violeta.
   Vetor de propósito: a versão anterior usava repeating-linear-gradient, e um passo
   que não cai em pixel inteiro produz moiré/aliasing em tela não-retina. Como a cor
   do cubo agora é fixa, dá para embutir a paleta e pagar uma decodificação só. */
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

/* As 12 arestas como elementos próprios. Depender do `border` das faces dá linha
   dupla em todo encontro de faces e nunca deixa a aresta mais brilhante que a
   face — e é exatamente esse contraste que faz vidro parecer vidro.
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

/** Posição final de uma camada no mundo 3D. Compartilhado entre o painel e a sua
    trilha de conexão, para as duas não saírem de sincronia. */
function panelLayout(cfg: StackHeroConfig, base: number, i: number) {
  const w = cfg.panelW * base;
  /* metade da profundidade do cubo: nenhum painel pode terminar dentro dele */
  const cubeHalf = cfg.cubeSize * base * 0.5 * cfg.cubeShrink;
  const zEnd = cubeHalf + 10 + cfg.fanZ * base * i;
  /* o mundo está girado em rotY, então avançar em +Z também empurra o painel para a
     esquerda na tela — compensamos em X para que fanGap/fanX signifiquem de fato a
     separação horizontal aparente entre as camadas */
  const xEnd = base * (cfg.fanGap + cfg.fanX * i) - zEnd * Math.tan((cfg.rotYEnd * Math.PI) / 180);
  return {
    w,
    h: w * cfg.panelRatio,
    cubeHalf,
    zEnd,
    xEnd,
    yEnd: cfg.fanY * base * i,
    /* cancela o aumento aparente que a folga em Z causa, para panelW continuar
       significando a largura na tela; o fanZ por camada ainda cresce ~5%, que é o
       que dá a sensação de avanço */
    scaleEnd: cfg.fanScale ** i * ((cfg.perspective - zEnd) / cfg.perspective),
  };
}

const KEYFRAMES = `
  @keyframes stackCorePulse { 0%,100% { opacity:.7; transform:scale(1) } 50% { opacity:1; transform:scale(1.14) } }
  @keyframes stackOrbit { to { transform: rotateZ(360deg) } }
  @keyframes stackScan { 0% { transform: translateY(-120%) } 100% { transform: translateY(320%) } }
  @keyframes stackPulseTrace { 0% { left: 0%; opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { left: 100%; opacity: 0 } }
`;

interface StackHeroProps {
  dark?: boolean;
  lang?: Lang;
  config?: Partial<StackHeroConfig>;
  layers?: StackLayer[];
  /** 0..1 fixa o progresso e ignora o scroll (usado pelo lab) */
  scrub?: number | null;
}

export function StackHero({ dark = true, lang = "pt", config, layers = STACK_LAYERS, scrub = null }: StackHeroProps) {
  const cfg = { ...STACK_HERO_DEFAULTS, ...config };
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /* já inicia com a medida real: começar em 0 escolheria o layout desktop no
     primeiro render e piscaria a coluna de texto no celular antes de corrigir */
  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? { w: 0, h: 0 } : { w: window.innerWidth, h: window.innerHeight },
  );
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  /* mobile ganha um layout próprio (ver MobileStack), não o frame final congelado:
     em 390px o leque tem ~117px por painel e o palco cai debaixo da coluna de texto.
     `isStatic` fica só para reduced-motion no desktop, onde congelar em p=1 funciona. */
  const isMobile = size.w > 0 && size.w < 768;
  const isStatic = !!reduced && !isMobile;

  /* Medimos a <section>, não o palco. O palco só existe no layout desktop, e um
     ResizeObserver registrado com deps [] fica preso no nó que o ref tinha no mount:
     na troca desktop↔mobile o ref passa a apontar para outro elemento e as medidas
     congelam, então o breakpoint nunca voltaria. A seção nunca desmonta.
     A altura vem da viewport porque é ela que dimensiona o palco sticky (h-screen). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: window.innerHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  /* `progress` é só uma camada de indireção para o lab poder travar o valor via `scrub`.
     Sem useSpring de propósito: em scroll-scrub a mola só adiciona latência — o scroll
     do usuário já é contínuo e o easeOut por camada é que dá a suavidade. Medido: com
     mola o estado correto levava ~4s para assentar depois de um salto de scroll (e não
     era questão de tuning — nem ζ≈1 com stiffness 900 resolvia); direto, ~0.4s. */
  const progress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", v => {
    if (scrub == null && !isStatic) progress.set(v);
  });

  useEffect(() => {
    if (isStatic) progress.set(1);
    else if (scrub != null) progress.set(scrub);
  }, [scrub, isStatic, progress]);

  /* a camada só passa a "ativa" quando o painel já está visível (~45% da entrada),
     senão a nota e o glow trocam antes de haver o que ver na tela */
  useMotionValueEvent(progress, "change", v => {
    const shifted = v - cfg.tDur * 0.45;
    const i = shifted < cfg.tStart ? -1 : Math.min(layers.length - 1, Math.floor((shifted - cfg.tStart) / cfg.tStep));
    setActive(i);
  });

  const base = Math.min(size.w, size.h);
  const cubeSize = cfg.cubeSize * base;
  const opened = useTransform(progress, v => easeOut(clamp(v / 0.88)));
  const worldRotY = useTransform(opened, v => lerp(cfg.rotY, cfg.rotYEnd, v));
  const worldX = useTransform(opened, v => lerp(cfg.cubeX, cfg.cubeX + cfg.cubeDriftX, v) * size.w);
  const cubeScale = useTransform(opened, v => lerp(1, cfg.cubeShrink, v));

  const accent = active >= 0 ? layers[active].color : CORE_VIOLET;
  const showLegend = cfg.labelMode !== "panel";
  const showPanelText = cfg.labelMode !== "legend";

  /* Sem early return: a <section> é sempre a mesma (ver o ResizeObserver acima),
     só o conteúdo troca entre o palco 3D e a lista mobile. */
  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative"
      style={{ height: isMobile ? undefined : isStatic ? "100vh" : `${cfg.pages * 100}vh` }}
      aria-label={lang === "pt" ? "Minha stack, camada por camada" : "My stack, layer by layer"}
    >
      <style>{KEYFRAMES}</style>
      {isMobile ? (
        <MobileStack layers={layers} lang={lang} dark={dark} />
      ) : (
        <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-1000"
          style={{
            background: `radial-gradient(65% 55% at ${cfg.cubeX * 100}% 48%, ${rgba(accent, (dark ? 0.16 : 0.12) * cfg.bgGlow)} 0%, transparent 66%),
                         radial-gradient(90% 70% at ${cfg.cubeX * 100 - 8}% 100%, ${rgba(CORE_VIOLET, (dark ? 0.09 : 0.06) * cfg.bgGlow)} 0%, transparent 62%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            /* grid de blueprint: malha fina + malha grossa, como planta técnica.
               O mask acompanha cubeX — antes estava fixo em 55% e não batia com o
               cubo, que ainda deriva para a esquerda ao abrir. */
            backgroundImage: `linear-gradient(${rgba(CORE_CYAN, dark ? 0.5 : 0.4)} 1px, transparent 1px),
                              linear-gradient(90deg, ${rgba(CORE_CYAN, dark ? 0.5 : 0.4)} 1px, transparent 1px),
                              linear-gradient(${rgba(CORE_VIOLET, dark ? 0.22 : 0.2)} 1px, transparent 1px),
                              linear-gradient(90deg, ${rgba(CORE_VIOLET, dark ? 0.22 : 0.2)} 1px, transparent 1px)`,
            backgroundSize: "144px 144px, 144px 144px, 36px 36px, 36px 36px",
            opacity: dark ? 0.085 : 0.14,
            maskImage: `radial-gradient(46% 56% at ${(cfg.cubeX + cfg.cubeDriftX * 0.5) * 100}% 50%, #000 8%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(46% 56% at ${(cfg.cubeX + cfg.cubeDriftX * 0.5) * 100}% 50%, #000 8%, transparent 100%)`,
          }}
        />

        <div ref={stageRef} className="absolute inset-0" style={{ perspective: `${cfg.perspective}px` }}>
          {base > 0 && (
            <motion.div
              className="absolute"
              style={{
                left: 0,
                top: `${cfg.cubeY * 100}%`,
                x: worldX,
                rotateX: cfg.rotX,
                rotateY: worldRotY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Sombra de chão, deitada no plano do piso (rotateX 90°) e portanto
                  sujeita à mesma perspectiva da cena. Sem ela nada tem peso: cubo e
                  cards ficam colados num fundo preto, e é metade da razão pela qual a
                  composição parecia "solta". */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: base * 1.5,
                  height: base * 0.62,
                  left: -base * 0.22,
                  top: cubeSize * 0.5,
                  transform: "rotateX(90deg)",
                  transformOrigin: "50% 0%",
                  background: `radial-gradient(ellipse 42% 60% at 26% 6%, rgba(0,0,0,${dark ? 0.6 : 0.14}) 0%, transparent 70%),
                               radial-gradient(ellipse 58% 52% at 62% 4%, rgba(0,0,0,${dark ? 0.42 : 0.09}) 0%, transparent 72%)`,
                }}
              />

              {cfg.cubeMode === "css" ? (
                <CssCube size={cubeSize} scale={cubeScale} dark={dark} rimGlow={cfg.rimGlow} />
              ) : (
                <motion.img
                  src={CUBE_IMG}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute select-none"
                  style={{
                    width: cubeSize * 1.6,
                    left: -cubeSize * 0.8,
                    top: (-cubeSize * 1.6 * CUBE_IMG_ASPECT) / 2,
                    scale: cubeScale,
                    rotateY: -cfg.rotY,
                  }}
                />
              )}

              {layers.map((layer, i) => (
                <Trace key={`t${layer.id}`} i={i} layer={layer} cfg={cfg} base={base} progress={progress} />
              ))}

              {layers.map((layer, i) => (
                <Panel
                  key={layer.id}
                  i={i}
                  total={layers.length}
                  layer={layer}
                  lang={lang}
                  cfg={cfg}
                  base={base}
                  progress={progress}
                  isActive={active === i}
                  dark={dark}
                  showText={showPanelText}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* pointer-events-none só no wrapper, que cobre a tela toda; o bloco de texto
            volta a receber eventos, senão o h2 e as notas não são selecionáveis */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center pointer-events-none">
          <div className="max-w-sm pointer-events-auto">
            <p className={`font-mono2 text-xs tracking-[0.2em] uppercase mb-4 ${dark ? "text-white/30" : "text-black/45"}`}>
              {lang === "pt" ? "Como eu construo" : "How I build"}
            </p>
            <h2 className={`font-display text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-[1.06] tracking-tight mb-5 ${dark ? "text-white" : "text-[#08080A]"}`}>
              Full stack,
              <span className={dark ? "block text-white/35" : "block text-black/40"}>
                {lang === "pt" ? "camada por camada." : "layer by layer."}
              </span>
            </h2>

            <div className="relative h-12">
              {layers.map((layer, i) => (
                /* aria-hidden nas inativas: as três ficam no DOM só com opacity 0,
                   e sem isso o leitor de tela lê as três notas em sequência */
                <motion.p
                  key={layer.id}
                  className="font-body text-[15px] absolute inset-x-0 top-0"
                  aria-hidden={active !== i}
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 10 }}
                  /* as três notas ocupam o mesmo ponto, então todo cross-fade
                     sobrepõe duas frases; curto o bastante para não dar tempo de ler */
                  transition={{ duration: 0.25 }}
                  style={{ color: readable(layer.color, dark) }}
                >
                  {layer.note[lang]}
                </motion.p>
              ))}
            </div>

            {/* A lista existe SEMPRE. Com labelMode "panel" ela vai só para leitor
                de tela: os nomes das camadas são conteúdo de portfólio e não podem
                existir apenas dentro de spans transformados em 3D, sem hierarquia. */}
            <ol className={showLegend ? "space-y-2.5" : "sr-only"}>
              {layers.map((layer, i) => (
                <li key={layer.id} className={showLegend ? "flex items-center gap-3" : undefined}>
                  {showLegend && (
                    <motion.span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      animate={{
                        backgroundColor: active >= i ? layer.color : dark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.16)",
                        boxShadow: active === i ? `0 0 12px ${layer.color}` : "none",
                      }}
                      transition={{ duration: 0.35 }}
                    />
                  )}
                  <motion.span
                    className={showLegend ? "font-body text-sm" : undefined}
                    animate={showLegend ? { opacity: active >= i ? 1 : 0.3, color: active >= i ? layer.color : dark ? "#fff" : "#000" } : undefined}
                    transition={{ duration: 0.35 }}
                  >
                    {layer.kicker[lang]}: {layer.tech} — {layer.note[lang]}
                  </motion.span>
                </li>
              ))}
            </ol>
          </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ cubo */

function CssCube({ size: s, scale, dark, rimGlow }: { size: number; scale: MotionValue<number>; dark: boolean; rimGlow: number }) {
  const half = s / 2;
  const core = s * 0.6;
  const coreHalf = core / 2;

  /* Brilho relativo por face. Luz vindo de cima/esquerda, MAS as faces vistas de
     raspão (as laterais) comprimem todo o range do Fresnel em poucos pixels de
     tela e lavam — por isso levam valor menor que a frontal, senão viram um
     retângulo branco chapado competindo com o núcleo. */
  const faces = [
    { t: `translateZ(${half}px)`, b: 1 },
    { t: `rotateY(180deg) translateZ(${half}px)`, b: 0.3 },
    { t: `rotateY(90deg) translateZ(${half}px)`, b: 0.4 },
    { t: `rotateY(-90deg) translateZ(${half}px)`, b: 0.46 },
    { t: `rotateX(90deg) translateZ(${half}px)`, b: 0.66 },
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
      {/* bloom externo — gradiente puro, sem filter: blur (que criaria uma camada
          de composição reescalada a cada frame e achataria o contexto 3D) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -s * 0.45,
          background: `radial-gradient(circle, ${rgba(CORE_CYAN, 0.2 * rimGlow)} 0%, ${rgba(CORE_CYAN, 0.1 * rimGlow)} 26%, ${rgba(CORE_VIOLET, 0.07 * rimGlow)} 48%, transparent 70%)`,
          transform: `translateZ(${-half - 2}px)`,
        }}
      />

      {/* núcleo: circuito duotone + nós + bloom central */}
      <div
        className="absolute"
        style={{ width: core, height: core, left: (s - core) / 2, top: (s - core) / 2, transformStyle: "preserve-3d" }}
      >
        {coreFaces.map((t, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              /* rotateZ mantém a face no mesmo plano e rende 4 orientações
                 aparentes de uma textura só, para as 6 faces não ficarem clonadas */
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
            /* sem filter: blur — o gradiente já entrega a borda suave, e um filter
               aqui gera uma camada de composição reescalada a cada frame do scroll */
            background: `radial-gradient(circle, #fff 0%, ${CORE_CYAN} 38%, ${rgba(CORE_VIOLET, 0.5)} 72%, transparent 100%)`,
            boxShadow: `0 0 ${core * 0.5}px ${rgba(CORE_CYAN, 0.85)}, 0 0 ${core}px ${rgba(CORE_VIOLET, 0.5)}`,
            animation: "stackCorePulse 3.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* faces de vidro. Três camadas empilhadas, na ordem em que a luz age:
          1) rim de Fresnel — vidro reflete muito no ângulo rasante (perto da
             silhueta) e quase nada de frente. É isso que deixa o cubo claro
             SEM tapar o núcleo, e é o que a referência faz.
          2) especular — o brilho direcional vindo de cima/esquerda.
          3) tinta — leve dominante ciano do próprio vidro.
          Sem `border` (as arestas são elementos próprios) e sem backdrop-filter,
          que em 6 faces dentro de preserve-3d custa caro e deixa tudo turvo. */}
      {faces.map((f, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: f.t,
            background: dark
              ? `radial-gradient(112% 112% at 50% 50%, transparent 34%, rgba(255,255,255,${0.14 * f.b}) 76%, rgba(255,255,255,${0.3 * f.b}) 100%),
                 linear-gradient(133deg, rgba(255,255,255,${0.26 * f.b}) 0%, rgba(255,255,255,${0.05 * f.b}) 32%, transparent 58%),
                 linear-gradient(0deg, ${rgba(CORE_CYAN, 0.05 * f.b)}, ${rgba(CORE_VIOLET, 0.05 * f.b)}),
                 rgba(255,255,255,${0.075 * f.b})`
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
              style={{
                height: "38%",
                background: `linear-gradient(180deg, transparent, ${rgba(CORE_CYAN, 0.1)}, transparent)`,
                animation: "stackScan 6.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      ))}

      {/* arestas — franja violeta→ciano→branco ao longo do comprimento, que é a
          leitura barata da aberração cromática da referência */}
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
               claro): usamos a própria cor escurecida, mantendo a franja violeta→ciano */
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

      {/* Anéis em órbita. Dois planos com inclinações e sentidos diferentes, raios
          próximos ao cubo (o anel anterior tinha 1.5s e vazava muito além dele).
          Cada anel deixa um lado transparente, então o giro produz um arco que
          varre — o que dá movimento sem precisar cruzar a silhueta do cubo, coisa
          que o CSS 3D não faz (ele ordena elementos inteiros, não por pixel). */}
      {[
        { r: 1.32, rx: 74, spin: 22, rev: false, a: 0.5 },
        { r: 1.14, rx: 108, spin: 34, rev: true, a: 0.3 },
      ].map((o, i) => (
        <div
          key={`o${i}`}
          className="absolute pointer-events-none"
          style={{
            width: s * o.r,
            height: s * o.r,
            left: (s - s * o.r) / 2,
            top: (s - s * o.r) / 2,
            transform: `rotateX(${o.rx}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${rgba(CORE_CYAN, o.a * rimGlow)}`,
              borderRightColor: "transparent",
              borderTopColor: rgba(CORE_VIOLET, (o.a + 0.1) * rimGlow),
              boxShadow: `0 0 ${s * 0.06}px ${rgba(CORE_CYAN, 0.28 * rimGlow)}`,
              animation: `stackOrbit ${o.spin}s linear infinite${o.rev ? " reverse" : ""}`,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
}

/* --------------------------------------------------------------- mobile */

/* Em telas estreitas o leque 3D não cabe: com base ≈ 390px cada painel fica com
   ~117px e os títulos quebram em 3 linhas. Aqui o conteúdo é o mesmo, servido como
   lista vertical de verdade — e sem 3D, porque empilhar tantas camadas compostas
   em GPU de celular custa caro para o que entrega nesse tamanho. */
function MobileStack({ layers, lang, dark }: { layers: StackLayer[]; lang: Lang; dark: boolean }) {
  return (
    <div className="px-6 py-24 max-w-md mx-auto">
      <p className={`font-mono2 text-xs tracking-[0.2em] uppercase mb-4 ${dark ? "text-white/30" : "text-black/45"}`}>
        {lang === "pt" ? "Como eu construo" : "How I build"}
      </p>
      <h2 className={`font-display text-[2rem] font-bold leading-[1.08] tracking-tight mb-10 ${dark ? "text-white" : "text-[#08080A]"}`}>
        Full stack,
        <span className={dark ? "block text-white/35" : "block text-black/40"}>
          {lang === "pt" ? "camada por camada." : "layer by layer."}
        </span>
      </h2>

      {/* o núcleo, achatado: mesma textura de PCB do cubo */}
      <div className="relative mx-auto mb-10" style={{ width: 150, height: 150 }}>
        <div
          className="absolute rounded-full"
          style={{ inset: -34, background: `radial-gradient(circle, ${rgba(CORE_CYAN, 0.18)} 0%, ${rgba(CORE_VIOLET, 0.08)} 45%, transparent 72%)` }}
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
        {layers.map((layer, i) => {
          const c = layer.color;
          return (
            /* mesma linguagem do desktop: corpo feito a partir da cor, bisel duplo,
               grão e estrutura de datasheet */
            <li
              key={layer.id}
              className="relative rounded-2xl overflow-hidden p-5"
              style={{
                /* no tema claro a borda tem de ser ESCURA: a cor pura sobre um corpo da
               mesma cor clara é invisível */
            border: `1.5px solid ${dark ? rgba(c, 0.9) : mix(c, 0.42, 0.9)}`,
                background: dark
                  ? `radial-gradient(135% 130% at 50% 38%, transparent 42%, ${rgba(c, 0.12)} 84%, ${rgba(c, 0.28)} 100%),
                     linear-gradient(157deg, ${mix(c, 0.42, 0.96)} 0%, ${mix(c, 0.16, 0.92)} 48%, ${mix(c, 0.28, 0.95)} 100%)`
                  : `radial-gradient(135% 130% at 50% 38%, transparent 42%, rgba(255,255,255,.28) 84%, rgba(255,255,255,.5) 100%),
                     linear-gradient(157deg, ${mix(c, 1.2, 0.97)} 0%, ${mix(c, 1, 0.97)} 48%, ${mix(c, 1.14, 0.97)} 100%)`,
                boxShadow: `0 0 20px ${rgba(c, 0.28)}, 0 10px 26px rgba(0,0,0,${dark ? 0.45 : 0.12}),
                            inset 0 1.5px 0 ${rgba(c, dark ? 0.5 : 0.35)}, inset 0 -1.5px 0 rgba(0,0,0,${dark ? 0.34 : 0.08})`,
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: NOISE_URL, backgroundSize: "120px 120px", opacity: dark ? 0.05 : 0.035 }}
                aria-hidden
              />
              <div className="relative flex items-start justify-between">
                <p className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: dark ? "rgba(255,255,255,.72)" : mix(c, 0.2) }}>
                  {layer.kicker[lang]}
                </p>
                <span
                  className="font-mono2 text-[10px] shrink-0 px-2 py-1 rounded"
                  style={{ border: `1px solid ${dark ? rgba(c, 0.5) : mix(c, 0.4, 0.5)}`, background: rgba(c, dark ? 0.14 : 0.22), color: dark ? "#fff" : mix(c, 0.2) }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p
                className="font-display font-bold text-2xl leading-tight mt-2 relative"
                style={{ color: dark ? "#fff" : mix(c, 0.18), textShadow: dark ? `0 0 18px ${rgba(c, 0.55)}` : undefined }}
              >
                {layer.tech}
              </p>
              <span className="block mt-3" style={{ height: 1, background: `linear-gradient(90deg, ${rgba(c, 0.75)}, ${rgba(c, 0)})` }} />
              <p className="font-body text-sm relative mt-3" style={dark ? { color: "rgba(255,255,255,.78)" } : { color: mix(c, 0.3) }}>{layer.note[lang]}</p>
              <ul className="relative mt-3 grid gap-1.5">
                {layer.bullets[lang].map(b => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="shrink-0 w-1 h-1 rounded-full" style={{ background: rgba(c, 0.95), boxShadow: `0 0 6px ${rgba(c, 0.8)}` }} />
                    <span className="font-mono2 text-[11px]" style={{ color: dark ? "rgba(255,255,255,.8)" : mix(c, 0.28) }}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4 relative">
                {layer.icons.map((Icon, k) => (
                  <Icon key={k} size={16} style={{ color: dark ? "#fff" : mix(c, 0.22) }} />
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* --------------------------------------------------------------- trilha */

/* Liga a face direita do cubo à borda esquerda do painel, no plano Z daquele painel.
   Não é só decoração: é o que torna a metáfora legível — a camada saiu do núcleo.
   Vive no mundo 3D junto dos painéis, então herda a rotação e a perspectiva. */
function Trace({
  i,
  layer,
  cfg,
  base,
  progress,
}: {
  i: number;
  layer: StackLayer;
  cfg: StackHeroConfig;
  base: number;
  progress: MotionValue<number>;
}) {
  const { w, h, cubeHalf, zEnd, xEnd, yEnd } = panelLayout(cfg, base, i);
  const start = cfg.tStart + i * cfg.tStep;
  const from = cubeHalf;
  const len = Math.max(0, xEnd - w / 2 - from);
  const c = layer.color;
  /* Corre POR BAIXO dos cards, não dentro deles. As trilhas das camadas 2 e 3 estão
     num Z à frente das anteriores, então dentro do card elas passavam por cima do
     texto e sublinhavam os bullets. Embaixo, lê como cabeamento e não cruza nada. */
  const yTrace = yEnd + h * 0.6;

  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));
  /* a trilha se desenha a partir do cubo, chegando junto com o painel */
  const scaleX = useTransform(e, v => clamp(v / 0.7));
  const opacity = useTransform(e, [0, 0.15, 1], [0, 1, 1]);

  if (len <= 0) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: len, height: 1, left: from, top: -0.5, y: yTrace, z: zEnd, scaleX, opacity, transformOrigin: "left center" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${rgba(c, 0)} 0%, ${rgba(c, 0.45)} 22%, ${rgba(c, 0.85)} 100%)`,
          boxShadow: `0 0 6px ${rgba(c, 0.5)}`,
        }}
      />
      {/* pulso de dados percorrendo a trilha */}
      <div
        className="absolute rounded-full"
        style={{
          width: 4,
          height: 4,
          top: -1.5,
          background: "#fff",
          boxShadow: `0 0 8px ${rgba(c, 0.95)}, 0 0 16px ${rgba(c, 0.6)}`,
          animation: `stackPulseTrace ${3.2 + i * 0.7}s linear infinite`,
        }}
      />
      {/* pad de chegada, no painel */}
      <div
        className="absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          right: -2.5,
          top: -2,
          background: rgba(c, 0.95),
          boxShadow: `0 0 8px ${rgba(c, 0.8)}`,
        }}
      />
    </motion.div>
  );
}

/* ---------------------------------------------------------------- painel */

interface PanelProps {
  i: number;
  total: number;
  layer: StackLayer;
  lang: Lang;
  cfg: StackHeroConfig;
  base: number;
  progress: MotionValue<number>;
  isActive: boolean;
  dark: boolean;
  showText: boolean;
}

function Panel({ i, total, layer, lang, cfg, base, progress, isActive, dark, showText }: PanelProps) {
  const start = cfg.tStart + i * cfg.tStep;
  const c = layer.color;
  const { w, h, zEnd, xEnd, yEnd, scaleEnd: end } = panelLayout(cfg, base, i);

  /* Cada painel vive num plano Z fixo, o seu próprio (zEnd cresce com i), e se
     materializa perto do lugar final em vez de viajar do centro do cubo até lá.
     Motivo: isto é scroll-scrub, então QUALQUER frame intermediário fica parado sob
     o olho do usuário e precisa funcionar como composição. Uma viagem longa passa o
     painel por cima dos já abertos, e o frame congelado lê como bug, não como
     movimento. O deslocamento curto vindo de baixo-esquerda (a direção do cubo)
     mantém a leitura de "saiu do núcleo" sem nunca sobrepor nada. */
  const travel = base * 0.1;

  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));
  const x = useTransform(e, v => lerp(xEnd - travel, xEnd, v) - w / 2);
  const y = useTransform(e, v => lerp(yEnd + travel * 0.5, yEnd, v) - h / 2);
  const scale = useTransform(e, v => lerp(end * 0.84, end, v));
  const opacity = useTransform(progress, [start, start + cfg.tDur * 0.45], [0, 1]);
  const textOpacity = useTransform(e, [0.3, 0.8], [0, 1]);

  /** nomes longos precisam de corpo menor para não estourar o vidro */
  const techSize = w * Math.min(0.135, 1.25 / Math.max(5, layer.tech.length));

  return (
    <motion.div
      className="absolute"
      style={{ width: w, height: h, x, y, z: zEnd, scale, opacity, zIndex: i, transformStyle: "preserve-3d", willChange: "transform, opacity" }}
    >
      {/* Nada de `opacity` aqui para marcar a camada inativa: opacity deixa o card
          TRANSLÚCIDO e o texto de uma camada passa a aparecer dentro da seguinte.
          O apagamento é um véu opaco dentro da face frontal (ver o fim deste bloco). */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* placa de trás */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: cfg.radius,
            transform: `translateZ(${-cfg.thickness}px)`,
            border: `1px solid ${rgba(c, 0.3)}`,
            background: dark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.45)",
            boxShadow: `0 0 ${w * 0.09}px ${rgba(c, 0.22 * cfg.rimGlow)}`,
          }}
        />

        {/* As 4 faces laterais. Sem elas o painel é duas chapas soltas: com rotY
            em -23° a lateral fica visível, e é o bisel que faz ler como um bloco
            de vidro com espessura — como no panel.webp de referência. */}
        {[
          { w: cfg.thickness * 2, h: "100%", l: -cfg.thickness, t: 0, r: "rotateY(90deg)" },
          { w: cfg.thickness * 2, h: "100%", l: w - cfg.thickness, t: 0, r: "rotateY(90deg)" },
          { w: "100%", h: cfg.thickness * 2, l: 0, t: -cfg.thickness, r: "rotateX(90deg)" },
          { w: "100%", h: cfg.thickness * 2, l: 0, t: h - cfg.thickness, r: "rotateX(90deg)" },
        ].map((f, k) => (
          <div
            key={`s${k}`}
            className="absolute"
            style={{
              width: f.w,
              height: f.h,
              left: f.l,
              top: f.t,
              transform: f.r,
              background: `linear-gradient(${k < 2 ? 180 : 90}deg, ${rgba(c, 0.42)} 0%, rgba(255,255,255,.26) 45%, ${rgba(c, 0.26)} 100%)`,
              boxShadow: `0 0 ${w * 0.05}px ${rgba(c, 0.4 * cfg.rimGlow)}`,
            }}
          />
        ))}

        {/* Face frontal. O corpo é construído A PARTIR da cor da camada (mix escurece
            o próprio matiz), não de branco com uma tinta fraca em cima — é o que faz o
            card ler "ciano/âmbar/verde" de imediato em vez de cinza fosco. Fica um
            resto de translucidez (alfa < 1) + blur para o cubo ainda aparecer atrás. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: cfg.radius,
            transform: `translateZ(${cfg.thickness}px)`,
            /* no tema claro a borda tem de ser ESCURA: a cor pura sobre um corpo da
               mesma cor clara é invisível */
            border: `1.5px solid ${dark ? rgba(c, 0.9) : mix(c, 0.42, 0.9)}`,
            background: dark
              ? `radial-gradient(135% 130% at 50% 38%, transparent 42%, ${rgba(c, 0.12)} 84%, ${rgba(c, 0.28)} 100%),
                 linear-gradient(157deg, ${mix(c, 0.4, cfg.glassTint)} 0%, ${mix(c, 0.15, cfg.glassTint)} 48%, ${mix(c, 0.26, cfg.glassTint)} 100%)`
              : /* No tema claro NÃO se clareia: estas cores já são claras, então clarear
                   mais dá pastel quase-branco. O corpo fica na própria cor, levemente
                   clareada, e o contraste vem do texto escuro. */
                `radial-gradient(135% 130% at 50% 38%, transparent 42%, rgba(255,255,255,.28) 84%, rgba(255,255,255,.5) 100%),
                 linear-gradient(157deg, ${mix(c, 1.2, cfg.glassTint)} 0%, ${mix(c, 1, cfg.glassTint)} 48%, ${mix(c, 1.14, cfg.glassTint)} 100%)`,
            /* bisel duplo: linha clara no topo, escura na base, mais o glow externo e
               uma sombra projetada que dá PESO ao card (antes nada tinha peso) */
            boxShadow: `0 0 ${w * 0.12}px ${rgba(c, 0.45 * cfg.rimGlow)},
                        0 ${w * 0.05}px ${w * 0.14}px rgba(0,0,0,${dark ? 0.5 : 0.16}),
                        inset 0 1.5px 0 ${rgba(c, dark ? 0.5 : 0.35)},
                        inset 0 -1.5px 0 rgba(0,0,0,${dark ? 0.34 : 0.08}),
                        inset 0 0 ${w * 0.34}px ${rgba(c, 0.1)}`,
            backdropFilter: `blur(${cfg.glassBlur}px) saturate(1.2)`,
          }}
        >
          {/* especular: uma faixa estreita e nítida, não um degradê largo — reflexo de
              vidro tem borda definida, e é isso que lê como superfície polida */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(104deg, rgba(255,255,255,${dark ? 0.16 : 0.5}) 0%, rgba(255,255,255,${dark ? 0.05 : 0.2}) 13%, transparent 15%, transparent 46%, rgba(255,255,255,${dark ? 0.05 : 0.16}) 52%, transparent 56%)`,
            }}
          />
          {/* grão: mata o banding dos gradientes acima */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "120px 120px", opacity: dark ? 0.05 : 0.035 }}
          />

          {showText && (
            /* Estrutura de datasheet: cabeçalho / título / especificações / rodapé,
               separados por filetes de verdade. Antes eram só título no topo e rodapé
               embaixo, com o miolo vazio — e vazio lê como inacabado. */
            <motion.div className="absolute inset-0 flex flex-col" style={{ opacity: textOpacity, padding: w * 0.085 }} aria-hidden>
              {/* Tudo que importa mora na faixa ESQUERDA do card: cada painel tem a
                  sua direita coberta pelo próximo do leque, e informação ali sai
                  cortada (era o que acontecia com o chip do número). */}
              <div className="flex items-center" style={{ gap: w * 0.038 }}>
                <span
                  className="font-mono2 shrink-0"
                  style={{
                    fontSize: w * 0.044,
                    lineHeight: 1,
                    padding: `${w * 0.018}px ${w * 0.028}px`,
                    borderRadius: w * 0.02,
                    border: `1px solid ${rgba(c, 0.55)}`,
                    background: rgba(c, dark ? 0.16 : 0.2),
                    color: dark ? "#fff" : mix(c, 0.2),
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-mono2 uppercase"
                  style={{ fontSize: w * 0.048, letterSpacing: "0.2em", color: dark ? "rgba(255,255,255,.72)" : mix(c, 0.24) }}
                >
                  {layer.kicker[lang]}
                </span>
              </div>

              <span
                className="font-display font-bold"
                style={{
                  fontSize: techSize,
                  lineHeight: 1.02,
                  marginTop: w * 0.05,
                  color: dark ? "#fff" : mix(c, 0.18),
                  textShadow: dark ? `0 0 ${w * 0.09}px ${rgba(c, 0.65)}` : undefined,
                }}
              >
                {layer.tech}
              </span>

              <span style={{ marginTop: w * 0.055, height: 1, background: `linear-gradient(90deg, ${rgba(c, 0.75)}, ${rgba(c, 0)})` }} />

              <ul style={{ marginTop: w * 0.055, display: "grid", gap: w * 0.038 }}>
                {layer.bullets[lang].map(b => (
                  <li key={b} className="flex items-center" style={{ gap: w * 0.035 }}>
                    <span
                      className="shrink-0"
                      style={{ width: w * 0.022, height: w * 0.022, borderRadius: 99, background: rgba(c, 0.95), boxShadow: `0 0 ${w * 0.03}px ${rgba(c, 0.8)}` }}
                    />
                    <span
                      className="font-mono2"
                      style={{ fontSize: w * 0.047, lineHeight: 1.25, color: dark ? "rgba(255,255,255,.82)" : mix(c, 0.3) }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              <span style={{ marginTop: "auto", height: 1, background: rgba(c, dark ? 0.22 : 0.3) }} />
              {/* ícones à esquerda pelo mesmo motivo do cabeçalho; o "camada 01/03" saiu
                  porque o número já está no cabeçalho e era redundante */}
              <div className="flex items-center" style={{ marginTop: w * 0.045, gap: w * 0.045 }}>
                {layer.icons.map((Icon, k) => (
                  <Icon key={k} size={w * 0.095} style={{ color: dark ? "#fff" : mix(c, 0.22) }} />
                ))}
                <span
                  className="font-mono2 uppercase"
                  style={{ fontSize: w * 0.042, letterSpacing: "0.14em", color: dark ? "rgba(255,255,255,.42)" : mix(c, 0.38) }}
                >
                  {String(i + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          )}

          {/* véu de apagamento da camada inativa: opaco, então escurece sem revelar
              o que está atrás. Fica por último para cobrir o conteúdo também. */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: dark ? "#05060A" : "#DCDCE4" }}
            initial={false}
            animate={{ opacity: isActive ? 0 : 1 - cfg.dimInactive }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
