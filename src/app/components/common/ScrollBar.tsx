import { motion, useScroll, useSpring } from "motion/react";

export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-400"
      style={{ scaleX }}
    />
  );
}
