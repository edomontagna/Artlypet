import { useEffect, useState } from "react";

/**
 * Cursor-following gold radial glow. Desktop-only. Honors prefers-reduced-motion.
 * Sits at z-50, pointer-events-none, mix-blend-mode so it never blocks interaction.
 * One single fixed div, GPU-only (transform), no per-frame React state churn.
 */
export const CursorSpotlight = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // touch devices
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById("cursor-spotlight");
    if (!el) return;
    let raf = 0;
    let lastX = 0, lastY = 0;
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${lastX - 250}px, ${lastY - 250}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      id="cursor-spotlight"
      aria-hidden
      className="fixed left-0 top-0 z-50 pointer-events-none transition-opacity duration-300"
      style={{
        width: 500,
        height: 500,
        background: "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, hsl(var(--primary) / 0.06) 35%, transparent 65%)",
        mixBlendMode: "screen",
        willChange: "transform",
      }}
    />
  );
};
