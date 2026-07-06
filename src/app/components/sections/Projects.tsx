import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project, ProjectStatus, SectionProps } from "../../types";
import { SectionHeader } from "../common";
import { projects } from "../../data";

const STATUS_STYLE: Record<ProjectStatus, string> = {
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  in_progress: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export function Projects({ dark, t, lang }: SectionProps) {
  const [sel, setSel] = useState<Project | null>(null);
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <section id="projetos" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label={t.projects_label} title={t.projects_title} dark={dark} />

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div
              onClick={() => setSel(featured)}
              className={`group cursor-pointer h-full rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)] ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}
            >
              <div className="relative overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-mono2">★ Featured</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-display text-xl font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{featured.title}</h3>
                    <span className={`text-xs font-mono2 ${dark ? "text-white/35" : "text-black/35"}`}>{featured.category} · {featured.year}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs border ${STATUS_STYLE[featured.status]}`}>{t[featured.status]}</span>
                </div>
                <p className={`text-sm font-body mb-4 ${dark ? "text-white/48" : "text-black/48"}`}>{featured.description[lang]}</p>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded-md text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/45" : "border-black/10 bg-black/[0.04] text-black/45"}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-5">
            {rest.slice(0, 2).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSel(p)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(124,58,237,0.1)] ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}
              >
                <div className="relative overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/50 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-display font-bold text-sm ${dark ? "text-white" : "text-[#08080A]"}`}>{p.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs border ${STATUS_STYLE[p.status]}`}>{t[p.status]}</span>
                  </div>
                  <p className={`text-xs font-body mb-3 ${dark ? "text-white/38" : "text-black/38"}`}>{p.description[lang]}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`px-2 py-0.5 rounded text-xs font-mono2 ${dark ? "bg-white/[0.05] text-white/38" : "bg-black/[0.04] text-black/38"}`}>{tag}</span>
                    ))}
                    {p.tags.length > 3 && <span className={`text-xs font-mono2 ${dark ? "text-white/28" : "text-black/28"}`}>+{p.tags.length - 3}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setSel(rest[2])}
            className={`lg:col-span-3 group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(124,58,237,0.1)] ${dark ? "bg-white/[0.025] border-white/[0.07]" : "bg-white border-black/[0.07]"}`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative overflow-hidden md:w-72 flex-shrink-0">
                <img src={rest[2].image} alt={rest[2].title} className="w-full h-44 md:h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-mono2 ${dark ? "text-violet-400" : "text-violet-600"}`}>{rest[2].category}</span>
                  <span className={`px-2 py-0.5 rounded text-xs border ${STATUS_STYLE[rest[2].status]}`}>{t[rest[2].status]}</span>
                </div>
                <h3 className={`font-display text-xl font-bold mb-2 ${dark ? "text-white" : "text-[#08080A]"}`}>{rest[2].title}</h3>
                <p className={`text-sm font-body mb-4 max-w-xl ${dark ? "text-white/48" : "text-black/48"}`}>{rest[2].description[lang]}</p>
                <div className="flex flex-wrap gap-2">
                  {rest[2].tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/45" : "border-black/10 bg-black/[0.04] text-black/45"}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSel(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
              className={`relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border ${dark ? "bg-[#0F0F14] border-white/[0.08]" : "bg-white border-black/[0.08]"}`}
            >
              <div className="relative">
                <img src={sel.image} alt={sel.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F14] to-transparent" />
                <button onClick={() => setSel(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
                  <X size={17} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className={`font-display text-2xl font-bold ${dark ? "text-white" : "text-[#08080A]"}`}>{sel.title}</h2>
                    <span className={`text-sm font-mono2 ${dark ? "text-white/38" : "text-black/38"}`}>{sel.category} · {sel.year}</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={sel.github} className={`p-2.5 rounded-xl border transition-colors ${dark ? "border-white/10 text-white/55 hover:text-white hover:bg-white/[0.05]" : "border-black/10 text-black/55 hover:text-black hover:bg-black/[0.04]"}`}><Github size={16} /></a>
                    <a href={sel.demo} className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors"><ExternalLink size={16} /></a>
                  </div>
                </div>
                <p className={`text-sm font-body leading-relaxed mb-7 ${dark ? "text-white/55" : "text-black/55"}`}>{sel.fullDesc[lang]}</p>
                <div className="grid sm:grid-cols-3 gap-4 mb-7">
                  {[
                    { lbl: lang === "pt" ? "Problema" : "Problem", txt: sel.problem[lang] },
                    { lbl: lang === "pt" ? "Solução" : "Solution", txt: sel.solution[lang] },
                    { lbl: lang === "pt" ? "Resultado" : "Results", txt: sel.results[lang] },
                  ].map(({ lbl, txt }) => (
                    <div key={lbl} className={`p-4 rounded-xl border ${dark ? "bg-white/[0.03] border-white/[0.07]" : "bg-black/[0.02] border-black/[0.07]"}`}>
                      <div className={`text-xs font-mono2 mb-2 ${dark ? "text-violet-400" : "text-violet-600"}`}>{lbl}</div>
                      <div className={`text-xs font-body leading-relaxed ${dark ? "text-white/55" : "text-black/55"}`}>{txt}</div>
                    </div>
                  ))}
                </div>
                <div className={`text-xs font-mono2 mb-3 ${dark ? "text-white/35" : "text-black/35"}`}>STACK</div>
                <div className="flex flex-wrap gap-2">
                  {sel.tags.map(tag => (
                    <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-mono2 border ${dark ? "border-white/10 bg-white/[0.04] text-white/55" : "border-black/10 bg-black/[0.04] text-black/55"}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
