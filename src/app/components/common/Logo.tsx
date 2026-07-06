interface LogoProps {
  size?: number;
  className?: string;
}

/** Custom "NS" monogram mark: geometric N in brushed silver, flowing S in violet gradient. */
export function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#0F0F14] border border-white/10 ${className}`}
      style={{ width: size, height: size, boxShadow: "0 0 22px rgba(124,58,237,0.28)" }}
    >
      <svg width={size * 0.7} height={size * 0.58} viewBox="0 0 120 100" fill="none">
        <defs>
          <linearGradient id="logo-n-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAFAFB" />
            <stop offset="100%" stopColor="#A9A9BC" />
          </linearGradient>
          <linearGradient id="logo-s-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
        </defs>
        <path
          d="M10 85V15L45 85V15"
          stroke="url(#logo-n-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M108 15H72V50H108V85H72"
          stroke="url(#logo-s-grad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
