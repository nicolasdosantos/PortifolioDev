import { motion } from "motion/react";

interface LogoProps {
  size?: number;
  className?: string;
}

/** Brand mark: a code-styled "N" monogram with an animated gradient edge and a terminal cursor accent. */
export function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[10px] bg-transparent overflow-hidden ${className}`}
      style={{ width: size, height: size, boxShadow: "0 0 22px rgba(124,58,237,0.28)" }}
    >
      <div
        className="absolute inset-0 rounded-[10px] overflow-hidden"
        style={{
          padding: 2,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: "220%",
            height: "220%",
            top: "-60%",
            left: "-60%",
            background: "conic-gradient(from 0deg, #8B5CF6, #67E8F9, #8B5CF6)",
            willChange: "transform",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <svg width={size * 0.5} height={size * 0.44} viewBox="0 0 100 100" fill="none" className="relative z-10">
        <defs>
          <linearGradient id="logo-n-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>
        </defs>
        <path
          d="M28 72V28L72 72V28"
          stroke="url(#logo-n-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <motion.span
        className="absolute bottom-[16%] right-[14%] w-[9%] h-[16%] rounded-[1px] bg-[#67E8F9]"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
