import { ArrowUp } from "lucide-react";
import type { Translation } from "../../types";

interface FooterProps {
  dark: boolean;
  t: Translation;
}

export function Footer({ dark, t }: FooterProps) {
  return (
    <footer className={`py-10 border-t ${dark ? "border-white/[0.05]" : "border-black/[0.14]"}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className={`font-display text-base font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>
            Nicolas<span className="text-violet-500">.</span>
          </div>
          <div className={`text-xs font-body mt-1 ${dark ? "text-white/28" : "text-black/52"}`}>{t.footer_tagline}</div>
        </div>
        <div className={`text-xs font-body ${dark ? "text-white/28" : "text-black/52"}`}>
          © 2026 Nicolas Pichiteli dos Santos · {t.all_rights}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-body transition-all duration-300 hover:-translate-y-1 ${dark ? "border-white/10 text-white/45 hover:text-white hover:bg-white/[0.05] hover:border-violet-500/30" : "border-black/[0.16] text-black/65 hover:text-black hover:bg-black/[0.07]"}`}
        >
          <ArrowUp size={14} /> {t.back_top}
        </button>
      </div>
    </footer>
  );
}
