import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Flame, GitFork, Github, Star, TrendingUp } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";
import { useCounter } from "../../hooks/useCounter";
import { useHasHover } from "../../hooks/useHasHover";

interface GitHubActivityProps {
  dark: boolean;
  t: Translation;
}

const GITHUB_USER = "nicolasdosantos";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

/** Real values pulled from the GitHub REST API + public contribution calendar for nicolasdosantos. */
const STATS = [
  { key: "repos", value: 41, icon: GitFork, color: "#8B5CF6" },
  { key: "contributions", value: 67, icon: Github, color: "#67E8F9" },
  { key: "streak", value: 2, icon: Flame, color: "#FB923C" },
  { key: "stars", value: 5, icon: Star, color: "#F0ABFC" },
] as const;

const TOP_LANGUAGES = [
  { name: "HTML", pct: 30, color: "#E34C26" },
  { name: "JavaScript", pct: 24, color: "#F1E05A" },
  { name: "C++", pct: 16, color: "#F34B7D" },
  { name: "Python", pct: 14, color: "#3572A5" },
  { name: "TypeScript", pct: 8, color: "#3178C6" },
  { name: "CSS", pct: 5, color: "#563D7C" },
  { name: "Blade", pct: 3, color: "#F7523F" },
];

/** Real monthly contribution totals (last 6 months) from github.com/users/nicolasdosantos/contributions. */
const MONTHLY_ACTIVITY = [
  { label: "Fev", count: 0 },
  { label: "Mar", count: 0 },
  { label: "Abr", count: 0 },
  { label: "Mai", count: 5 },
  { label: "Jun", count: 23 },
  { label: "Jul", count: 21 },
];
const RECENT_3M_TOTAL = 49;

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
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-colors duration-300 ${dark ? "bg-white/[0.06] group-hover:bg-white/[0.1]" : "bg-black/[0.06] group-hover:bg-black/[0.1]"}`}>
                <Github size={16} className={dark ? "text-white/70" : "text-black/70"} />
              </div>
              <span className={`text-sm font-mono2 ${dark ? "text-white/60" : "text-black/72"}`}>@{GITHUB_USER}</span>
              <ArrowUpRight size={14} className={`transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dark ? "text-white/40" : "text-black/45"}`} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-body font-medium text-white transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", boxShadow: "0 4px 20px -4px rgba(124,58,237,0.5)" }}
            >
              {t.github_cta}
            </a>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h4 className={`text-xs font-mono2 uppercase tracking-[0.15em] ${dark ? "text-white/40" : "text-black/50"}`}>
              {t.github_activity_label}
            </h4>
            <div className="flex items-center gap-1.5 text-xs font-mono2 text-emerald-400/90">
              <TrendingUp size={13} />
              <span className={dark ? "text-white/70" : "text-black/75"}>{RECENT_3M_TOTAL}</span>
              <span className={dark ? "text-white/40" : "text-black/50"}>{t.github_recent_note}</span>
            </div>
          </div>

          <div className="flex items-end gap-3 sm:gap-5 h-36 px-1">
            {MONTHLY_ACTIVITY.map((m, i) => {
              const max = Math.max(...MONTHLY_ACTIVITY.map((x) => x.count));
              const pct = m.count === 0 ? 4 : Math.max(10, (m.count / max) * 100);
              const active = m.count > 0;
              const id = `month-${i}`;
              return (
                <div key={m.label} className="relative flex-1 flex flex-col items-center h-full">
                  <div className="relative flex-1 w-full flex items-end">
                    <motion.div
                      className="relative w-full rounded-t-md"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      onHoverStart={() => hasHover && setHoveredCell(id)}
                      onHoverEnd={() => hasHover && setHoveredCell((c) => (c === id ? null : c))}
                      onClick={() => !hasHover && setHoveredCell((c) => (c === id ? null : id))}
                      style={{
                        background: active
                          ? "linear-gradient(180deg, #67E8F9, #7C3AED)"
                          : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        boxShadow: active ? "0 0 16px -2px rgba(124,58,237,0.45)" : "none",
                      }}
                    >
                      {hoveredCell === id && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-mono2 z-10 ${dark ? "bg-white text-black" : "bg-[#08080A] text-white"}`}
                        >
                          {m.count} {t.github_tooltip}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className={`mt-2 text-[10px] font-mono2 ${dark ? "text-white/35" : "text-black/45"}`}>{m.label}</span>
                </div>
              );
            })}
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
