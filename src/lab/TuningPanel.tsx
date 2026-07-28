import { useState } from "react";
import { STACK_HERO_DEFAULTS, type StackHeroConfig } from "../app/components/sections/StackHero";

/* Painel de ajuste, escondido por padrão. A tela abre como o site normal;
   isto só aparece se você clicar em "ajustes". */

type Field = { key: keyof StackHeroConfig; label: string; min: number; max: number; step: number };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Câmera / mundo 3D",
    fields: [
      { key: "perspective", label: "perspectiva (px)", min: 600, max: 3000, step: 50 },
      { key: "rotY", label: "rotação Y inicial", min: -60, max: 20, step: 1 },
      { key: "rotYEnd", label: "rotação Y final", min: -60, max: 20, step: 1 },
      { key: "rotX", label: "rotação X", min: -20, max: 25, step: 1 },
    ],
  },
  {
    title: "Cubo",
    fields: [
      { key: "cubeSize", label: "tamanho", min: 0.15, max: 0.7, step: 0.01 },
      { key: "cubeX", label: "posição X", min: 0.2, max: 0.9, step: 0.01 },
      { key: "cubeY", label: "posição Y", min: 0.2, max: 0.8, step: 0.01 },
      { key: "cubeDriftX", label: "deriva X", min: -0.25, max: 0.25, step: 0.01 },
      { key: "cubeShrink", label: "encolhe até", min: 0.5, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Leque de painéis",
    fields: [
      { key: "panelW", label: "largura", min: 0.14, max: 0.5, step: 0.01 },
      { key: "panelRatio", label: "proporção A/L", min: 0.7, max: 1.8, step: 0.02 },
      { key: "fanGap", label: "folga do cubo", min: 0.1, max: 0.6, step: 0.01 },
      { key: "fanX", label: "abertura X", min: 0, max: 0.3, step: 0.005 },
      { key: "fanY", label: "abertura Y", min: -0.15, max: 0.15, step: 0.005 },
      { key: "fanZ", label: "profundidade Z", min: -0.2, max: 0.2, step: 0.005 },
      { key: "thickness", label: "espessura do vidro", min: 0, max: 30, step: 1 },
      { key: "radius", label: "canto arredondado", min: 0, max: 40, step: 1 },
    ],
  },
  {
    title: "Tempo (fração do scroll)",
    fields: [
      { key: "pages", label: "altura (viewports)", min: 2, max: 7, step: 0.5 },
      { key: "tStart", label: "início", min: 0, max: 0.4, step: 0.01 },
      { key: "tStep", label: "intervalo", min: 0.04, max: 0.35, step: 0.01 },
      { key: "tDur", label: "duração", min: 0.06, max: 0.5, step: 0.01 },
    ],
  },
  {
    title: "Vidro / luz",
    fields: [
      { key: "glassTint", label: "opacidade do vidro", min: 0, max: 1, step: 0.02 },
      { key: "fanScale", label: "reducao por camada", min: 0.8, max: 1, step: 0.01 },
      { key: "glassBlur", label: "blur do vidro", min: 0, max: 24, step: 1 },
      { key: "rimGlow", label: "brilho das bordas", min: 0, max: 1.5, step: 0.05 },
      { key: "bgGlow", label: "brilho de fundo", min: 0, max: 1.5, step: 0.05 },
      { key: "dimInactive", label: "escurecer inativos", min: 0.1, max: 1, step: 0.05 },
    ],
  },
];

interface Props {
  cfg: StackHeroConfig;
  setCfg: (fn: (c: StackHeroConfig) => StackHeroConfig) => void;
  scrub: number | null;
  setScrub: (v: number | null) => void;
}

export function TuningPanel({ cfg, setCfg, scrub, setScrub }: Props) {
  const [open, setOpen] = useState(false);
  const set = (k: keyof StackHeroConfig, v: number | string) => setCfg(c => ({ ...c, [k]: v }));

  const toggleScrub = (on: boolean) => {
    if (on) {
      document.getElementById("stack")?.scrollIntoView();
      setScrub(0.5);
    } else {
      setScrub(null);
    }
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[60] px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-white/50 text-[11px] font-mono2 backdrop-blur hover:bg-white/[0.12] hover:text-white"
      >
        ajustes
      </button>
    );

  return (
    <div className="fixed top-3 right-3 z-[60] font-body w-[300px] max-h-[92vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0C0C10]/95 backdrop-blur p-4 space-y-4 shadow-2xl text-white">
      <div className="flex items-center justify-between">
        <span className="font-mono2 text-[11px] tracking-widest uppercase text-violet-400">stackhero</span>
        <button onClick={() => setOpen(false)} className="text-[11px] text-white/40 hover:text-white">
          fechar
        </button>
      </div>

      <div className="rounded-lg bg-white/[0.03] p-3 space-y-2">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={scrub != null} onChange={e => toggleScrub(e.target.checked)} />
          travar e arrastar na mão
        </label>
        {scrub != null && (
          <>
            <div className="flex justify-between text-[11px] text-white/50 font-mono2">
              <span>progresso</span>
              <span>{(scrub * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.005}
              value={scrub}
              onChange={e => setScrub(+e.target.value)}
              className="w-full"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select label="cubo" value={cfg.cubeMode} options={["css", "image"]} onChange={v => set("cubeMode", v)} />
        <Select label="labels" value={cfg.labelMode} options={["panel", "legend", "both"]} onChange={v => set("labelMode", v)} />
      </div>

      {GROUPS.map(g => (
        <div key={g.title} className="space-y-2">
          <p className="font-mono2 text-[10px] tracking-widest uppercase text-white/30 pt-1">{g.title}</p>
          {g.fields.map(f => (
            <div key={f.key}>
              <div className="flex justify-between text-[11px] text-white/50">
                <span>{f.label}</span>
                <span className="font-mono2 text-white/70">{+Number(cfg[f.key]).toFixed(3)}</span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={cfg[f.key] as number}
                onChange={e => set(f.key, +e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))}
          className="flex-1 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs"
        >
          copiar config
        </button>
        <button
          onClick={() => setCfg(() => STACK_HERO_DEFAULTS)}
          className="px-3 py-2 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-xs"
        >
          reset
        </button>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] text-white/50 mb-1">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-xs"
      >
        {options.map(o => (
          <option key={o} value={o} className="bg-[#0C0C10]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
