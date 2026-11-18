import { motion } from "motion/react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface DevProcessProps {
  dark: boolean;
  t: Translation;
}

/* Lista editorial em vez de seis cards: em 6 colunas cada card ficava estreito e alto, e
   no celular "Desenvolvimento" quebrava no meio da palavra. São 3 colunas no desktop, 2 no
   tablet e 1 no celular. Cada passo entra subindo, com um traço em vinho que se desenha
   sobre o fio do topo e cresce até a largura toda no hover. */
export function DevProcess({ dark, t }: DevProcessProps) {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.process_label} title={t.process_title} dark={dark} />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {t.process_steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative pt-5 border-t ${dark ? "border-white/[0.12]" : "border-black/[0.14]"}`}
            >
              {/* traço em vinho que se desenha sobre o fio ao entrar e cresce no hover */}
              <motion.span
                aria-hidden
                className="absolute -top-px left-0 h-px w-12 origin-left bg-brand-ink transition-[width] duration-500 group-hover:w-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.2 + (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm font-mono2 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5">{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`font-display font-semibold text-lg ${dark ? "text-white/90" : "text-black/85"}`}>{step.title}</h3>
              </div>
              <p className={`text-sm font-body leading-relaxed max-w-[34ch] ${dark ? "text-white/70" : "text-black/70"}`}>{step.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
