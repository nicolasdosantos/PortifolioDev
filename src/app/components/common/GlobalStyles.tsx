export function GlobalStyles() {
  return (
    <style>{`
      @keyframes aurora1 {
        0%, 100% { transform: translate(0,0) scale(1); opacity:0.7; }
        50%       { transform: translate(22%,18%) scale(1.15); opacity:0.9; }
      }
      @keyframes aurora2 {
        0%, 100% { transform: translate(0,0) scale(1); opacity:0.5; }
        50%       { transform: translate(-18%,22%) scale(1.2); opacity:0.7; }
      }
      @keyframes aurora3 {
        0%, 100% { transform: translate(0,0) scale(1); opacity:0.5; }
        50%       { transform: translate(12%,-22%) scale(0.9); opacity:0.7; }
      }
      .a1 { animation: aurora1 22s ease-in-out infinite; }
      .a2 { animation: aurora2 28s ease-in-out infinite; }
      .a3 { animation: aurora3 34s ease-in-out infinite; }

      html { cursor: none; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.7); }

      .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
      .font-body    { font-family: 'Inter', sans-serif; }
      .font-mono2   { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );
}
