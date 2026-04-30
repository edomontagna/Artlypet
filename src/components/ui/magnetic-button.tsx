import { forwardRef, useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * MagneticButton — pulls slightly toward the cursor on hover.
 * Uses Framer Motion's useMotionValue (not React state) to stay outside the render cycle
 * — the skill explicitly bans useState for continuous animations on mobile perf grounds.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, strength = 0.35, ...rest }, ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
    const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

    // Transform child translation to slightly less than parent for parallax depth.
    const childX = useTransform(springX, (v) => v * 0.45);
    const childY = useTransform(springY, (v) => v * 0.45);

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      x.set(relX * strength);
      y.set(relY * strength);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn("relative inline-flex items-center justify-center btn-press", className)}
        {...rest}
      >
        <motion.span style={{ x: childX, y: childY }} className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      </motion.button>
    );
  },
);

MagneticButton.displayName = "MagneticButton";
