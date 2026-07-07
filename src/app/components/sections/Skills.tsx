import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SectionProps } from "../../types";
import { GradientIcon, SectionHeader } from "../common";
import { skillCategories } from "../../data";

export function Skills({ dark, t, lang }: SectionProps) {
  const [active, setActive] = useState("frontend");
  const [hovered, setHovered] = useState<string | null>(null);
  const cat = skillCategories.find(c => c.id === active)!;

  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.skills_label} title={t.skills_title} dark={dark} />
        <div className="flex flex-wrap gap-2 mb-10">
          {skillCategories.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all duration-300 ${active === c.id
                  ? "bg-violet-600 border-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  : dark
                    ? "border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05]"
                    : "border-black/10 text-black/50 hover:text-black hover:bg-black/[0.05]"
                }`}
              >
                <Icon size={14} /> {c.label[lang]}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {cat.skills.map((skill, i) => {
              const SkillIcon = skill.icon;
              const brand = (dark ? skill.color : skill.lightColor ?? skill.color) || skill.color;
              const isHovered = hovered === skill.name;
              const gradientColors = skill.colors && skill.colors.length > 1 ? skill.colors : [brand, brand];
              const gradientCss = `linear-gradient(135deg, ${gradientColors.join(", ")})`;
              const glowFrom = gradientColors[0];
              const glowTo = gradientColors[gradientColors.length - 1];
              return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.25, ease: "easeOut" } }}
                onHoverStart={() => setHovered(skill.name)}
                onHoverEnd={() => setHovered(null)}
                className="relative p-5 rounded-2xl cursor-default transition-shadow duration-300"
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
                  className="relative z-10 w-9 h-9 rounded-xl mb-4 flex items-center justify-center transition-colors duration-300"
                  style={{ background: isHovered ? `${brand}22` : cat.color + "22", color: !isHovered ? cat.color : undefined }}
                >
                  {isHovered ? (
                    <GradientIcon icon={SkillIcon} colors={gradientColors} size={18} />
                  ) : (
                    <SkillIcon size={18} />
                  )}
                </div>
                <div
                  className={`relative z-10 font-body font-semibold text-sm mb-1 transition-colors duration-300 ${!isHovered && (dark ? "text-white" : "text-[#08080A]")}`}
                  style={isHovered ? { backgroundImage: gradientCss, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : undefined}
                >
                  {skill.name}
                </div>
                <div className={`relative z-10 text-xs mb-3 font-body ${dark ? "text-white/38" : "text-black/40"}`}>{skill.desc}</div>
                <div className={`relative z-10 h-1 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-black/8"}`}>
                  <motion.div
                    className="h-full rounded-full transition-colors duration-300"
                    style={{ background: isHovered ? gradientCss : cat.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.05 }}
                  />
                </div>
                <div className={`relative z-10 text-xs font-mono2 mt-1.5 ${dark ? "text-white/28" : "text-black/30"}`}>{skill.level}%</div>
              </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
