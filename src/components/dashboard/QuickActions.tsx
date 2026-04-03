import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageIcon, Palette, Gift, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface QuickActionsProps {
  hasPortraits: boolean;
  referralCode?: string;
}

export const QuickActions = ({ hasPortraits, referralCode }: QuickActionsProps) => {
  const { t } = useTranslation();

  const actions = [
    {
      label: t("dashboard.createPortrait", "Create Portrait"),
      icon: <ImageIcon className="h-3.5 w-3.5" />,
      to: "/generate",
      variant: "default" as const,
    },
    {
      label: t("dashboard.browseStyles", "Browse Styles"),
      icon: <Palette className="h-3.5 w-3.5" />,
      to: "/styles",
      variant: "outline" as const,
    },
    ...(referralCode ? [{
      label: t("dashboard.inviteFriend", "Invite a Friend"),
      icon: <Gift className="h-3.5 w-3.5" />,
      onClick: () => {
        const link = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
        navigator.clipboard.writeText(link);
        toast.success(t("referral.copied", "Referral link copied!"));
      },
      variant: "outline" as const,
    }] : []),
    ...(hasPortraits ? [{
      label: t("dashboard.printCtaBtn", "View Prints"),
      icon: <Printer className="h-3.5 w-3.5" />,
      to: "/prints",
      variant: "outline" as const,
    }] : []),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          {action.to ? (
            <Button
              variant={action.variant}
              size="sm"
              className="rounded-full gap-2 whitespace-nowrap"
              asChild
            >
              <Link to={action.to}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button
              variant={action.variant}
              size="sm"
              className="rounded-full gap-2 whitespace-nowrap"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
};
