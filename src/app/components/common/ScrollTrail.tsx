import { motion, useMotionValue } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

/* Linha que serpenteia por trás de toda a página e se desenha conforme o scroll, com uma
   ponta luminosa que acompanha o traçado.

   Técnica portada do obsidian-eta-self.vercel.app: dois paths com o MESMO traçado, um
   sobre o outro. O de baixo é a trilha apagada (mostra o caminho que falta); o de cima
   recebe `stroke-dasharray` igual ao comprimento total e um `stroke-dashoffset` que vai
   do comprimento até zero — é isso que produz o efeito de "linha sendo desenhada".

   Adaptações para este portfólio:
   - gradiente violeta → ciano (a paleta do site) no lugar do azul do original;
   - fica em -z-10 dentro do container e `pointer-events-none`: nunca interfere em
     leitura, seleção ou clique;
   - mais discreta no mobile, onde a tela é estreita e a curva passa sob o texto. */

/** quantas curvas em S a linha faz de cima a baixo da página */
const SEGMENTS = 8;

/** margem lateral da curva, em fração da largura — mantém a linha longe do conteúdo central */
const INSET = 0.055;

/* Onde a ponta fica dentro da tela, em fração da altura da viewport. Na altura dos olhos
   (50%): a 78% ela corria à frente do que se está lendo e parecia adiantada. Vai a 100%
   no fim do scroll, para o traçado fechar junto com a última seção. */
const HEAD_FROM = 0.5;
const HEAD_TO = 1;

/* Serpentina: cada segmento é uma Bézier cúbica com os dois pontos de controle na altura
   do meio, um no x de origem e outro no x de destino. É o que dá a curva S suave. */
function buildPath(w: number, h: number) {
  const x1 = w * INSET;
  const x2 = w * (1 - INSET);
  const seg = h / SEGMENTS;
  let d = `M ${x1} 0`;
  for (let i = 0; i < SEGMENTS; i++) {
    const from = i % 2 === 0 ? x1 : x2;
    const to = i % 2 === 0 ? x2 : x1;
    const mid = (i + 0.5) * seg;
    const end = (i + 1) * seg;
    d += ` C ${from} ${mid}, ${to} ${mid}, ${to} ${end}`;
  }
  return d;
}

export function ScrollTrail({ dark }: { dark: boolean }) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [len, setLen] = useState(0);

  /* A altura do documento muda enquanto a página monta (a seção do cubo sozinha traz
     ~3000px), então medimos com ResizeObserver em vez de uma vez só. */
  useEffect(() => {
    const measure = () => {
      const el = document.documentElement;
      const h = Math.max(el.scrollHeight, document.body.scrollHeight, window.innerHeight);
      setBox(prev => (Math.abs(prev.h - h) < 8 && prev.w === el.clientWidth ? prev : { w: el.clientWidth, h }));
    };
    measure();
    /* Observamos o #root, não o body: é ele que cresce quando as seções montam. Medindo só
       no mount, a altura ficava em 885px (a Intro em tela) e o viewBox cobria apenas a
       primeira tela em vez dos ~14000px da página. */
    const root = document.getElementById("root");
    const ro = new ResizeObserver(measure);
    if (root) ro.observe(root);
    ro.observe(document.documentElement);
    window.addEventListener("resize", measure);
    /* rede de segurança: imagens e fontes chegando depois mudam a altura sem disparar o RO */
    const t1 = setTimeout(measure, 1200);
    const t2 = setTimeout(measure, 3000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* Progresso calculado à mão em vez de useScroll(): o componente monta antes das seções,
     e o useScroll cacheia os limites do scroll no mount — com a página ainda em 885px ele
     travava em 0 e a linha nunca se desenhava. Um listener lê scrollHeight a cada evento,
     então acompanha a página crescendo. Tudo vai para MotionValues, sem re-render. */
  const dashOffset = useMotionValue(0);
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const tipOn = useMotionValue(0);
  const lenRef = useRef(0);
  const syncRef = useRef<(() => void) | null>(null);
  lenRef.current = len;

  useEffect(() => {
    const onScroll = () => {
      const total = lenRef.current;
      const trailH = wrapRef.current?.offsetHeight || 0;
      if (!total || !trailH) return;

      /* A ponta é ancorada na VIEWPORT, não no progresso puro do scroll. Antes eu mapeava
         scrollY/scrollMax direto no comprimento do traçado: como o path é mais longo do
         que a página é alta (são curvas) e o scroll máximo é menor que a altura total, a
         ponta ficava sempre atrás da tela — parecia atrasada. Agora ela mira um Y da
         viewport, então está sempre visível e no ritmo do scroll. */
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      /* A âncora só desce para o rodapé nos últimos 10% do scroll. Interpolando ela ao
         longo de toda a página, no meio já estava em 75% da tela — era o que fazia a linha
         correr à frente da leitura. */
      const close = Math.min(1, Math.max(0, (p - 0.9) / 0.1));
      const headY = window.scrollY + window.innerHeight * (HEAD_FROM + (HEAD_TO - HEAD_FROM) * close);

      /* Busca binária pelo comprimento cujo ponto está nesse Y, em vez de usar
         headY/altura como fração do comprimento: dentro de cada curva a fração de arco não
         acompanha a fração de altura (a linha "corre" mais no meio do S, onde ela é
         diagonal), e isso somava ~7% de avanço extra. O y do traçado é monótono, então a
         busca converge. Também absorve qualquer diferença entre a altura do SVG e a do
         documento. */
      const target = Math.min(trailH, Math.max(0, headY));
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        if ((pathRef.current?.getPointAtLength(mid).y ?? 0) < target) lo = mid;
        else hi = mid;
      }
      const at = (lo + hi) / 2;
      const frac = at / total;

      dashOffset.set(total - at);

      const pt = pathRef.current?.getPointAtLength(at);
      if (pt) {
        tipX.set(pt.x);
        tipY.set(pt.y);
      }
      /* apaga no fim: sem isso a ponta fica parada e acesa no rodapé */
      tipOn.set(frac >= 0.998 ? 0 : 1);
    };
    syncRef.current = onScroll;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      syncRef.current = null;
    };
  }, [dashOffset, len, tipOn, tipX, tipY]);

  /* o dasharray precisa do comprimento REAL do traçado, que só existe depois de o path
     estar no DOM com as dimensões atuais */
  useEffect(() => {
    if (pathRef.current && box.h > 0) {
      const total = pathRef.current.getTotalLength();
      if (total > 0) {
        setLen(total);
        /* Sincroniza no mesmo tick: depender só do efeito de scroll re-rodar deixava um
           frame com offset 0 — a linha aparecia inteira de uma vez antes do 1º scroll. */
        lenRef.current = total;
        syncRef.current?.();
      }
    }
  }, [box.w, box.h]);

  if (box.h === 0) return null;

  const d = buildPath(box.w, box.h);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.4] md:opacity-100"
      aria-hidden
    >
      <svg className="h-full w-full" viewBox={`0 0 ${box.w} ${box.h}`} fill="none">
        <defs>
          <linearGradient id={`trail-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="55%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>

          {/* halo da ponta: gradiente radial em vez de filtro de blur — um drop-shadow
              grande sobre um SVG de 14000px de altura custa caro a cada frame */}
          <radialGradient id={`tip-${uid}`}>
            <stop offset="0%" stopColor="#A5F3FC" stopOpacity={0.5} />
            <stop offset="45%" stopColor="#67E8F9" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* trilha apagada: mostra o caminho que ainda falta percorrer */}
        <path d={d} stroke={dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)"} strokeWidth={2} />

        {/* brilho difuso por baixo da linha ativa, para ela não parecer um fio seco */}
        <motion.path
          d={d}
          stroke={`url(#trail-${uid})`}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={len || undefined}
          style={{ strokeDashoffset: dashOffset }}
          opacity={0.15}
        />

        {/* linha ativa: o dashoffset acompanha o scroll e a "desenha" */}
        {/* strokeDasharray vai como ATRIBUTO, não em `style`: pelo style o Motion não
            aplicava o valor numérico e o computado saía "none", então a linha aparecia
            inteira de uma vez em vez de se desenhar. */}
        <motion.path
          ref={pathRef}
          d={d}
          stroke={`url(#trail-${uid})`}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={len || undefined}
          style={{
            strokeDashoffset: dashOffset,
            filter: `drop-shadow(0 0 6px ${dark ? "rgba(124,58,237,.55)" : "rgba(124,58,237,.3)"})`,
          }}
          opacity={0.9}
        />

        {/* Ponta luminosa. O grupo é posicionado por MotionValues (x/y em unidades do
            viewBox, que aqui é 1:1 com px) e os filhos ficam na origem. */}
        <motion.g style={{ x: tipX, y: tipY, opacity: tipOn }}>
          {/* halo */}
          <circle r={30} fill={`url(#tip-${uid})`} />

          {/* anel que pulsa para fora, dando vida à ponta */}
          <motion.circle
            r={9}
            fill="none"
            stroke="#67E8F9"
            strokeWidth={1.4}
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />

          {/* anel fixo + núcleo: o contorno dá a leitura de "cabeça" e o miolo claro
              garante contraste no fundo escuro */}
          <circle r={7} fill={dark ? "rgba(8,8,10,.85)" : "rgba(255,255,255,.9)"} stroke="#67E8F9" strokeWidth={1.6} />
          <motion.circle
            r={3}
            fill="#E0FBFF"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Seta apontando para baixo, na mesma linguagem do "Role para explorar" do Hero:
              é o ícone na ponta, e reforça que ela indica o caminho da página. */}
          <motion.path
            d="M -3.2 8 L 0 11.2 L 3.2 8"
            fill="none"
            stroke="#67E8F9"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [-1, 1.5, -1], opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
