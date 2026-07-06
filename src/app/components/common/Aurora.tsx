export function Aurora({ dark }: { dark: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className={`a1 absolute -top-72 -left-72 w-[700px] h-[700px] rounded-full blur-[160px] ${dark ? "bg-violet-600/25" : "bg-violet-400/20"}`} />
      <div className={`a2 absolute top-1/2 -right-72 w-[550px] h-[550px] rounded-full blur-[130px] ${dark ? "bg-indigo-600/20" : "bg-purple-400/15"}`} />
      <div className={`a3 absolute -bottom-72 left-1/3 w-[500px] h-[500px] rounded-full blur-[110px] ${dark ? "bg-purple-700/22" : "bg-violet-300/18"}`} />
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}
