import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Package, Printer, Truck, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrintOrders } from "@/hooks/usePrintOrders";
import type { PrintOrderStatus } from "@/services/orders";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const statusMeta: Record<PrintOrderStatus, { label: string; icon: typeof Clock; tone: string }> = {
  pending:   { label: "Awaiting payment", icon: Clock,         tone: "text-amber-700 bg-amber-500/10 border-amber-500/20" },
  paid:      { label: "Paid",             icon: CheckCircle2,  tone: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20" },
  shipped:   { label: "Shipped",          icon: Truck,         tone: "text-blue-700 bg-blue-500/10 border-blue-500/20" },
  delivered: { label: "Delivered",        icon: Package,       tone: "text-primary bg-primary/10 border-primary/20" },
};

const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "EUR" }).format(cents / 100);

export const OrdersTab = () => {
  const { t, i18n } = useTranslation();
  const { data: orders, isLoading, isError } = usePrintOrders();

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl space-y-6 lg:space-y-7"
    >
      <div>
        <span className="sec-label">{t("orders.kicker", "Print orders")}</span>
        <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tightest leading-tight text-foreground">
          {t("orders.heading", "Your canvas prints")}
        </h2>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-[55ch]">
          {t("orders.subheading", "Every order, its current status and the price you paid. Tracking codes appear here as soon as the partner ships.")}
        </p>
      </div>

      {isError && (
        <div role="alert" className="rounded-2xl bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {t("orders.loadError", "Could not load your orders. Please refresh and try again.")}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-bento-sm" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="bento-card-lg p-10 lg:p-14 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 mb-5">
            <Printer className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            {t("orders.emptyTitle", "No prints yet")}
          </h3>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-7 leading-relaxed">
            {t("orders.emptyDesc", "Once you order a canvas print, it'll show up here with status updates and tracking.")}
          </p>
          <Link
            to="/prints"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-5 h-11 text-sm font-semibold transition-colors btn-press"
          >
            <span>{t("orders.browsePrints", "Browse canvas prints")}</span>
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const meta = statusMeta[order.status];
            const Icon = meta.icon;
            const styleName = order.generated_image?.style?.name || t("orders.stylePlaceholder", "Portrait");
            return (
              <li
                key={order.id}
                className="bento-card p-5 lg:p-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center"
              >
                {/* Thumbnail or placeholder */}
                <div className="sm:col-span-2 flex sm:block">
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-muted-foreground/50">
                    {order.generated_image?.storage_path ? (
                      <Printer className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Printer className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                {/* Order info */}
                <div className="sm:col-span-6">
                  <div className="font-mono tabular text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                    #{order.id.slice(0, 8)} · {formatDate(order.created_at, i18n.language)}
                  </div>
                  <div className="mt-1 text-base font-semibold text-foreground">
                    {styleName} <span className="text-muted-foreground font-normal">— {t("orders.canvasPrint", "canvas print")}</span>
                  </div>
                  <div className="mt-1 font-mono tabular text-sm text-muted-foreground">
                    {formatPrice(order.price_cents, order.currency)}
                  </div>
                </div>

                {/* Status pill */}
                <div className="sm:col-span-3 flex sm:justify-end">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${meta.tone}`}>
                    <Icon className="h-3 w-3" strokeWidth={2} />
                    {t(`orders.status.${order.status}`, meta.label)}
                  </span>
                </div>

                {/* Receipt link if present */}
                <div className="sm:col-span-1 flex sm:justify-end">
                  {order.stripe_session_id && (
                    <a
                      href={`https://dashboard.stripe.com/payments/${order.stripe_session_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      aria-label={t("orders.openReceipt", "Open receipt")}
                      title={t("orders.openReceipt", "Open receipt")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Trust strip */}
      <p className="text-xs text-muted-foreground text-center">
        {t("orders.shippingNote", "EU shipping · Museum-quality canvas · 30-day satisfaction guarantee")}
      </p>
    </motion.div>
  );
};
