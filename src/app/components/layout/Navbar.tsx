import { useEffect, useRef, useState } from "react";
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

const NAV_IDS = ["home", "sobre", "skills", "projetos", "certificados", "experiencia", "contato"];

export function Navbar({ dark, setDark, lang, setLang, t }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(NAV_IDS[0]);
  const clickLock = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const sections = NAV_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        if (clickLock.current !== null) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setActive(id);
    if (clickLock.current) window.clearTimeout(clickLock.current);
    clickLock.current = window.setTimeout(() => { clickLock.current = null; }, 900);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            ? "bg-[#08080A]/90 backdrop-blur-xl py-3"
            : "bg-white/90 backdrop-blur-xl py-3"
          : "py-5"
        }`}
      >
        {/* Ambient glow that follows scroll state */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full pointer-events-none -z-10"
          animate={{ opacity: scrolled ? 0.55 : 0.25 }}
          transition={{ duration: 0.6 }}
          style={{
            background: dark
              ? "radial-gradient(60% 140% at 50% 0%, rgba(124,58,237,0.16), transparent 70%)"
              : "radial-gradient(60% 140% at 50% 0%, rgba(124,58,237,0.08), transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.button
            onClick={() => go("home")}
            className="relative flex items-center"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.span
              className="absolute -inset-2 rounded-full blur-md -z-10"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)", willChange: "transform, opacity" }}
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Logo size={36} />
          </motion.button>

          <div className="hidden md:flex items-center gap-1 relative p-1 rounded-2xl">
            {t.nav.map((label, i) => {
              const id = NAV_IDS[i];
              const isActive = active === id;
              return (
                <button
                  key={label}
                  onClick={() => go(id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-sm font-body transition-colors duration-200 ${isActive
                    ? dark ? "text-white" : "text-[#08080A]"
                    : dark ? "text-white/50 hover:text-white" : "text-black/60 hover:text-black"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-xl ${dark ? "bg-white/[0.09]" : "bg-black/[0.08]"}`}
                      style={{ boxShadow: dark ? "0 0 16px rgba(124,58,237,0.18)" : "0 0 12px rgba(124,58,237,0.12)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border transition-colors duration-200 ${dark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]" : "border-black/[0.16] text-black/70 hover:text-black hover:bg-black/[0.08]"}`}
            >
              {lang === "pt" ? "PT-BR" : "EN"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg border transition-colors duration-200 ${dark ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]" : "border-black/[0.16] text-black/70 hover:text-black hover:bg-black/[0.08]"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`md:hidden p-2 rounded-lg ${dark ? "text-white/60" : "text-black/75"}`}
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-x-0 top-[56px] z-40 p-6 border-b ${dark ? "bg-[#0F0F14]/95 backdrop-blur-xl border-white/[0.05]" : "bg-white/95 backdrop-blur-xl border-black/[0.14]"}`}
          >
            <div className="flex flex-col gap-1">
              {t.nav.map((label, i) => {
                const id = NAV_IDS[i];
                const isActive = active === id;
                return (
                  <motion.button
                    key={label}
                    onClick={() => go(id)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-colors ${isActive
                      ? dark ? "text-white bg-white/[0.07]" : "text-black bg-black/[0.06]"
                      : dark ? "text-white/60 hover:text-white hover:bg-white/[0.05]" : "text-black/75 hover:text-black hover:bg-black/[0.08]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-violet-500 scale-100" : "bg-transparent scale-0"}`}
                    />
                    {label}
                  </motion.button>
                );
              })}
              <div className={`flex gap-2 mt-4 pt-4 border-t ${dark ? "border-white/[0.05]" : "border-black/[0.14]"}`}>
                <button onClick={() => setLang(lang === "pt" ? "en" : "pt")} className={`flex-1 py-2 rounded-xl text-xs font-mono2 border ${dark ? "border-white/10 text-white/50" : "border-black/[0.16] text-black/70"}`}>
                  {lang === "pt" ? "EN" : "PT-BR"}
                </button>
                <button onClick={() => setDark(!dark)} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs border ${dark ? "border-white/10 text-white/50" : "border-black/[0.16] text-black/70"}`}>
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
