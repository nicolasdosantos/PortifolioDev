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

      @media (hover: hover) and (pointer: fine) {
        html { cursor: none; }
      }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #C4B5FD, #67E8F9); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #DDD6FE, #A5F3FC); }

      .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
      .font-body    { font-family: 'Inter', sans-serif; }
      .font-mono2   { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );
}
