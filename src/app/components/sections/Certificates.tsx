import { useState } from "react";
import { motion } from "motion/react";
import { BadgeCheck, CircleCheck, Clock, ExternalLink } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { certificates, completedCertificates } from "../../data";
import { useHasHover } from "../../hooks/useHasHover";

interface CertificatesProps {
  dark: boolean;
  t: Translation;
}

export function Certificates({ dark, t }: CertificatesProps) {
  const totalHours = certificates.reduce((sum, c) => sum + (c.hours ? parseInt(c.hours) : 0), 0);
  const institutions = new Set(certificates.map((c) => c.issuer)).size;
  const hasHover = useHasHover();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="certificados" className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.certs_label} title={t.certs_title} dark={dark} />

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-10 -mt-8"
        >
          {[
            { value: completedCertificates.length, label: t.certs_stat_certs },
            { value: institutions, label: t.certs_stat_institutions },
            { value: `${totalHours}h+`, label: t.certs_stat_hours },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`font-display text-xl font-bold ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}>{s.value}</span>
              <span className={`text-xs font-body ${dark ? "text-white/50" : "text-black/70"}`}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, i) => {
            const CertIcon = cert.icon;
            const isHovered = hasHover ? hovered === cert.title : true;
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 24, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={hasHover ? { y: -5, transition: { duration: 0.25, ease: "easeOut" } } : undefined}
                onHoverStart={() => hasHover && setHovered(cert.title)}
                onHoverEnd={() => hasHover && setHovered(null)}
                className="relative rounded-xl overflow-hidden transition-shadow duration-300"
                style={{
                  background: dark
                    ? "linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))"
                    : "linear-gradient(150deg, rgba(0,0,0,0.06), rgba(0,0,0,0.015))",
                }}
              >
                <span
                  className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, var(--p-accent-ink), color-mix(in srgb, var(--p-accent-ink) 40%, transparent))", opacity: isHovered ? 1 : 0 }}
                />
                <div
                  className={`absolute inset-[1.5px] rounded-[10.5px] transition-colors duration-300 ${dark ? "bg-[color:var(--p-surface)]" : "bg-white"}`}
                />

                {/* Circuit-style corner accent */}
                <svg className="absolute top-0 right-0 w-20 h-20 opacity-[0.06] pointer-events-none z-10" viewBox="0 0 80 80" fill="none">
                  <path d="M80 0V20H60V40H40" stroke={dark ? "#fff" : "#000"} strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="2.5" fill={dark ? "#fff" : "#000"} />
                  <circle cx="60" cy="20" r="2.5" fill={dark ? "#fff" : "#000"} />
                </svg>

                {/* Shine sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  initial={false}
                  animate={{ x: isHovered ? "130%" : "-130%" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: "linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.16) 50%, transparent 60%)",
                    width: "60%",
                  }}
                />

                <div className="relative z-10 p-5">
                  <div className="flex items-start gap-4">
                    {/* Seal */}
                    <motion.div
                      className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "color-mix(in srgb, var(--p-secondary) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--p-secondary) 12%, transparent)" }}
                      animate={isHovered ? { y: [0, -3, 0] } : { y: 0 }}
                      transition={isHovered ? { duration: 1.1, ease: "easeInOut", repeat: hasHover ? Infinity : 0 } : { duration: 0.3 }}
                    >
                      <CertIcon size={19} className="text-black/70 dark:text-white/70" aria-hidden />
                    </motion.div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className={`font-body font-semibold text-sm leading-snug mb-1 ${dark ? "text-white" : "text-[color:var(--p-bg)]"}`}>
                        {cert.title}
                      </div>
                      <div className={`text-xs font-body ${dark ? "text-white/70" : "text-black/70"}`}>{cert.issuer}</div>
                    </div>
                  </div>

                  {/* Perforated divider */}
                  <div
                    className="my-4 h-px"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)"} 0 6px, transparent 6px 12px)`,
                    }}
                  />

                  <div className="flex items-center justify-between">
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        aria-label={`${t.certs_verified}: ${cert.title} (PDF)`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.certs_verify_hint}
                        /* `py-1.5 -my-1.5`: sem isso o alvo do link tinha 15px de altura, abaixo
                           do mínimo confortável para o toque, sem mudar nada no visual. */
                        className="flex items-center gap-1.5 py-1.5 -my-1.5 group/verify"
                      >
                        <BadgeCheck size={13} className={dark ? "text-white/70" : "text-black/58"} />
                        <span className={`text-xs font-body uppercase tracking-wide underline decoration-dotted underline-offset-2 transition-colors ${dark ? "text-white/70 decoration-white/30 group-hover/verify:text-white" : "text-black/70 decoration-brand-dark/40 group-hover/verify:text-black"}`}>
                          {t.certs_verified}
                        </span>
                        <ExternalLink size={9} className={`transition-colors ${dark ? "text-white/70 group-hover/verify:text-white" : "text-black/58 group-hover/verify:text-black"}`} />
                      </a>
                    ) : cert.inProgress ? (
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className={dark ? "text-white/70" : "text-black/58"} />
                        <span className={`text-xs font-body uppercase tracking-wide ${dark ? "text-white/70" : "text-black/70"}`}>{t.certs_in_progress}</span>
                      </div>
                    ) : (
                      /* Sem comprovante público: mostra só que foi concluído, sem o selo de
                         verificação, que sugeriria uma validação externa que não existe aqui. */
                      <div className="flex items-center gap-1.5">
                        <CircleCheck size={13} className={dark ? "text-white/35" : "text-black/58"} />
                        <span className={`text-xs font-body uppercase tracking-wide ${dark ? "text-white/50" : "text-black/70"}`}>{t.certs_completed}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {cert.hours && (
                        <span className={`text-xs font-mono2 px-1.5 py-0.5 rounded-lg ${dark ? "bg-white/[0.06] text-white/70" : "bg-black/[0.06] text-black/70"}`}>
                          {cert.hours}
                        </span>
                      )}
                      <span className={`text-xs font-mono2 ${dark ? "text-white/70" : "text-black/70"}`}>{cert.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
