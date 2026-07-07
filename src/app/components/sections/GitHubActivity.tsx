import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Flame, GitFork, Github, Star } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { useCounter } from "../../hooks/useCounter";
import { useHasHover } from "../../hooks/useHasHover";

interface GitHubActivityProps {
  dark: boolean;
  t: Translation;
}

const STATS = [
  { key: "repos", value: 41, icon: GitFork, color: "#8B5CF6" },
  { key: "contributions", value: 860, icon: Github, color: "#67E8F9" },
  { key: "streak", value: 12, icon: Flame, color: "#FB923C" },
  { key: "stars", value: 27, icon: Star, color: "#F0ABFC" },
] as const;

const TOP_LANGUAGES = [
  { name: "TypeScript", pct: 38, color: "#3178C6" },
  { name: "PHP", pct: 26, color: "#777BB4" },
  { name: "JavaScript", pct: 18, color: "#F7DF1E" },
  { name: "Python", pct: 12, color: "#3776AB" },
  { name: "CSS", pct: 6, color: "#38BDF8" },
];

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function StatCard({ stat, label, dark, index }: { stat: (typeof STATS)[number]; label: string; dark: boolean; index: number }) {
  const { count, ref } = useCounter(stat.value, 1400);
  const hasHover = useHasHover();
  const Icon = stat.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={hasHover ? { y: -4, transition: { duration: 0.25, ease: "easeOut" } } : undefined}
      className="relative p-5 rounded-2xl transition-shadow duration-300"
      style={{
        background: dark
          ? "linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))"
          : "linear-gradient(150deg, rgba(0,0,0,0.06), rgba(0,0,0,0.015))",
      }}
    >
      <span
        className="absolute inset-[1.5px] rounded-[14px] pointer-events-none"
        style={{ background: dark ? "#0d0d12" : "#ffffff" }}
      />
      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
          style={{ background: `${stat.color}1f`, color: stat.color }}
        >
          <Icon size={18} />
        </div>
        <div className={`font-display text-3xl font-bold tabular-nums ${dark ? "text-white" : "text-[#08080A]"}`}>
          {count}
          {stat.key === "streak" ? "d" : "+"}
        </div>
        <div className={`text-xs font-body mt-1.5 ${dark ? "text-white/45" : "text-black/60"}`}>{label}</div>
      </div>
    </motion.div>
  );
}

export function GitHubActivity({ dark, t }: GitHubActivityProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const hasHover = useHasHover();

  const grid = useMemo(() => {
    const seeded = (i: number, j: number) => {
      const x = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 52 }, (_, wi) => {
      const recentBoost = wi > 42 ? 0.18 : 0;
      return Array.from({ length: 7 }, (_, di) => Math.min(1, seeded(wi, di) + recentBoost));
    });
  }, []);

  const levelOf = (val: number) => (val < 0.35 ? 0 : val < 0.55 ? 1 : val < 0.72 ? 2 : val < 0.88 ? 3 : 4);
  const countOf = (level: number) => [0, 1, 3, 6, 10][level];
  const colorOf = (level: number, dark: boolean) => {
    const darkScale = ["rgba(255,255,255,0.06)", "#4C1D95", "#6D28D9", "#8B5CF6", "#C4B5FD"];
    const lightScale = ["rgba(0,0,0,0.06)", "#DDD6FE", "#A78BFA", "#7C3AED", "#5B21B6"];
    return (dark ? darkScale : lightScale)[level];
  };

  const statLabels: Record<string, string> = {
    repos: t.github_repos,
    contributions: t.github_contributions,
    streak: t.github_streak,
    stars: t.github_stars,
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.github_label} title={t.github_title} dark={dark} />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`max-w-xl -mt-10 mb-10 text-sm font-body leading-relaxed ${dark ? "text-white/45" : "text-black/60"}`}
        >
          {t.github_subtitle}
        </motion.p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.key} stat={stat} label={statLabels[stat.key]} dark={dark} index={i} />
          ))}
        </div>

        {/* Contribution heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`p-6 sm:p-8 rounded-2xl border mb-6 ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.16]"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <a href="https://github.com/nicolasdosantos" target="_blank" rel="noreferrer" className="group flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-colors duration-300 ${dark ? "bg-white/[0.06] group-hover:bg-white/[0.1]" : "bg-black/[0.06] group-hover:bg-black/[0.1]"}`}>
                <Github size={16} className={dark ? "text-white/70" : "text-black/70"} />
              </div>
              <span className={`text-sm font-mono2 ${dark ? "text-white/60" : "text-black/72"}`}>@nicolasdosantos</span>
              <ArrowUpRight size={14} className={`transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dark ? "text-white/40" : "text-black/45"}`} />
            </a>
            <a
              href="https://github.com/nicolasdosantos"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-body font-medium text-white transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", boxShadow: "0 4px 20px -4px rgba(124,58,237,0.5)" }}
            >
              {t.github_cta}
            </a>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-max">
              <div className={`flex gap-1 mb-1.5 text-[10px] font-mono2 ${dark ? "text-white/30" : "text-black/40"}`}>
                {MONTHS.map((m) => (
                  <span key={m} style={{ width: `${(52 / 12) * 16}px` }}>{m}</span>
                ))}
              </div>
              <div className="flex gap-1">
                {grid.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((val, di) => {
                      const level = levelOf(val);
                      const id = `${wi}-${di}`;
                      return (
                        <motion.div
                          key={di}
                          initial={{ opacity: 0, scale: 0.4 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.25, delay: wi * 0.012 }}
                          whileHover={hasHover ? { scale: 1.35 } : undefined}
                          onHoverStart={() => hasHover && setHoveredCell(id)}
                          onHoverEnd={() => hasHover && setHoveredCell((c) => (c === id ? null : c))}
                          onClick={() => !hasHover && setHoveredCell((c) => (c === id ? null : id))}
                          className="relative w-3 h-3 rounded-sm cursor-default"
                          style={{
                            background: colorOf(level, dark),
                            boxShadow: level > 2 ? `0 0 6px ${dark ? "rgba(196,181,253,0.5)" : "rgba(124,58,237,0.35)"}` : "none",
                          }}
                        >
                          {hoveredCell === id && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-mono2 z-10 ${dark ? "bg-white text-black" : "bg-[#08080A] text-white"}`}
                            >
                              {countOf(level)} {t.github_tooltip}
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className={`flex items-center gap-1.5 mt-3 justify-end text-[10px] font-mono2 ${dark ? "text-white/30" : "text-black/40"}`}>
                <span>{t.github_legend_less}</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span key={lvl} className="w-2.5 h-2.5 rounded-sm" style={{ background: colorOf(lvl, dark) }} />
                ))}
                <span>{t.github_legend_more}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top languages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className={`p-6 sm:p-8 rounded-2xl border ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.16]"}`}
        >
          <h4 className={`text-xs font-mono2 uppercase tracking-[0.15em] mb-4 ${dark ? "text-white/40" : "text-black/50"}`}>
            {t.github_top_lang}
          </h4>
          <div className={`flex h-2.5 rounded-full overflow-hidden mb-4 ${dark ? "bg-white/[0.06]" : "bg-black/[0.08]"}`}>
            {TOP_LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                style={{ background: lang.color }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {TOP_LANGUAGES.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-xs font-body">
                <span className="w-2 h-2 rounded-full" style={{ background: lang.color }} />
                <span className={dark ? "text-white/60" : "text-black/70"}>{lang.name}</span>
                <span className={dark ? "text-white/30" : "text-black/40"}>{lang.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
