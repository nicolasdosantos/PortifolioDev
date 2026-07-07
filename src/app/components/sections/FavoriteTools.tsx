import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Translation } from "../../types";
import { GradientIcon, SectionHeader } from "../common";
import { toolCategories } from "../../data";
import { useHasHover } from "../../hooks/useHasHover";

interface FavoriteToolsProps {
  dark: boolean;
  t: Translation;
}

export function FavoriteTools({ dark, t }: FavoriteToolsProps) {
  const [active, setActive] = useState(toolCategories[0].label);
  const [hovered, setHovered] = useState<string | null>(null);
  const hasHover = useHasHover();
  const cat = toolCategories.find(c => c.label === active)!;

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.tools_label} title={t.tools_title} dark={dark} />
        <div className="flex flex-wrap gap-2 mb-10">
          {toolCategories.map(c => {
            const CatIcon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => setActive(c.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-300 ${active === c.label
                  ? "bg-violet-600 border-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  : dark
                    ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]"
                    : "border-black/10 text-black/50 hover:text-black hover:bg-black/[0.05]"
                }`}
              >
                <CatIcon size={14} /> {c.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {cat.tools.map((tool, i) => {
              const ToolIcon = tool.icon;
              const brand = (dark ? tool.color : tool.lightColor ?? tool.color) || tool.color;
              const isHovered = hasHover ? hovered === tool.name : true;
              const gradientColors = tool.colors && tool.colors.length > 1 ? tool.colors : [brand, brand];
              const gradientCss = `linear-gradient(135deg, ${gradientColors.join(", ")})`;
              const glowFrom = gradientColors[0];
              const glowTo = gradientColors[gradientColors.length - 1];

              return (
                <motion.a
                  key={tool.name}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Documentação de ${tool.name}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, delay: i * 0.05 }}
                  whileHover={hasHover ? { y: -5, scale: 1.03, transition: { duration: 0.25, ease: "easeOut" } } : undefined}
                  onHoverStart={() => hasHover && setHovered(tool.name)}
                  onHoverEnd={() => hasHover && setHovered(null)}
                  className="relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl transition-shadow duration-300"
                  style={{
                    background: dark
                      ? "linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))"
                      : "linear-gradient(150deg, rgba(0,0,0,0.06), rgba(0,0,0,0.015))",
                    boxShadow: isHovered ? `0 10px 30px -8px ${glowFrom}66, 0 10px 30px -8px ${glowTo}4d` : "none",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
                    style={{ background: gradientCss, opacity: isHovered ? 1 : 0 }}
                  />
                  <span
                    className="absolute inset-[1.5px] rounded-[14px] transition-colors duration-300 pointer-events-none"
                    style={{ background: dark ? "#0d0d12" : "#ffffff" }}
                  />

                  <div
                    className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{ background: isHovered ? `${brand}22` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
                  >
                    {isHovered ? (
                      <GradientIcon icon={ToolIcon} colors={gradientColors} size={20} />
                    ) : (
                      <ToolIcon
                        size={20}
                        className="transition-colors duration-300"
                        style={{ color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}
                      />
                    )}
                  </div>
                  <span
                    className="relative z-10 text-sm font-body font-medium transition-colors duration-300"
                    style={
                      isHovered
                        ? { backgroundImage: gradientCss, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                        : { color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }
                    }
                  >
                    {tool.name}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
