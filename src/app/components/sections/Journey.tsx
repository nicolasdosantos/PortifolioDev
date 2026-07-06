import { motion } from "motion/react";
import type { SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { journeyItems } from "../../data";

export function Journey({ dark, t, lang }: SectionProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader label={t.journey_label} title={t.journey_title} dark={dark} />
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-violet-500/20 to-transparent" />
          <div className="space-y-10">
            {journeyItems.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-10"
              >
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-violet-500/20" />
                <div className={`text-xs font-mono2 mb-1 ${dark ? "text-violet-400" : "text-violet-600"}`}>{item.year}</div>
                <div className={`font-display font-semibold mb-1.5 ${dark ? "text-white" : "text-[#08080A]"}`}>{item.title[lang]}</div>
                <div className={`text-sm font-body ${dark ? "text-white/45" : "text-black/45"}`}>{item.desc[lang]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
