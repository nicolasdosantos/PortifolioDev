import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { ComponentType, CSSProperties } from "react";
import { ArrowRight, ChevronRight, Database, Github, Linkedin, Mail, Monitor, Rocket, Server, ShieldCheck } from "lucide-react";
import type { Lang, SkillItem } from "../../types";
import { certificates, skillCategories } from "../../data";

/* react-icons e lucide-react têm tipos diferentes mas a mesma superfície útil aqui —
   este alias deixa as duas famílias conviverem na mesma lista de techs. */
type AnyIcon = ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;

/* Cubo, plataforma e cards são DOM (perspective + preserve-3d) e SVG, não imagens.
   O render de referência (public/hero/image.png) definiu layout e estilo; o conteúdo
   vem do stack declarado em data/skills.ts, não do mockup. */

/* Paleta fixa do cubo — não segue a cor do card ativo.
   CORE_BLUE entrou porque na referência o cubo lê claramente AZUL: as faces têm dominante
   azul-royal e só as arestas puxam para o ciano. Sem esse azul, com ciano+violeta apenas,
   o cubo saía cinza-esverdeado e sem a luminosidade do render. */
const CORE_CYAN = "#67E8F9";
const CORE_VIOLET = "#A78BFA";
const CORE_BLUE = "#4C7DF7";

export interface StackCard {
  id: string;
  label: { pt: string; en: string };
  /** techs da categoria, com nível e descrição reais */
  items: SkillItem[];
  color: string;
  icon: AnyIcon;
  /** posição no anel, em graus: 0 = direita, negativo = acima */
  angle: number;
  /* Raio próprio, como multiplicador do raio base. Na referência os cards NÃO estão
     todos à mesma distância: medido do centro do cubo, variam de 265px (topo) a 477px
     (esquerda). É essa irregularidade que faz o conjunto ler como órbita e não como
     roda dentada. */
  radius: number;
  /** escala própria — uns cards mais perto da câmera, outros mais longe */
  depth: number;
}

/* Posição na órbita e cor por categoria. As cores vêm da referência (public/hero/image.png),
   não das cores de `skillCategories`, que são outra paleta. */
const ORBIT: Record<string, { color: string; angle: number; radius: number; depth: number; short: { pt: string; en: string } }> = {
  /* topo. Raio menor: na referência a folga vertical é apertada (23px) e a generosa é a
     horizontal — é essa elipse achatada que dá a leitura de órbita. */
  frontend: { color: "#67E8F9", angle: -90, radius: 0.86, depth: 0.95, short: { pt: "Front-end", en: "Front-end" } },
  backend: { color: "#FFB454", angle: -18, radius: 1.06, depth: 1.05, short: { pt: "Back-end", en: "Back-end" } },
  database: { color: "#34D399", angle: 46, radius: 1, depth: 1.08, short: { pt: "Dados", en: "Data" } },
  tools: { color: "#A78BFA", angle: 132, radius: 0.92, depth: 1, short: { pt: "Ferramentas", en: "Tooling" } },
  /* "Inteligência Artificial" de skillCategories quebra em duas linhas no card */
  ai: { color: "#F0ABFC", angle: -168, radius: 1.08, depth: 0.93, short: { pt: "IA", en: "AI" } },
};

/* Derivado de data/skills.ts em vez de reescrito à mão: nome, nível, descrição e ícone
   de cada tech já vivem lá, e duplicar isso garantiria que as duas listas divergissem na
   primeira vez que você editasse uma. Aqui só acrescentamos a geometria da órbita. */
export const STACK_CARDS: StackCard[] = skillCategories
  .filter(c => ORBIT[c.id])
  .map(c => ({
    id: c.id,
    label: ORBIT[c.id].short,
    items: c.skills,
    icon: c.icon as AnyIcon,
    ...ORBIT[c.id],
  }));

/* Faixa que o navbar (fixed, z-index 50) ocupa no topo. O card aberto não pode entrar
   aqui, senão o menu passa por cima dele. */
const NAV_SAFE = 96;

/** quantas techs o card mostra fechado — o resto aparece ao expandir */
const COLLAPSED_ITEMS = 4;

/* Números da coluna esquerda. Contagens derivadas dos dados reais, para não descolarem
   do resto do site: techs = soma das skills das categorias, certificados = certificates. */
const TECH_COUNT = skillCategories.reduce((n, c) => n + c.skills.length, 0);

const STATS: { value: string; pt: string; en: string; color: string }[] = [
  { value: `${TECH_COUNT}`, pt: "Tecnologias", en: "Technologies", color: "#67E8F9" },
  { value: `${skillCategories.length}`, pt: "Frentes da stack", en: "Stack areas", color: "#A78BFA" },
  { value: `${certificates.length}`, pt: "Certificados", en: "Certificates", color: "#34D399" },
  { value: "3+", pt: "Anos estudando", en: "Years studying", color: "#FFB454" },
];

const SOCIALS = [
  { Icon: Github, href: "https://github.com/nicolasdosantos", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:nicolaspichiteli245@gmail.com", label: "E-mail" },
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
  /* Tamanho do cubo em fração da LARGURA do palco, não da menor dimensão. Amarrar ao
     min(w,h) fazia o cubo crescer junto com o raio quando o palco alargava, e a razão
     cubo/órbita — que é o que produz a sensação de distância — ficava travada. */
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
  /* Medido na referência: cubo_meio/raioX = 0.373 e a folga borda-do-cubo →
     borda-do-card é 1.0× o meio-cubo. Na versão anterior essa razão era 0.466 e a folga
     0.55× — daí a impressão de que os cards eram parte do cubo. Aqui o cubo ocupa 0.27
     da largura do palco contra um raio de 0.365, o que dá folga ~1.3× (mais generosa
     que a própria referência, que é o pedido). */
  cubeSize: 0.27,
  orbitRx: 0.365,
  /* A referência é uma elipse bem achatada: raio horizontal ~456px contra vertical
     ~275px (1.65×). É esse achatamento que faz o conjunto orbitar em vez de formar um
     círculo rígido. O valor é limitado em runtime para o card do topo não ser cortado. */
  orbitRy: 0.4,
  cardW: 0.165,
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
}

export function StackHero({ dark = true, lang = "pt", config, cards = STACK_CARDS }: StackHeroProps) {
  const cfg = { ...STACK_HERO_DEFAULTS, ...config };
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** trilho de scroll: carrega a altura e é o alvo do useScroll (ver o return) */
  const trackRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(-1);
  /** card expandido pelo clique — só um por vez, para não empilhar cards abertos */
  const [openId, setOpenId] = useState<string | null>(null);
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

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  /* Sem useSpring de propósito: em scroll-scrub a mola só adiciona latência — o scroll
     do usuário já é contínuo e o easeOut por card é que dá a suavidade. Medido: com
     mola o estado correto levava ~4s para assentar depois de um salto de scroll. */
  const progress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", v => {
    if (!isStatic) progress.set(v);
  });

  useEffect(() => {
    if (isStatic) progress.set(1);
  }, [isStatic, progress]);

  /* o card só passa a "ativo" quando já está visível (~50% da entrada), senão o glow
     de fundo troca antes de haver o que ver na tela */
  useMotionValueEvent(progress, "change", v => {
    const shifted = v - cfg.tDur * 0.5;
    const i = shifted < cfg.tStart ? -1 : Math.min(cards.length - 1, Math.floor((shifted - cfg.tStart) / cfg.tStep));
    setActive(i);
  });

  const accent = active >= 0 ? cards[active].color : CORE_VIOLET;

  /* Geometria do palco.
     O cubo deriva da LARGURA (ver cubeSize), com um teto pela altura para não estourar
     em viewport baixa e larga. */
  const cubePx = Math.min(cfg.cubeSize * stage.w, stage.h * 0.42);
  const cubeHalf = cubePx / 2;
  const cx = stage.w / 2;
  const cy = stage.h / 2;

  /* O raio horizontal é limitado pela largura útil: o card mais externo (radius 1.08)
     mais metade da sua largura tem de caber no palco. Sem esse teto, aumentar o raio
     jogava o card da esquerda fora da tela em vez de afastá-lo. */
  const cardPx = cfg.cardW * stage.w;
  const rMax = Math.max(...cards.map(c => c.radius));
  const rx = Math.min(cfg.orbitRx * stage.w, (cx - cardPx / 2 - 12) / rMax);
  /* O raio vertical é limitado pelo card que mais se afasta na vertical, em CIMA e
     EMBAIXO. Antes o teto olhava só o menor raio (o card do topo) e os de baixo podiam
     ser cortados em viewport mais baixa. `cardH` é estimado pelo item mais longo, já que
     a altura real é definida pelo conteúdo. */
  const cardH = cardPx * 0.78;
  const vReach = Math.max(...cards.map(c => Math.abs(Math.sin(rad(c.angle))) * c.radius)) || 1;
  const ry = Math.min(cfg.orbitRy * stage.h, (cy - cardH / 2 - 14) / vReach);

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
    /* A <section> é só a âncora e não tem altura própria. A altura de scroll vive no
       TRILHO abaixo, e o useScroll observa o trilho — não a seção. Motivo: com a altura
       no <section>, o sticky consumia apenas 100vh no fluxo e o irmão seguinte (a faixa
       do processo) se posicionava a 100vh do início, aparecendo no MEIO da animação em
       vez de no fim. Separando os dois, a faixa cai naturalmente depois do trilho. */
    <section id="stack" ref={sectionRef} className="relative" aria-label={lang === "pt" ? "Como eu construo" : "How I build"}>
      <style>{KEYFRAMES}</style>
      <div ref={trackRef} className="relative" style={{ height: isStatic ? "100vh" : `${cfg.pages * 100}vh` }}>
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

        {/* Container mais largo que o max-w-7xl do resto do site, de propósito: na
            referência o palco ocupa ~71% da largura da viewport, e com 1280px de teto
            ele ficava em 52% — não havia espaço físico para os cards se afastarem do
            cubo sem sair da tela. A coluna de texto também encolheu (33% → 26%) e o gap
            dobrou, que é o espaço negativo que faltava entre texto, cubo e cards. */}
        <div className="relative h-full max-w-[1560px] mx-auto px-6 grid items-center gap-12 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">
          <TextColumn lang={lang} dark={dark} />

          {/* palco: cubo ao centro, cards no anel */}
          <div ref={stageRef} className="relative h-full min-h-0">
            {stage.w > 0 && (
              <>
                <OrbitRing
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  w={stage.w}
                  h={stage.h}
                  cards={cards}
                  cfg={cfg}
                  cubeHalf={cubeHalf}
                  cardPx={cardPx}
                  progress={progress}
                  dark={dark}
                />

                <div className="absolute inset-0" style={{ perspective: `${cfg.perspective}px` }}>
                  <div
                    className="absolute"
                    style={{ left: cx, top: cy, transformStyle: "preserve-3d" }}
                  >
                    <CubePlatform size={cubePx} rimGlow={cfg.rimGlow} />
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
                    stageH={stage.h}
                    progress={progress}
                    isActive={active === i}
                    isOpen={openId === card.id}
                    onToggle={() => setOpenId(id => (id === card.id ? null : card.id))}
                  />
                ))}
              </>
            )}
          </div>
        </div>

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

      {/* Headline. As três linhas coloridas ficam num ÚNICO span com bg-clip-text para o
          gradiente atravessar a frase inteira e poder varrer — com um span por linha, cada
          um teria seu próprio background e a varredura reiniciaria em cada linha.
          `text-shimmer` é a mesma classe que anima o seu nome na Hero (GlobalStyles). */}
      <h2 className="font-display font-bold leading-[1.02] tracking-tight text-[clamp(2.1rem,3.7vw,3.4rem)]">
        <span className={dark ? "text-white" : "text-[#08080A]"}>Full stack,</span>
        <span
          className="block bg-clip-text text-transparent text-shimmer"
          style={{ backgroundImage: `linear-gradient(100deg, ${CORE_VIOLET} 0%, #C4B5FD 22%, ${CORE_CYAN} 52%, #34D399 82%, ${CORE_VIOLET} 100%)` }}
        >
          {pt ? (
            <>
              do front-end
              <br />
              ao banco
              <br />
              de dados.
            </>
          ) : (
            <>
              from the front-end
              <br />
              to the
              <br />
              database.
            </>
          )}
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

      <motion.a
        href="#projetos"
        className={`inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl font-body text-sm font-medium border ${
          dark ? "border-white/15 text-white" : "border-black/15 text-[#08080A]"
        }`}
        style={{ boxShadow: `0 0 22px ${rgba(CORE_CYAN, dark ? 0.16 : 0.1)}` }}
        whileHover={{ y: -2, boxShadow: `0 0 34px ${rgba(CORE_CYAN, dark ? 0.3 : 0.18)}` }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
      >
        {pt ? "Ver Projetos" : "View Projects"}
        <ArrowRight size={15} aria-hidden />
      </motion.a>

      {/* Números e sociais: existiam na referência e eu havia omitido. Os valores vêm dos
          mesmos dados do Stats.tsx (e certificates.length), não dos números do mockup
          (4+/10+/20+/100%), que não correspondem ao projeto. */}
      <div className="grid grid-cols-2 gap-2.5 mt-9">
        {STATS.map(s => (
          <div
            key={s.pt}
            className="rounded-xl px-3 py-2.5"
            style={{
              border: `1px solid ${dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.09)"}`,
              background: dark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.6)",
            }}
          >
            <p className="font-display font-bold text-lg leading-none" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className={`font-mono2 text-[10px] leading-tight mt-1.5 ${dark ? "text-white/45" : "text-black/50"}`}>{pt ? s.pt : s.en}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-6">
        {SOCIALS.map(({ Icon, href, label }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer noopener"
            aria-label={label}
            className={`grid place-items-center w-9 h-9 rounded-lg border ${dark ? "border-white/10 text-white/55" : "border-black/10 text-black/55"}`}
            whileHover={{ y: -2, color: CORE_CYAN, borderColor: rgba(CORE_CYAN, 0.5) }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
          >
            <Icon size={15} aria-hidden />
          </motion.a>
        ))}
      </div>
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
  cubeHalf,
  cardPx,
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
  cubeHalf: number;
  cardPx: number;
  progress: MotionValue<number>;
  dark: boolean;
}) {
  const ringOpacity = useTransform(progress, [0, 0.1], [0, 1]);
  /* id estável e único: os <path> em <defs> são referenciados por href, e dois palcos na
     mesma página (ex.: o lab) colidiriam com um id fixo */
  const trackId = useId().replace(/:/g, "");
  return (
    <svg className="absolute inset-0 pointer-events-none" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {/* Três elipses em vez de uma: os cards têm raios diferentes, então uma órbita só
          não passaria por todos e leria como erro de alinhamento. Os raios acompanham o
          intervalo real dos cards (0.86 a 1.08), e a visibilidade subiu porque antes o
          anel praticamente não era percebido — é ele que cria a sensação de movimento. */}
      <motion.g style={{ opacity: ringOpacity }}>
        {ORBIT_TRACKS.map(o => (
          <ellipse
            key={o.k}
            cx={cx}
            cy={cy}
            rx={rx * o.k}
            ry={ry * o.k}
            fill="none"
            stroke={rgba(CORE_VIOLET, (dark ? o.a : o.a + 0.1) * 1)}
            strokeWidth={1}
            strokeDasharray={o.dash}
            style={{ animation: `stackOrbitDots ${70 + o.k * 40}s linear infinite` }}
          />
        ))}
        <ellipse cx={cx} cy={cy} rx={rx * 0.58} ry={ry * 0.58} fill="none" stroke={rgba(CORE_CYAN, dark ? 0.16 : 0.22)} strokeWidth={1} strokeDasharray="1 13" />
      </motion.g>

      {/* Satélites: pontos percorrendo as elipses de verdade, via animateMotion sobre um
          <path>. É o que faz o anel ler como órbita em movimento e não como um contorno
          parado. Os paths ficam em <defs> só para servir de trilho ao mpath. */}
      <defs>
        {ORBIT_TRACKS.map(o => (
          <path key={o.k} id={`${trackId}-${o.k}`} d={ellipsePath(cx, cy, rx * o.k, ry * o.k)} />
        ))}
      </defs>
      <motion.g style={{ opacity: ringOpacity }}>
        {ORBIT_TRACKS.flatMap(o =>
          o.sats.map((s, si) => (
            <circle key={`${o.k}-${si}`} r={s.r} fill={s.color} opacity={0.9}>
              <animateMotion dur={`${o.dur}s`} repeatCount="indefinite" begin={`-${s.begin * o.dur}s`} rotate="auto">
                <mpath href={`#${trackId}-${o.k}`} />
              </animateMotion>
              <animate attributeName="opacity" values=".35;1;.35" dur={`${o.dur / 3}s`} repeatCount="indefinite" />
            </circle>
          )),
        )}
      </motion.g>

      {cards.map((card, i) => (
        <Connector key={card.id} i={i} card={card} cfg={cfg} cubeHalf={cubeHalf} cardPx={cardPx} cx={cx} cy={cy} rx={rx} ry={ry} progress={progress} />
      ))}
    </svg>
  );
}

/** ellipse como <path>, porque <mpath> só aceita path como trilho */
const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

/* Os três anéis e os satélites de cada um. `begin` negativo distribui os pontos ao longo
   do trilho em vez de largar todos do mesmo lugar. */
const ORBIT_TRACKS = [
  { k: 0.86, a: 0.34, dash: "2 10", dur: 26, sats: [{ r: 2.6, color: CORE_CYAN, begin: 0 }, { r: 1.8, color: CORE_VIOLET, begin: 0.55 }] },
  { k: 1, a: 0.5, dash: "2 8", dur: 34, sats: [{ r: 3, color: "#fff", begin: 0.2 }, { r: 2.2, color: CORE_CYAN, begin: 0.68 }] },
  { k: 1.08, a: 0.3, dash: "2 12", dur: 44, sats: [{ r: 2.2, color: CORE_VIOLET, begin: 0.4 }] },
];

function Connector({
  i,
  card,
  cfg,
  cubeHalf,
  cardPx,
  cx,
  cy,
  rx,
  ry,
  progress,
}: {
  i: number;
  card: StackCard;
  cfg: StackHeroConfig;
  cubeHalf: number;
  cardPx: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  progress: MotionValue<number>;
}) {
  const start = cfg.tStart + i * cfg.tStep;
  const a = rad(card.angle);

  /* Vetor até o card, e a sua direção UNITÁRIA em pixels de tela. Trabalhar em pixels é o
     que corrige os comprimentos desiguais: antes o recuo era uma fração do raio da elipse,
     e como a elipse é achatada, a mesma fração valia muito mais px na horizontal que na
     vertical — daí a linha do topo curta e a da direita longa. */
  const vx = Math.cos(a) * rx * card.radius;
  const vy = Math.sin(a) * ry * card.radius;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;

  /* Distância do centro até a SILHUETA do cubo naquela direção. O cubo é um quadrado na
     tela, não um círculo: pelo canto ele chega a √2× mais longe que pelo meio da face.
     Sem isto, a linha do canto inferior começava DENTRO do cubo e passava por cima dele. */
  const cubeEdge = cubeHalf / Math.max(Math.abs(ux), Math.abs(uy));
  const from = cubeEdge + 16;

  /* Distância do centro do card até a sua borda na mesma direção (interseção com a caixa),
     para a linha parar rente ao card em vez de entrar nele. */
  const cardH = cardPx * 0.78;
  const inset = Math.min(cardPx / 2 / Math.max(Math.abs(ux), 1e-3), cardH / 2 / Math.max(Math.abs(uy), 1e-3));
  const to = Math.max(from + 8, len - inset - 6);

  const x1 = cx + ux * from;
  const y1 = cy + uy * from;
  const x2 = cx + ux * to;
  const y2 = cy + uy * to;

  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));
  /* dasharray no comprimento real do traço, senão o "desenhar" fica torto entre linhas
     de tamanhos diferentes */
  const drawn = Math.max(1, to - from);
  const dashOffset = useTransform(e, v => (1 - v) * drawn);

  return (
    <motion.g style={{ opacity: e }}>
      {/* halo largo por baixo, traço fino por cima: dá luz sem engrossar a linha */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={rgba(card.color, 0.14)} strokeWidth={4} strokeLinecap="round" />
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={rgba(card.color, 0.6)}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeDasharray={drawn}
        style={{ strokeDashoffset: dashOffset }}
      />
      {/* pulso de dados correndo do núcleo até o card */}
      <circle r={2.4} fill="#fff" opacity={0.9}>
        <animate attributeName="cx" values={`${x1};${x2}`} dur={`${2.4 + i * 0.45}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${y1};${y2}`} dur={`${2.4 + i * 0.45}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;.95;.95;0" dur={`${2.4 + i * 0.45}s`} repeatCount="indefinite" />
      </circle>
      {/* pad de chegada, rente à borda do card */}
      <circle cx={x2} cy={y2} r={3.2} fill={rgba(card.color, 0.95)} />
      <circle cx={x2} cy={y2} r={6.5} fill="none" stroke={rgba(card.color, 0.4)} strokeWidth={1} />
      <circle cx={x1} cy={y1} r={2} fill={rgba(card.color, 0.7)} />
    </motion.g>
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
  stageH,
  progress,
  isActive,
  isOpen,
  onToggle,
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
  stageH: number;
  progress: MotionValue<number>;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const start = cfg.tStart + i * cfg.tStep;
  const c = card.color;
  const w = cfg.cardW * stageW;
  const a = rad(card.angle);

  /* raio próprio do card: é a variação entre eles que lê como órbita */
  const rxc = rx * card.radius;
  const ryc = ry * card.radius;
  const dirX = Math.cos(a);
  const dirY = Math.sin(a);
  /* altura real do card, medida quando abre/fecha (o conteúdo define o tamanho) */
  const bodyRef = useRef<HTMLButtonElement>(null);
  const [cardH, setCardH] = useState(0);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCardH(el.offsetHeight));
    ro.observe(el);
    setCardH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const e = useTransform(progress, v => easeOut(clamp((v - start) / cfg.tDur)));

  /* Aberto o card cresce PARA O LADO, não para baixo: fica mais largo e passa a listar as
     techs em duas colunas. Antes ele crescia em altura (138 → 236px, +71%) e, em viewport
     de ~768px, o topo caía dentro da faixa do navbar — que é fixed com z-index 50 e portanto
     cobria o card. Crescer na horizontal usa o espaço que o anel tem de sobra e mantém a
     altura praticamente igual. */
  const wOpen = isOpen ? w * 1.62 : w;
  const push = isOpen ? 1.04 : 1;

  const x = useTransform(e, v => {
    const raw = cx + dirX * rxc * lerp(1 - cfg.emerge, push, v) - wOpen / 2;
    if (!stageW) return raw;
    /* mantém o card inteiro dentro do palco quando ele alarga */
    return Math.min(Math.max(raw, 8), stageW - wOpen - 8);
  });

  const y = useTransform(e, v => {
    const raw = cy + dirY * ryc * lerp(1 - cfg.emerge, push, v);
    if (!cardH || !stageH) return raw;
    const halfH = cardH / 2;
    /* NAV_SAFE reserva a faixa do navbar: o clamp antigo usava só 12px do topo do palco e
       ignorava o menu, então o card aberto subia para debaixo dele. */
    return Math.min(Math.max(raw, halfH + NAV_SAFE), stageH - halfH - 16);
  });
  /* `depth` multiplica a escala final: uns cards ficam mais perto da câmera que outros,
     senão o anel inteiro lê como um decalque plano */
  const scale = useTransform(e, v => lerp(0.84, 1, v) * card.depth);
  const opacity = useTransform(e, [0, 0.45], [0, 1]);

  const Icon = card.icon;
  const shown = isOpen ? card.items : card.items.slice(0, COLLAPSED_ITEMS);
  const hidden = card.items.length - COLLAPSED_ITEMS;
  const labelId = `stack-card-${card.id}`;

  return (
    /* Dois níveis de propósito: o Motion controla o transform do externo (x/y/scale), e a
       centragem vertical fica no interno. Pôr `translateY: "-50%"` junto de `y` no mesmo
       elemento faz os dois disputarem a mesma propriedade.
       zIndex sobe quando aberto para o card expandido passar na frente dos vizinhos. */
    <motion.div
      className="absolute"
      style={{ left: 0, top: 0, x, y, scale, opacity, width: wOpen, zIndex: isOpen ? 30 : 10, willChange: "transform, opacity" }}
    >
      <motion.button
        ref={bodyRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        className="relative block w-full text-left rounded-2xl overflow-hidden -translate-y-1/2 cursor-pointer"
        style={{
          padding: w * 0.085,
          /* Contorno luminoso sobre corpo escuro, como na referência: o card NÃO é
             preenchido com a cor — a cor vive na borda, no ícone, no título e no glow.
             Corpo quase opaco para o cubo não vazar através do texto. */
          border: `1.5px solid ${dark ? rgba(c, isOpen ? 1 : 0.75) : mix(c, 0.5, isOpen ? 1 : 0.8)}`,
          background: dark
            ? `radial-gradient(120% 120% at 50% 0%, ${rgba(c, isOpen ? 0.22 : 0.14)} 0%, transparent 62%),
               linear-gradient(160deg, rgba(16,18,26,.94) 0%, rgba(9,10,16,.97) 100%)`
            : `radial-gradient(120% 120% at 50% 0%, ${rgba(c, isOpen ? 0.28 : 0.2)} 0%, transparent 62%),
               linear-gradient(160deg, rgba(255,255,255,.97) 0%, rgba(248,248,252,.99) 100%)`,
        }}
        initial={false}
        animate={{
          opacity: isActive || isOpen ? 1 : cfg.dimInactive,
          boxShadow: isOpen
            ? `0 0 ${w * 0.42}px ${rgba(c, 0.5 * cfg.rimGlow)}, 0 ${w * 0.09}px ${w * 0.2}px rgba(0,0,0,${dark ? 0.6 : 0.16}), inset 0 1px 0 ${rgba(c, dark ? 0.5 : 0.3)}`
            : `0 0 ${w * 0.16}px ${rgba(c, 0.32 * cfg.rimGlow)}, 0 ${w * 0.05}px ${w * 0.14}px rgba(0,0,0,${dark ? 0.5 : 0.12}), inset 0 1px 0 ${rgba(c, dark ? 0.3 : 0.22)}`,
        }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
      >
        {/* grão: mata o banding do gradiente acima */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "120px 120px", opacity: dark ? 0.05 : 0.03 }}
        />

        {/* varredura de luz ao abrir — um único passe, não em loop */}
        {isOpen && (
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(105deg, transparent 40%, ${rgba(c, 0.22)} 50%, transparent 60%)` }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        )}

        <div className="relative flex items-center" style={{ gap: w * 0.055 }}>
          <motion.span
            className="shrink-0 grid place-items-center rounded-lg"
            style={{
              width: w * 0.19,
              height: w * 0.19,
              border: `1px solid ${rgba(c, 0.4)}`,
              background: rgba(c, dark ? 0.12 : 0.16),
            }}
            animate={{ boxShadow: `0 0 ${w * (isOpen ? 0.13 : 0.06)}px ${rgba(c, isOpen ? 0.6 : 0.35)}` }}
            transition={{ duration: 0.3 }}
          >
            <Icon size={w * 0.1} style={{ color: dark ? c : mix(c, 0.55) }} aria-hidden />
          </motion.span>
          <span
            id={labelId}
            className="font-mono2 uppercase whitespace-nowrap"
            style={{ fontSize: w * 0.058, letterSpacing: "0.16em", color: dark ? "rgba(255,255,255,.9)" : mix(c, 0.35) }}
          >
            {card.label[lang]}
          </span>
          {/* seta que gira: o único affordance de que o card é clicável */}
          <motion.span
            className="ml-auto shrink-0"
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 1 : 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            aria-hidden
          >
            <ChevronRight size={w * 0.075} style={{ color: c }} />
          </motion.span>
        </div>

        {/* A lista é sempre montada (as techs são conteúdo, não decoração), e ao abrir cada
            item entra em stagger com a barra de proficiência e a descrição — dados reais de
            data/skills.ts, que é justamente o que o clique tem de revelar. */}
        {/* Aberto vira DUAS COLUNAS: o card ficou mais largo, então o dobro de itens cabe na
            mesma altura. É isso que evita o crescimento vertical que batia no navbar. */}
        <ul
          className="relative"
          style={{
            marginTop: w * 0.07,
            display: "grid",
            gridTemplateColumns: isOpen ? "1fr 1fr" : "1fr",
            columnGap: w * 0.075,
            rowGap: isOpen ? w * 0.055 : w * 0.042,
          }}
        >
          <AnimatePresence initial={false}>
            {shown.map((it, k) => {
              const ItemIcon = it.icon as AnyIcon;
              return (
                <motion.li
                  key={it.name}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.28, delay: isOpen ? k * 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center" style={{ gap: w * 0.045 }}>
                    <ItemIcon size={w * 0.055} className="shrink-0" style={{ color: dark ? c : mix(c, 0.5) }} aria-hidden />
                    <span className="font-body" style={{ fontSize: w * 0.058, color: dark ? "rgba(255,255,255,.82)" : "rgba(0,0,0,.68)" }}>
                      {it.name}
                    </span>
                    {isOpen && (
                      <motion.span
                        className="ml-auto font-mono2 tabular-nums"
                        style={{ fontSize: w * 0.048, color: rgba(c, 0.9) }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.12 + k * 0.05 }}
                      >
                        {it.level}%
                      </motion.span>
                    )}
                  </div>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + k * 0.05 }}
                      style={{ overflow: "hidden", paddingLeft: w * 0.1 }}
                    >
                      <div
                        className="rounded-full overflow-hidden"
                        style={{ height: 3, marginTop: w * 0.028, background: dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.09)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${rgba(c, 0.5)}, ${c})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${it.level}%` }}
                          transition={{ duration: 0.7, delay: 0.18 + k * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <p
                        className="font-body"
                        style={{ fontSize: w * 0.05, marginTop: w * 0.028, color: dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)" }}
                      >
                        {it.desc}
                      </p>
                    </motion.div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {/* dica de que há mais techs por trás do clique */}
        {!isOpen && hidden > 0 && (
          <p className="relative font-mono2" style={{ marginTop: w * 0.05, fontSize: w * 0.048, color: rgba(c, 0.75) }}>
            +{hidden} {lang === "pt" ? "e detalhes" : "and details"}
          </p>
        )}
      </motion.button>
    </motion.div>
  );
}

/* --------------------------------------------------------------- cubo e base */

/** plataforma sob o cubo, deitada no plano do piso — dá peso à cena */
function CubePlatform({ size: s, rimGlow }: { size: number; rimGlow: number }) {
  const w = s * 1.5;
  const d = s * 0.92;
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
        /* Sem `border`: uma borda num elemento girado 78° desenha um trapézio de contorno
           duro que lê como erro. O contorno vem de um boxShadow inset, que acompanha o
           borderRadius elíptico. Intensidade subiu porque a plataforma é o que ancora o
           cubo na cena, e antes praticamente não era percebida. */
        background: `radial-gradient(ellipse at 50% 40%, ${rgba(CORE_CYAN, 0.26 * rimGlow)} 0%, ${rgba(CORE_VIOLET, 0.12 * rimGlow)} 40%, transparent 70%)`,
        /* só o halo externo. O `inset ... 0 0 1px` que existia aqui desenhava o contorno
           da elipse, e a plataforma passava a ler como um disco sólido recortado em vez
           de uma base iluminada. */
        boxShadow: `0 0 ${s * 0.34}px ${rgba(CORE_CYAN, 0.18 * rimGlow)}`,
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
          /* Halo maior e mais forte: na hierarquia pedida ele é o segundo elemento, logo
             depois do cubo, e é o que impede os cards de competirem com o núcleo. */
          inset: -s * 0.62,
          background: `radial-gradient(circle, ${rgba(CORE_CYAN, 0.3 * rimGlow)} 0%, ${rgba(CORE_BLUE, 0.22 * rimGlow)} 26%, ${rgba(CORE_VIOLET, 0.11 * rimGlow)} 48%, transparent 74%)`,
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
            /* Frost baixo + dominante AZUL: na referência o cubo lê como vidro azul-royal
               luminoso com o circuito visível dentro. O Fresnel dá a borda clara, a tinta
               azul dá a cor, e o miolo fica limpo para o núcleo aparecer. */
            background: dark
              ? `radial-gradient(112% 112% at 50% 50%, transparent 38%, ${rgba(CORE_CYAN, 0.12 * f.b)} 76%, ${rgba(CORE_CYAN, 0.26 * f.b)} 100%),
                 linear-gradient(133deg, rgba(255,255,255,${0.15 * f.b}) 0%, rgba(255,255,255,${0.03 * f.b}) 30%, transparent 55%),
                 linear-gradient(160deg, ${rgba(CORE_BLUE, 0.16 * f.b)} 0%, ${rgba(CORE_BLUE, 0.07 * f.b)} 50%, ${rgba(CORE_VIOLET, 0.12 * f.b)} 100%),
                 rgba(255,255,255,${0.02 * f.b})`
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
        href="#projetos"
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
