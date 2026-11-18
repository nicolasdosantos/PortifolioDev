import { motion } from "motion/react";
import { Clock, ExternalLink } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { certificates, completedCertificates } from "../../data";

interface CertificatesProps {
  dark: boolean;
  t: Translation;
}

export function Certificates({ dark, t }: CertificatesProps) {
  const totalHours = certificates.reduce((sum, c) => sum + (c.hours ? parseInt(c.hours) : 0), 0);
  const institutions = new Set(certificates.map((c) => c.issuer)).size;

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

        {/* Card limpo: ícone, título e instituição, e uma linha só de informações (status,
            horas, ano). Antes eram borda em degradê, selo que pulava, divisória tracejada e uma
            segunda faixa de status: pesado e repetido oito vezes. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert, i) => {
            const CertIcon = cert.icon;
            const meta = [cert.hours, cert.year].filter(Boolean).join(" · ");
            return (
              <motion.article
                key={cert.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className={`flex gap-4 p-5 rounded-xl border ${dark ? "bg-[color:var(--p-surface)] border-white/[0.08]" : "bg-white border-black/[0.12]"}`}
              >
                <span
                  className={`shrink-0 grid place-items-center w-10 h-10 rounded-lg ${dark ? "bg-white/[0.05] text-white/70" : "bg-black/[0.05] text-black/70"}`}
                  aria-hidden
                >
                  <CertIcon size={18} />
                </span>
                <div className="min-w-0 flex-1 flex flex-col">
                  <h3 className={`font-body font-semibold text-sm leading-snug ${dark ? "text-white/90" : "text-black/85"}`}>{cert.title}</h3>
                  <p className={`text-sm font-body mt-0.5 ${dark ? "text-white/70" : "text-black/70"}`}>{cert.issuer}</p>
                  <div className={`mt-auto pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${dark ? "text-white/50" : "text-black/58"}`}>
                    <span className="font-mono2">{meta}</span>
                    {cert.inProgress ? (
                      <span className="inline-flex items-center gap-1 font-body text-brand-ink">
                        <Clock size={12} aria-hidden /> {t.certs_in_progress}
                      </span>
                    ) : cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.certs_verify_hint}
                        aria-label={`${t.certs_verified}: ${cert.title} (PDF)`}
                        /* alvo de toque maior sem mudar o visual */
                        className={`inline-flex items-center gap-1 py-1.5 -my-1.5 font-body underline underline-offset-2 transition-colors ${dark ? "decoration-white/25 hover:text-white" : "decoration-black/25 hover:text-black"}`}
                      >
                        {t.certs_verified} <ExternalLink size={11} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
