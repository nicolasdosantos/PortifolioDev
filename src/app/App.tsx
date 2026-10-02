import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Lang } from "./types";
import { translations } from "./data";
import { Aurora, Cursor, GlobalStyles, Intro, ScrollBar, ScrollTrail } from "./components/common";
import { Footer, Navbar } from "./components/layout";
import { About, Certificates, Contact, DevProcess, Experience, Hero, Projects, StackHero } from "./components/sections";

export default function App() {
  const [done, setDone] = useState(false);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const t = translations[lang];

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${dark ? "bg-[#08080A]" : "bg-[#E9E9F0]"}`}>
      <GlobalStyles />
      <AnimatePresence>{!done && <Intro onDone={() => setDone(true)} />}</AnimatePresence>

      <Aurora />
      <Cursor />
      <ScrollBar />

      {done && (
        /* `isolate` é obrigatório aqui: o ScrollTrail usa -z-10 e, sem um contexto de
            empilhamento neste nível, ele subiria até a raiz e ficaria ATRÁS do fundo
            bg-[#08080A] do container — invisível. Com o isolate ele fica atrás das
            seções (que são transparentes) e à frente do fundo. */
        <motion.div className="isolate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}>
          {/* Linha que serpenteia atrás de todo o conteúdo e se desenha com o scroll.
              Fica em -z-10 e pointer-events-none: é puramente visual.
              Montada AQUI, junto do conteúdo, e não antes: fora daqui ela media a página
              enquanto só a Intro existia e o traçado saía do tamanho de uma tela. */}
          <ScrollTrail dark={dark} />
          <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t} />
          <Hero dark={dark} t={t} lang={lang} />
          <About dark={dark} t={t} lang={lang} />
          {/* Projetos logo depois do Sobre: são a prova principal e antes ficavam a ~8 telas
              do topo, atrás de Jornada, cubo, Processo e Skills. */}
          <Projects dark={dark} t={t} lang={lang} />
          <Experience dark={dark} t={t} lang={lang} />
          {/* Seção do cubo: é a única vitrine da stack (a seção Skills, com percentuais, saiu).
              Traz a âncora #stack, que o Navbar detecta em runtime e passa a exibir no menu. */}
          <StackHero dark={dark} lang={lang} />
          <DevProcess dark={dark} t={t} />
          <Certificates dark={dark} t={t} />
          <Contact dark={dark} t={t} />
          <Footer dark={dark} t={t} />
        </motion.div>
      )}
    </div>
  );
}
