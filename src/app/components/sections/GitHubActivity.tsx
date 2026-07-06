import { useMemo } from "react";
import { Github } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface GitHubActivityProps {
  dark: boolean;
  t: Translation;
}

export function GitHubActivity({ dark, t }: GitHubActivityProps) {
  const grid = useMemo(() =>
    Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => Math.random())
    ), []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.github_label} title={t.github_title} dark={dark} />
        <div className={`p-8 rounded-2xl border ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}>
          <div className="flex items-center gap-3 mb-6">
            <a href="https://github.com/nicolasdosantos" target="_blank" rel="noreferrer" className="flex items-center gap-3">
              <Github size={18} className={dark ? "text-white/55" : "text-black/55"} />
              <span className={`text-sm font-mono2 ${dark ? "text-white/55" : "text-black/55"}`}>@nicolasdosantos</span>
            </a>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono2 bg-violet-500/10 text-violet-400 border border-violet-500/20">41 repositórios públicos</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((val, di) => {
                    const op = val < 0.3 ? 0.06 : val < 0.5 ? 0.22 : val < 0.7 ? 0.45 : val < 0.9 ? 0.7 : 1;
                    return (
                      <div
                        key={di}
                        className="w-3 h-3 rounded-sm transition-opacity duration-200 hover:opacity-100"
                        style={{ background: `rgba(124,58,237,${op})` }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
