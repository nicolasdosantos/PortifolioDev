import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import type { PendingLink } from "../../types";
import { GradientIcon } from "./GradientIcon";

interface ConfirmNavigateDialogProps {
  pending: PendingLink | null;
  dark: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmNavigateDialog({ pending, dark, onCancel, onConfirm, title, description }: ConfirmNavigateDialogProps) {
  const gradientCss = pending ? `linear-gradient(135deg, ${pending.colors.join(", ")})` : undefined;
  let host = "";
  try {
    host = pending ? new URL(pending.href).hostname.replace(/^www\./, "") : "";
  } catch {
    host = pending?.href ?? "";
  }
  if (pending && !host) host = pending.href;

  const isLight = (hex: string) => {
    const m = hex.replace("#", "");
    if (m.length !== 6) return false;
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 190;
  };
  const buttonTextClass = pending && isLight(pending.colors[0]) ? "text-[#08080A]" : "text-white";

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden ${dark ? "bg-[#0d0d12]" : "bg-white"}`}
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: `0 20px 60px -12px ${pending.colors[0]}55` }}
          >
            {/* Gradient top border accent */}
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: gradientCss }} />

            {/* Ambient glow */}
            <div
              className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none opacity-25 blur-3xl"
              style={{ background: gradientCss }}
            />

            <button
              onClick={onCancel}
              aria-label="Fechar"
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors duration-200 ${dark ? "text-white/40 hover:text-white hover:bg-white/[0.08]" : "text-black/40 hover:text-black hover:bg-black/[0.06]"}`}
            >
              <X size={16} />
            </button>

            <div className="relative p-7 pt-8 flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
              >
                <GradientIcon icon={pending.icon} colors={pending.colors} size={26} />
              </div>

              <h3 className={`font-display text-lg font-bold mb-1.5 ${dark ? "text-white" : "text-[#08080A]"}`}>
                {title ?? "Ir para a documentação?"}
              </h3>
              <p className={`text-sm font-body leading-relaxed mb-1 ${dark ? "text-white/55" : "text-black/60"}`}>
                {description ?? (
                  <>
                    Você será redirecionado para o site oficial de{" "}
                    <span className="font-semibold" style={{ backgroundImage: gradientCss, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                      {pending.name}
                    </span>
                    .
                  </>
                )}
              </p>
              <span className={`text-xs font-mono2 mb-6 ${dark ? "text-white/30" : "text-black/40"}`}>{host}</span>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={onCancel}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-colors duration-200 ${dark ? "border-white/10 text-white/70 hover:bg-white/[0.06]" : "border-black/[0.16] text-black/70 hover:bg-black/[0.06]"}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-transform duration-200 hover:scale-[1.03] ${buttonTextClass}`}
                  style={{ background: gradientCss, boxShadow: `0 4px 20px -4px ${pending.colors[0]}66` }}
                >
                  Abrir <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
