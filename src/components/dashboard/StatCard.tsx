import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  loading?: boolean;
  variant?: "default" | "primary" | "accent";
  onClick?: () => void;
  subtitle?: string;
}

export const StatCard = ({ icon, label, value, loading, variant = "default", onClick, subtitle }: StatCardProps) => {
  const baseClasses = "rounded-2xl p-5 transition-all";
  const variantClasses = {
    default: "bg-card border border-border",
    primary: "bg-primary/5 border border-primary/20",
    accent: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer",
  };

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${onClick ? "text-left w-full card-hover" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          variant === "accent" ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}>
          {icon}
        </div>
        <p className={`text-xs ${variant === "accent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {label}
        </p>
      </div>
      <p className={`font-serif text-3xl font-bold ${variant === "accent" ? "text-primary-foreground" : "text-foreground"}`}>
        {loading ? <Skeleton className="h-8 w-14" /> : value}
      </p>
      {subtitle && (
        <p className={`text-[10px] mt-0.5 ${variant === "accent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
};
