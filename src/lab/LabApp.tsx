import { useEffect, useState } from "react";
import type { Lang } from "../app/types";
import { translations } from "../app/data";
import { Aurora, Cursor, GlobalStyles, ScrollBar } from "../app/components/common";
import { Navbar } from "../app/components/layout";
import { About, Hero, Skills } from "../app/components/sections";
import { STACK_HERO_DEFAULTS, StackHero, type StackHeroConfig } from "../app/components/sections/StackHero";
import { TuningPanel } from "./TuningPanel";

/* Tela de teste: clone do site com o StackHero já no lugar, rodando pelo
   scroll de verdade. Sem a Intro, para não esperar a abertura a cada reload.
   Roda em /lab.html — nada aqui é importado pelo App.tsx. */

/* Parâmetros de URL para inspeção: ?p=0.5 congela o progresso,
   ?ui=0 esconde o botão de ajustes, ?theme=light usa o tema claro. */
const q = new URLSearchParams(location.search);
const qp = q.get("p");
const qProgress = qp == null ? null : Math.max(0, Math.min(1, +qp));

export default function LabApp() {
  const [dark, setDark] = useState(q.get("theme") !== "light");
  const [lang, setLang] = useState<Lang>("pt");
  const [cfg, setCfg] = useState<StackHeroConfig>(STACK_HERO_DEFAULTS);
  const [scrub, setScrub] = useState<number | null>(qProgress);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (qProgress != null) document.getElementById("stack")?.scrollIntoView();
  }, []);

  /* ?diag=1 -> despeja medidas no DOM (lido via chrome --dump-dom) */
  useEffect(() => {
    if (q.get("diag") !== "1") return;
    const dump = () => {
      const sec = document.getElementById("stack");
      const st = sec?.querySelector<HTMLElement>(".sticky");
      const el = document.getElementById("diag");
      if (el)
        el.textContent = JSON.stringify(
          {
            scrollY: Math.round(scrollY),
            docH: document.documentElement.scrollHeight,
            viewport: [innerWidth, innerHeight],
            section: sec ? { top: Math.round(sec.getBoundingClientRect().top), h: Math.round(sec.getBoundingClientRect().height) } : null,
            sticky: st ? { top: Math.round(st.getBoundingClientRect().top), h: Math.round(st.getBoundingClientRect().height) } : null,
          },
          null,
          1,
        );
    };
    const t = setTimeout(dump, 1200);
    return () => clearTimeout(t);
  }, []);

  const t = translations[lang];

  /* ?only=1 -> apenas a seção, em uma página de 100vh (para inspeção/screenshot) */
  if (q.get("only") === "1")
    return (
      <div className={dark ? "bg-[#08080A]" : "bg-[#E9E9F0]"}>
        <GlobalStyles />
        <StackHero dark={dark} lang={lang} config={{ ...cfg, pages: 1 }} scrub={scrub ?? 1} />
        {q.get("ui") !== "0" && <TuningPanel cfg={cfg} setCfg={setCfg} scrub={scrub} setScrub={setScrub} />}
      </div>
    );

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${dark ? "bg-[#08080A]" : "bg-[#E9E9F0]"}`}>
      <GlobalStyles />
      <Aurora dark={dark} />
      <Cursor />
      <ScrollBar />

      <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t} />
      <Hero dark={dark} t={t} lang={lang} />
      <StackHero dark={dark} lang={lang} config={cfg} scrub={scrub} />
      <About dark={dark} t={t} lang={lang} />
      <Skills dark={dark} t={t} lang={lang} />

      {q.get("ui") !== "0" && <TuningPanel cfg={cfg} setCfg={setCfg} scrub={scrub} setScrub={setScrub} />}
      {q.get("diag") === "1" && <pre id="diag" className="fixed left-2 top-2 z-[99] text-[11px] text-emerald-300 bg-black/80 p-2" />}
    </div>
  );
}
