export function GlobalStyles() {
  return (
    <style>{`
      @keyframes glowPulse {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .glow-pulse { animation: glowPulse 2.6s ease-in-out infinite; }
      .text-shimmer {
        background-size: 200% auto;
        animation: shimmer 5s linear infinite;
      }
      /* Brilho do nome no Hero: a faixa clara (secundária) atravessa o destaque. As duas
         pontas do degradê têm a mesma cor, então o ciclo recomeça sem salto. Anima só
         background-position num trecho pequeno de texto, sem filtro. */
      @keyframes nameSweep {
        from { background-position: 200% 0; }
        to   { background-position: 0% 0; }
      }
      .name-sweep {
        background-image: linear-gradient(90deg, var(--p-accent-ink) 0%, var(--p-accent-ink) 30%, var(--p-secondary) 50%, var(--p-accent-ink) 70%, var(--p-accent-ink) 100%);
        background-size: 200% 100%;
        animation: nameSweep 6s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .name-sweep { animation: none; }
      }

      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--p-accent-ink); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--p-secondary); }

      .font-display { font-family: 'Sora', sans-serif; }
      .font-body    { font-family: 'Inter', sans-serif; }
      .font-mono2   { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );
}
