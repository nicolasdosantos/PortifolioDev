import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import type { Lang } from "./types";
import { translations } from "./data";
import { Aurora, GlobalStyles, ScrollBar, ScrollTrail } from "./components/common";
import { Footer, Navbar } from "./components/layout";
import { About, Certificates, Contact, DevProcess, Experience, Hero, Projects, StackHero } from "./components/sections";
import { currentHashId } from "./utils/sections";

const THEME_KEY = "theme";
const LANG_KEY = "lang";

function readStored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage bloqueado: vale o padrão
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* sem storage a escolha vale só nesta visita */
  }
}

/* Idioma: `?lang=en` na URL tem prioridade (para mandar o link em inglês numa vaga), depois
   a última escolha da pessoa, depois o idioma do navegador. */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (fromUrl === "en" || fromUrl === "pt") return fromUrl;
  const saved = readStored(LANG_KEY);
  if (saved === "en" || saved === "pt") return saved;
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/* Tema: a última escolha da pessoa; sem escolha, o escuro, que é o tema principal do site. */
function initialDark() {
  return readStored(THEME_KEY) !== "light";
}

export default function App() {
  const [dark, setDark] = useState(initialDark);
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // leitores de tela e tradutores automáticos usam o lang do <html> para a pronúncia
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  }, [lang]);

  /* Só grava quando a pessoa troca, para a escolha automática (navegador) não virar
     preferência salva. A URL acompanha o idioma, mantendo a âncora da seção. */
  const changeDark = (value: boolean) => {
    setDark(value);
    store(THEME_KEY, value ? "dark" : "light");
  };
  const changeLang = (value: Lang) => {
    setLang(value);
    store(LANG_KEY, value);
    const url = new URL(window.location.href);
    if (value === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  };

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
    <div className={`min-h-screen relative transition-colors duration-500 ${dark ? "bg-[color:var(--p-bg)]" : "bg-[color:var(--p-light-bg)]"}`}>
      <GlobalStyles />
      <Aurora />
      <ScrollBar />

      {/* `isolate` é obrigatório aqui: o ScrollTrail usa -z-10 e, sem um contexto de
            empilhamento neste nível, ele subiria até a raiz e ficaria ATRÁS do fundo
            bg-[color:var(--p-bg)] do container — invisível. Com o isolate ele fica atrás das
          seções (que são transparentes) e à frente do fundo. */}
        <motion.div className="isolate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}>
          {/* Linha que serpenteia atrás de todo o conteúdo e se desenha com o scroll.
              Fica em -z-10 e pointer-events-none: é puramente visual.
              Montada junto do conteúdo para medir a página já com todas as seções. */}
          <ScrollTrail dark={dark} />
          {/* Primeiro item do Tab: leva direto ao conteúdo, sem passar pelo menu. Só aparece com foco. */}
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[color:var(--p-accent)] focus:text-[color:var(--p-on-accent)] focus:text-sm focus:font-body focus:font-medium focus:shadow-lg"
          >
            {t.skip_to_content}
          </a>
          <Navbar dark={dark} setDark={changeDark} lang={lang} setLang={changeLang} t={t} />
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
    </div>
    </MotionConfig>
  );
}
