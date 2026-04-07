import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStyles } from "@/hooks/useStyles";

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelectStyle: (id: string) => void;
}

export const StyleSelector = ({ selectedStyleId, onSelectStyle }: StyleSelectorProps) => {
  const { t } = useTranslation();
  const { data: styles, isLoading, isError, refetch } = useStyles();

  if (isError) {
    return (
      <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-6 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive font-medium">
          {t("generate.stylesLoadError", "Could not load styles. Please try again.")}
        </p>
        <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => refetch()}>
          <Loader2 className="h-3 w-3" />
          {t("generate.retryLoadStyles", "Retry")}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {styles?.map((style) => (
        <Card
          key={style.id}
          onClick={() => onSelectStyle(style.id)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectStyle(style.id); } }}
          className={`relative aspect-square overflow-hidden cursor-pointer transition-all duration-200 rounded-2xl ${
            selectedStyleId === style.id
              ? "ring-3 ring-primary ring-offset-2 ring-offset-background scale-[1.03] shadow-lg"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          {style.preview_url ? (
            <img src={style.preview_url} alt={`Pet portrait in ${style.name} art style`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-3">
            <span className="font-serif text-sm font-bold text-white block">{style.name}</span>
          </div>
          {selectedStyleId === style.id && (
            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <span className="text-xs font-bold">✓</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
