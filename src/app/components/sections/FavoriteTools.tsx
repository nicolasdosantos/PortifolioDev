import { motion } from "motion/react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { toolsList } from "../../data";

interface FavoriteToolsProps {
  dark: boolean;
  t: Translation;
}

export function FavoriteTools({ dark, t }: FavoriteToolsProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.tools_label} title={t.tools_title} dark={dark} />
        <div className="flex flex-wrap gap-3">
          {toolsList.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.06 }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border cursor-default transition-all duration-300 ${dark ? "bg-white/[0.025] border-white/[0.07] hover:border-violet-500/30 hover:shadow-[0_0_18px_rgba(124,58,237,0.1)]" : "bg-white border-black/[0.07] hover:border-violet-300 hover:shadow-[0_4px_18px_rgba(124,58,237,0.07)]"}`}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className={`text-sm font-body font-medium ${dark ? "text-white/65" : "text-black/65"}`}>{tool.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
