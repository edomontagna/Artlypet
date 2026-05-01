import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

type Props = {
  /** Target number to animate to */
  to: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Format the displayed value (e.g. add separators, suffix) */
  format?: (n: number) => string;
  className?: string;
  /** Trigger on first view rather than on mount */
  triggerOnView?: boolean;
};

/**
 * Counter that animates from 0 to `to` with a cubic ease-out.
 * Respects prefers-reduced-motion (instantly shows the final value).
 * Defaults to triggering on first scroll into view, so off-screen counters don't fire.
 */
export const AnimatedCounter = ({
  to,
  duration = 1.2,
  format = (n) => n.toLocaleString("it-IT"),
  className,
  triggerOnView = true,
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState<string>(format(0));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (triggerOnView && !inView) return;
    fired.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || duration <= 0) {
      setDisplay(format(to));
      return;
    }

    const controls = animate(motionVal, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(format(Math.round(latest))),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};
