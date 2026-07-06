import { motion } from "motion/react";
import { Award } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { certificates } from "../../data";

interface CertificatesProps {
  dark: boolean;
  t: Translation;
}

export function Certificates({ dark, t }: CertificatesProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.certs_label} title={t.certs_title} dark={dark} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/25" : "bg-white border-black/[0.07] hover:border-violet-200"}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cert.color + "22" }}>
                  <Award size={17} style={{ color: cert.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-body font-semibold text-sm mb-0.5 truncate ${dark ? "text-white" : "text-[#08080A]"}`}>{cert.title}</div>
                  <div className={`text-xs font-body ${dark ? "text-white/38" : "text-black/38"}`}>{cert.issuer}</div>
                </div>
                <div className={`text-xs font-mono2 flex-shrink-0 ${dark ? "text-violet-400" : "text-violet-600"}`}>{cert.year}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
