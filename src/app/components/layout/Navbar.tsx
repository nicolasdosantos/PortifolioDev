import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import type { Lang, Translation } from "../../types";
import { Logo } from "../common";

interface NavbarProps {
  dark: boolean;
  setDark: (dark: boolean) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translation;
}

const NAV_IDS = ["#home", "#sobre", "#projetos", "#skills", "#experiencia", "#contato"];

export function Navbar({ dark, setDark, lang, setLang, t }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? dark
            ? "bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.05] py-3"
            : "bg-white/90 backdrop-blur-xl border-b border-black/[0.05] py-3"
          : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => go("#home")} className="flex items-center">
            <Logo size={36} />
          </button>

          <div className="hidden md:flex items-center gap-1">
            {t.nav.map((label, i) => (
              <button
                key={label}
                onClick={() => go(NAV_IDS[i])}
                className={`px-3 py-1.5 rounded-lg text-sm font-body transition-all duration-200 ${dark ? "text-white/55 hover:text-white hover:bg-white/[0.05]" : "text-black/55 hover:text-black hover:bg-black/[0.05]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border transition-all duration-200 ${dark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]" : "border-black/10 text-black/50 hover:text-black hover:bg-black/[0.05]"}`}
            >
              {lang === "pt" ? "PT-BR" : "EN"}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg border transition-all duration-200 ${dark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]" : "border-black/10 text-black/50 hover:text-black hover:bg-black/[0.05]"}`}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <button className={`md:hidden p-2 rounded-lg ${dark ? "text-white/60" : "text-black/60"}`} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-x-0 top-[56px] z-40 p-6 border-b ${dark ? "bg-[#0F0F14]/95 backdrop-blur-xl border-white/[0.05]" : "bg-white/95 backdrop-blur-xl border-black/[0.05]"}`}
          >
            <div className="flex flex-col gap-1">
              {t.nav.map((label, i) => (
                <button key={label} onClick={() => go(NAV_IDS[i])} className={`text-left px-4 py-3 rounded-xl text-sm transition-colors ${dark ? "text-white/60 hover:text-white hover:bg-white/[0.05]" : "text-black/60 hover:text-black hover:bg-black/[0.05]"}`}>
                  {label}
                </button>
              ))}
              <div className={`flex gap-2 mt-4 pt-4 border-t ${dark ? "border-white/[0.05]" : "border-black/[0.05]"}`}>
                <button onClick={() => setLang(lang === "pt" ? "en" : "pt")} className={`flex-1 py-2 rounded-xl text-xs font-mono2 border ${dark ? "border-white/10 text-white/50" : "border-black/10 text-black/50"}`}>
                  {lang === "pt" ? "EN" : "PT-BR"}
                </button>
                <button onClick={() => setDark(!dark)} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs border ${dark ? "border-white/10 text-white/50" : "border-black/10 text-black/50"}`}>
                  {dark ? <><Sun size={13} />Light</> : <><Moon size={13} />Dark</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
