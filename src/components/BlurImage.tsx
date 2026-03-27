import { useState } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const BlurImage = ({ src, alt, className, aspectRatio }: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectRatio, className)}>
      {/* Blurred placeholder */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/5" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
        )}
      />
    </div>
  );
};
