import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface FAQProps {
  dark: boolean;
  t: Translation;
}

export function FAQ({ dark, t }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader label={t.faq_label} title={t.faq_title} dark={dark} />
        <div className="space-y-3">
          {t.faq_items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.07 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${openIdx === i
                ? dark ? "bg-white/[0.04] border-violet-500/20" : "bg-violet-50/60 border-violet-200"
                : dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.16]"
              }`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className={`font-body font-medium text-sm ${dark ? "text-white" : "text-[#08080A]"}`}>{item.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 ${dark ? "text-white/38" : "text-black/60"}`}
                >
                  <ChevronDown size={15} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-5 text-sm font-body ${dark ? "text-white/48" : "text-black/68"}`}>{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
