import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurImage } from "@/components/BlurImage";

const fallbackStyles = [
  { id: "1", name: "Renaissance",   description: "Nobile, dipinto a olio. Lo stile-icona di Artlypet.", preview_url: "/images/renaissance.webp" },
  { id: "2", name: "Watercolor",    description: "Acquerello morbido, grana di carta vintage.",         preview_url: "/images/watercolor.webp" },
  { id: "3", name: "Pop Art",       description: "Colori piatti, halftone, energia anni '60.",          preview_url: "/images/pop-art.webp" },
  { id: "4", name: "Art Nouveau",   description: "Linee sinuose, ornamento liberty.",                   preview_url: "/images/art-nouveau.webp" },
  { id: "5", name: "Impressionist", description: "Pennellate spezzate, luce screziata.",                preview_url: "/images/impressionist.webp" },
  { id: "6", name: "Oil Painting",  description: "Texture ricca, sotto-toni caldi.",                    preview_url: "/images/oil-painting.jpg" },
];

const ease = [0.16, 1, 0.3, 1] as const;

// Cursor-aware tilt — RAF-throttled, no React state.
const tiltRafMap = new WeakMap<HTMLDivElement, number>();
const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const cx = e.clientX, cy = e.clientY;
  const prev = tiltRafMap.get(target);
  if (prev) cancelAnimationFrame(prev);
  tiltRafMap.set(target, requestAnimationFrame(() => {
    const r = target.getBoundingClientRect();
    const x = (cx - r.left) / r.width - 0.5;
    const y = (cy - r.top) / r.height - 0.5;
    target.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.015)`;
  }));
};
const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)";
};

const GallerySection = memo(() => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: dbStyles, isLoading } = useStyles();
  const styles = (dbStyles && dbStyles.length > 0 ? dbStyles : fallbackStyles).slice(0, 6);

  const onTry = () => navigate(session ? "/generate" : "/signup");

  return (
    <section
      id="gallery"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="gallery-heading"
    >
      {/* Subtle warm wash that ties the section to the hero above */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/3 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
      />

      <div className="container relative px-5 lg:px-10">
        {/* Header — Goiko-style: kicker + bold display + concise sub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease }}
              className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary"
            >
              · I 12 stili
            </motion.span>
            <motion.h2
              id="gallery-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="mt-4 font-bold tracking-tightest leading-[1.02] text-foreground"
              style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
            >
              Il tuo cane, in 12 facce.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-4 lg:col-start-9 self-end text-base text-muted-foreground leading-relaxed max-w-[42ch]"
          >
            Ogni stile è dipinto a mano dall'AI con palette, pennellate e composizione dedicate. Renaissance è il nostro classico — gli altri 11 sono il tuo gioco.
          </motion.p>
        </div>

        {/* BENTO — Renaissance dominant 8x2, others 4x1 around. Goiko-style menu hierarchy. */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[280px] lg:auto-rows-[260px] gap-4 lg:gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className={`rounded-[1.75rem] ${i === 0 ? "lg:col-span-8 lg:row-span-2" : "lg:col-span-4"}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[280px] lg:auto-rows-[260px] gap-4 lg:gap-5">
            {styles.map((item, i) => {
              const isHero = i === 0; // Renaissance — the "Kevin Bacon"
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.55, ease }}
                  onClick={onTry}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltReset}
                  type="button"
                  style={{ transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  className={`group relative overflow-hidden rounded-[1.75rem] cursor-pointer text-left bg-card border border-border ${
                    isHero ? "lg:col-span-8 lg:row-span-2 aspect-[5/4] lg:aspect-auto" : "lg:col-span-4 aspect-[4/3] lg:aspect-auto"
                  }`}
                  aria-label={`Crea un ritratto in stile ${item.name}`}
                >
                  {/* Full-bleed image */}
                  {item.preview_url ? (
                    <BlurImage
                      src={item.preview_url}
                      alt={`Ritratto ${item.name} per cani — Artlypet`}
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}

                  {/* Bottom gradient — guarantees text legibility */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.85) 100%)" }}
                  />

                  {/* Top-right index pill */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-white/15 border border-white/20 px-2.5 py-1">
                    <span className="font-mono tabular text-[10px] font-semibold text-white">
                      {String(i + 1).padStart(2, "0")}<span className="text-white/60"> / {String(styles.length).padStart(2, "0")}</span>
                    </span>
                  </div>

                  {/* "ICON" badge on hero card — Renaissance is the brand mascot */}
                  {isHero && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-md px-2.5 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-primary-foreground animate-breath" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                      </span>
                      <span className="font-mono tabular text-[10px] font-semibold text-primary-foreground tracking-[0.16em] uppercase">
                        Icona del brand
                      </span>
                    </div>
                  )}

                  {/* Bottom content */}
                  <div className="absolute inset-x-5 bottom-5 z-10">
                    <div
                      className={`text-white font-bold leading-tight tracking-tight ${isHero ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"}`}
                      style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
                    >
                      {item.name}
                    </div>
                    {item.description && (
                      <p className={`mt-1.5 text-white/90 leading-snug ${isHero ? "text-base lg:text-lg max-w-[40ch]" : "text-xs lg:text-sm"}`}>
                        {item.description}
                      </p>
                    )}
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 px-3 py-1.5 text-xs font-semibold text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Crea con questo stile</span>
                      <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Footer link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            Sono 6 dei 12. Gli altri sei sono dentro lo studio.
          </p>
          <Link
            to="/styles"
            className="group inline-flex items-center gap-2 rounded-full border border-border hover:border-primary px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors btn-press"
          >
            <span>Vedi tutti i 12 stili</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

GallerySection.displayName = "GallerySection";

export default GallerySection;
