import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Lang } from "./types";
import { translations } from "./data";
import { Aurora, Cursor, GlobalStyles, Intro, ScrollBar } from "./components/common";
import { Footer, Navbar } from "./components/layout";
import {
  About,
  Blog,
  Certificates,
  Contact,
  DevProcess,
  Experience,
  FAQ,
  FavoriteTools,
  GitHubActivity,
  Hero,
  Journey,
  Projects,
  Skills,
  Stats,
} from "./components/sections";

export default function App() {
  const [done, setDone] = useState(false);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const t = translations[lang];

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${dark ? "bg-[#08080A]" : "bg-[#F8F8FF]"}`}>
      <GlobalStyles />
      <AnimatePresence>{!done && <Intro onDone={() => setDone(true)} />}</AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.55 }}>
        <Aurora dark={dark} />
        <Cursor />
        <ScrollBar />
        <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t} />
        <Hero dark={dark} t={t} />
        <About dark={dark} t={t} lang={lang} />
        <Journey dark={dark} t={t} lang={lang} />
        <DevProcess dark={dark} t={t} />
        <Skills dark={dark} t={t} lang={lang} />
        <Projects dark={dark} t={t} lang={lang} />
        <Stats dark={dark} t={t} />
        <Certificates dark={dark} t={t} />
        <Experience dark={dark} t={t} lang={lang} />
        <FavoriteTools dark={dark} t={t} />
        <GitHubActivity dark={dark} t={t} />
        <Blog dark={dark} t={t} lang={lang} />
        <FAQ dark={dark} t={t} />
        <Contact dark={dark} t={t} />
        <Footer dark={dark} t={t} />
      </motion.div>
    </div>
  );
}
