import { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

interface GradientIconProps {
  icon: IconType | LucideIcon;
  colors: string[];
  size: number;
  className?: string;
}

/** Renders a brand icon filled with its real multi-color gradient by using the icon's own SVG shape as a mask. */
export function GradientIcon({ icon: Icon, colors, size, className }: GradientIconProps) {
  const maskUrl = useMemo(() => {
    const markup = renderToStaticMarkup(<Icon size={size} color="#000" />);
    return `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;
  }, [Icon, size]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${colors.join(", ")})`,
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
