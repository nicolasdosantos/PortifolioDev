import type { Translation } from "../../types";
import { useCounter } from "../../hooks/useCounter";

interface StatsProps {
  dark: boolean;
  t: Translation;
}

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  dark: boolean;
}

function StatItem({ value, suffix, label, dark }: StatItemProps) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className={`font-display text-4xl md:text-5xl font-bold tabular-nums mb-2 ${dark ? "text-white" : "text-[#08080A]"}`}>
        {count}{suffix}
      </div>
      <div className={`text-xs font-mono2 ${dark ? "text-violet-400" : "text-violet-600"}`}>{label}</div>
    </div>
  );
}

export function Stats({ dark, t }: StatsProps) {
  const items = [
    { v: 4, s: "", l: t.stat_projects },
    { v: 41, s: "", l: t.stat_commits },
    { v: 15, s: "+", l: t.stat_techs },
    { v: 3, s: "+", l: t.stat_years },
    { v: 6, s: "", l: t.stat_certs },
  ];
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`rounded-2xl border p-8 md:p-14 ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {items.map(({ v, s, l }) => <StatItem key={l} value={v} suffix={s} label={l} dark={dark} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
