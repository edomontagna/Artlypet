import { motion, useScroll, useSpring } from "framer-motion";

/**
 * 2px gold progress bar that grows as the user scrolls the page.
 * Spring-smoothed so it doesn't twitch with high-frequency scroll events.
 * Place inside the navbar (after the bottom border) for a financial-app feel.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "left" }}
      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
    />
  );
};
