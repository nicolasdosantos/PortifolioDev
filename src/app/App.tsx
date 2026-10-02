import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { Lang } from "./types";
import { translations } from "./data";
import { Aurora, Cursor, GlobalStyles, Intro, ScrollBar, ScrollTrail } from "./components/common";
import { Footer, Navbar } from "./components/layout";
import { About, Certificates, Contact, DevProcess, Experience, Hero, Projects, StackHero } from "./components/sections";
import { currentHashId } from "./utils/sections";

const INTRO_SEEN_KEY = "intro-seen";

/* A intro aparece uma vez por sessão: recarregar a página ou voltar ao site na mesma aba
   vai direto ao conteúdo. Com movimento reduzido no sistema, ela não aparece. Um link
   direto para uma seção (`/#projetos`) também pula a intro: quem mandou o link quer que a
   pessoa caia ali. O storage pode estar bloqueado (aba anônima, cookies desligados): aí a
   intro só aparece. */
function introAlreadyHandled() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    if (currentHashId()) return true;
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [done, setDone] = useState(introAlreadyHandled);
  const finishIntro = useCallback(() => {
    setDone(true);
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* sem storage a intro volta na próxima visita, o que é aceitável */
    }
  }, []);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // leitores de tela e tradutores automáticos usam o lang do <html> para a pronúncia
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  }, [lang]);

  /* Link direto (`/#projetos`): o navegador tenta pular para a âncora antes do React montar
     as seções e não acha nada. Aqui, já com tudo montado, a rolagem é feita de novo — e mais
     uma vez quando as fontes terminam de carregar, porque a troca de fonte muda a altura dos
     textos acima da seção e ela descia alguns pixels. Se a pessoa já rolou, não puxa de volta. */
  useEffect(() => {
    const id = currentHashId();
    if (!id) return;
    let userMoved = false;
    const go = () => {
      if (!userMoved) document.getElementById(id)?.scrollIntoView();
    };
    const moved = () => {
      userMoved = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach(ev => window.addEventListener(ev, moved, { passive: true, once: true }));
    const raf = requestAnimationFrame(go);
    document.fonts?.ready.then(() => requestAnimationFrame(go));
    return () => {
      cancelAnimationFrame(raf);
      events.forEach(ev => window.removeEventListener(ev, moved));
    };
  }, []);

  const t = translations[lang];

  return (
    /* reducedMotion="user": com "reduzir movimento" ligado no sistema, as animações de
       deslocamento e escala do Motion viram transições instantâneas no site inteiro (a
       seção do cubo já tratava isso por conta própria). */
    <MotionConfig reducedMotion="user">
    <div className={`min-h-screen relative transition-colors duration-500 ${dark ? "bg-[#08080A]" : "bg-[#E9E9F0]"}`}>
      <GlobalStyles />
      <AnimatePresence>{!done && <Intro onDone={finishIntro} />}</AnimatePresence>

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
          {/* Primeiro item do Tab: leva direto ao conteúdo, sem passar pelo menu. Só aparece com foco. */}
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-violet-600 focus:text-white focus:text-sm focus:font-body focus:font-medium focus:shadow-lg"
          >
            {t.skip_to_content}
          </a>
          <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t} />
          <main id="conteudo" tabIndex={-1} className="outline-none">
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
          </main>
          <Footer dark={dark} t={t} />
        </motion.div>
      )}
    </div>
    </MotionConfig>
  );
}
