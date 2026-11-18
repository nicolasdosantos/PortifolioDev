import { useEffect, useId, useRef, useState } from "react";

/* Linha que serpenteia por trás de toda a página e se desenha conforme o scroll, com uma
   ponta que acompanha o traçado. Fica em -z-10 e pointer-events-none: nunca interfere em
   leitura, seleção ou clique, e passa atrás dos cards (que são opacos).

   Leitura: o traçado é forte nas laterais e esmaece na coluna central, onde está o texto.
   O esmaecimento vem do próprio degradê do traço (horizontal, em px da página), então é
   suave e não custa nada a mais por frame.

   Desempenho: o traçado é dividido em um path por curva em S. A cada scroll só o path da
   curva atual muda de dashoffset; os anteriores ficam inteiros e os seguintes vazios. Com
   um path único da altura da página (~14000px), o navegador repintava a página toda a cada
   quadro. Os valores vão direto no DOM, sem re-render do React. */

/** quantas curvas em S a linha faz de cima a baixo da página */
const SEGMENTS = 8;

/** margem lateral da curva, em fração da largura */
const INSET = 0.055;

/* Onde a ponta fica dentro da tela, em fração da altura da viewport: na altura dos olhos,
   descendo até o fim da tela só nos últimos 10% do scroll, para o traçado fechar junto com
   a última seção. */
const HEAD_FROM = 0.5;
const HEAD_TO = 1;

/* Opacidade do traço conforme a posição horizontal (0 = borda esquerda, 1 = direita):
   inteiro nas laterais, 15% no miolo onde fica o conteúdo. Usado no degradê e na ponta. */
const FADE_STOPS: [number, number][] = [
  [0, 1],
  [0.12, 1],
  [0.3, 0.15],
  [0.7, 0.15],
  [0.88, 1],
  [1, 1],
];

function fadeAt(xn: number) {
  for (let i = 1; i < FADE_STOPS.length; i++) {
    const [x1, o1] = FADE_STOPS[i - 1];
    const [x2, o2] = FADE_STOPS[i];
    if (xn <= x2) return o1 + (o2 - o1) * ((xn - x1) / (x2 - x1 || 1));
  }
  return 1;
}

/* Cada curva é uma Bézier cúbica com os dois pontos de controle na altura do meio, um no x
   de origem e outro no de destino: é o que dá o S suave. A curva i vai de y = i*seg até
   (i+1)*seg, então o segmento de um y qualquer é floor(y / seg). */
function buildSegments(w: number, h: number) {
  const x1 = w * INSET;
  const x2 = w * (1 - INSET);
  const seg = h / SEGMENTS;
  return Array.from({ length: SEGMENTS }, (_, i) => {
    const from = i % 2 === 0 ? x1 : x2;
    const to = i % 2 === 0 ? x2 : x1;
    const y0 = i * seg;
    const mid = (i + 0.5) * seg;
    const end = (i + 1) * seg;
    return `M ${from} ${y0} C ${from} ${mid}, ${to} ${mid}, ${to} ${end}`;
  });
}

export function ScrollTrail({ dark }: { dark: boolean }) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const tipRef = useRef<SVGGElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  /* A altura da página muda enquanto as seções, imagens e fontes carregam: medimos com
     ResizeObserver no #root e mais duas vezes depois, como rede de segurança. */
  useEffect(() => {
    const measure = () => {
      const el = document.documentElement;
      const h = Math.max(el.scrollHeight, document.body.scrollHeight, window.innerHeight);
      setBox(prev => (Math.abs(prev.h - h) < 8 && prev.w === el.clientWidth ? prev : { w: el.clientWidth, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    const root = document.getElementById("root");
    if (root) ro.observe(root);
    window.addEventListener("resize", measure);
    const t1 = setTimeout(measure, 1200);
    const t2 = setTimeout(measure, 3000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (box.h === 0) return;
    const paths = pathRefs.current.filter((p): p is SVGPathElement => !!p);
    if (paths.length !== SEGMENTS) return;
    const lens = paths.map(p => p.getTotalLength());
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`;
      p.style.strokeDashoffset = `${lens[i]}`;
    });
    const seg = box.h / SEGMENTS;
    let lastK = -1;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const close = Math.min(1, Math.max(0, (p - 0.9) / 0.1));
      const headY = window.scrollY + window.innerHeight * (HEAD_FROM + (HEAD_TO - HEAD_FROM) * close);
      const target = Math.min(box.h - 0.01, Math.max(0, headY));
      const k = Math.min(SEGMENTS - 1, Math.floor(target / seg));

      // curvas inteiras antes da atual e vazias depois: só mexe quando muda de curva
      if (k !== lastK) {
        paths.forEach((path, i) => {
          if (i < k) path.style.strokeDashoffset = "0";
          else if (i > k) path.style.strokeDashoffset = `${lens[i]}`;
        });
        lastK = k;
      }

      /* Busca binária pelo comprimento cujo ponto está no y alvo. O y da curva é
         monótono, então converge; mapear y direto em fração do comprimento fazia a linha
         correr à frente no meio do S, onde ela é diagonal. */
      const path = paths[k];
      let lo = 0;
      let hi = lens[k];
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < target) lo = mid;
        else hi = mid;
      }
      const at = (lo + hi) / 2;
      path.style.strokeDashoffset = `${lens[k] - at}`;

      const pt = path.getPointAtLength(at);
      const tip = tipRef.current;
      if (tip) {
        const end = k === SEGMENTS - 1 && at >= lens[k] * 0.998;
        tip.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
        // a ponta segue o mesmo esmaecimento do traço: discreta sobre o conteúdo
        tip.style.opacity = end ? "0" : `${fadeAt(pt.x / box.w)}`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [box.w, box.h]);

  if (box.h === 0) return null;

  const segments = buildSegments(box.w, box.h);
  const gradient = `trail-${uid}`;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.4] md:opacity-100"
      aria-hidden
    >
      <svg className="h-full w-full" viewBox={`0 0 ${box.w} ${box.h}`} fill="none">
        <defs>
          {/* horizontal, em px: forte nas laterais e esmaecido no miolo */}
          <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={box.w} y2={0}>
            {FADE_STOPS.map(([x, o]) => (
              <stop key={x} offset={x} style={{ stopColor: "var(--p-accent-ink)" }} stopOpacity={o} />
            ))}
          </linearGradient>
        </defs>

        {/* trilha apagada: mostra o caminho que ainda falta percorrer */}
        {segments.map((d, i) => (
          <path key={`t${i}`} d={d} stroke={dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.07)"} strokeWidth={1.5} />
        ))}

        {/* linha ativa, desenhada pelo dashoffset */}
        {segments.map((d, i) => (
          <path
            key={`a${i}`}
            ref={el => {
              pathRefs.current[i] = el;
            }}
            d={d}
            stroke={`url(#${gradient})`}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}

        {/* ponta: anel + núcleo, sem animação contínua */}
        <g ref={tipRef} style={{ opacity: 0 }}>
          <circle r={14} style={{ fill: "color-mix(in srgb, var(--p-accent-ink) 14%, transparent)" }} />
          <circle
            r={6}
            style={{ fill: dark ? "var(--p-bg)" : "var(--p-light-bg)", stroke: "var(--p-accent-ink)" }}
            strokeWidth={1.6}
          />
          <circle r={2.4} style={{ fill: "var(--p-secondary)" }} />
        </g>
      </svg>
    </div>
  );
}
