/**
 * Inline SVG brand mark — replaces /icons/logo.jpg in Navbar/Footer.
 * Reads colors from currentColor + CSS var(--primary) so it adapts to any theme.
 * No raster image = no white square showing on dark backgrounds.
 */
type Props = {
  className?: string;
  /** Show wordmark next to the icon */
  withWordmark?: boolean;
};

export const BrandMark = ({ className = "", withWordmark = true }: Props) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon: a stylized "A" with a paw-print negative space cut */}
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 lg:h-8 lg:w-8"
        aria-hidden
        fill="none"
      >
        {/* Background tile, gold */}
        <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
        {/* Letter A in dark, sharp */}
        <path
          d="M16 7 L23.5 24 L20 24 L18.6 20.5 L13.4 20.5 L12 24 L8.5 24 L16 7 Z M14.4 18 L17.6 18 L16 14 L14.4 18 Z"
          fill="hsl(var(--primary-foreground))"
        />
      </svg>

      {withWordmark && (
        <span
          className="font-bold text-foreground tracking-tight text-[1.25rem] lg:text-[1.35rem]"
          style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
        >
          Artlypet
        </span>
      )}
    </span>
  );
};
