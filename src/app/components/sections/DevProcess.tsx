import { motion } from "motion/react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface DevProcessProps {
  dark: boolean;
  t: Translation;
}

/* Lista editorial em vez de seis cards: em 6 colunas cada card ficava estreito e alto, e no
   celular "Desenvolvimento" quebrava no meio da palavra. Aqui são 3 colunas no desktop (2
   linhas), 2 no tablet e 1 no celular; cada passo tem um fio no topo, número e título na
   mesma linha e a descrição embaixo. Sem caixa, sem ícone e sem hover: não é clicável. */
export function DevProcess({ dark, t }: DevProcessProps) {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.process_label} title={t.process_title} dark={dark} />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {t.process_steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`pt-5 border-t ${dark ? "border-white/[0.12]" : "border-black/[0.14]"}`}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm font-mono2 text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
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
