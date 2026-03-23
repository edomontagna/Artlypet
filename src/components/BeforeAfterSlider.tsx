import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export const BeforeAfterSlider = ({ beforeUrl, afterUrl }: BeforeAfterSliderProps) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState(50);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    updatePosition(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>{t("share.before", "Before")}</span>
        <span>{t("share.after", "After")}</span>
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl cursor-col-resize select-none border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchMove={handleTouchMove}
        onKeyDown={handleKeyDown}
      >
        {/* After image (full) */}
        <img
          src={afterUrl}
          alt="After — AI portrait"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeUrl}
            alt="Before — Original photo"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Drag handle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-col-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={() => { isDragging.current = true; }}
          >
            <div className="flex items-center gap-0.5">
              <div className="w-0.5 h-4 bg-muted-foreground/40 rounded-full" />
              <div className="w-0.5 h-4 bg-muted-foreground/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none z-20"
            >
              &larr; {t("slider.dragHint", "Drag to compare")} &rarr;
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
