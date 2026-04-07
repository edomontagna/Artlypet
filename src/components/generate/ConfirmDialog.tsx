import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  creditCost: number;
  creditsRemaining: number;
}

export const ConfirmDialog = ({ open, onOpenChange, onConfirm, creditCost, creditsRemaining }: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {t("generate.confirmTitle", "Confirm Generation")}
          </DialogTitle>
          <DialogDescription>
            {t("generate.confirmGeneration", "This will cost {{cost}} credits. You'll have {{remaining}} credits left. Continue?", {
              cost: creditCost,
              remaining: Math.max(0, creditsRemaining),
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button className="rounded-full gap-2" onClick={onConfirm}>
            <Sparkles className="h-4 w-4" />
            {t("generate.confirmBtn", "Create Portrait")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
