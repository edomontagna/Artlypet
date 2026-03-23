import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Copy, MessageCircle } from "lucide-react";

const SITE_URL = "https://artlypet.com";

interface SharePanelProps {
  imageUrl: string;
  styleName?: string;
}

export const SharePanel = ({ imageUrl, styleName }: SharePanelProps) => {
  const { t } = useTranslation();

  const shareText = styleName
    ? t("share.captionWithStyle", "My pet just became a {{style}} masterpiece! Create yours free", { style: styleName })
    : t("share.caption", "My pet just became a work of art! Create yours free");

  const fullText = `${shareText} ${SITE_URL}`;
  const encodedText = encodeURIComponent(fullText);
  const encodedUrl = encodeURIComponent(SITE_URL);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("share.title", "My Artlypet Portrait"),
          text: shareText,
          url: SITE_URL,
        });
      } catch {
        // User cancelled — not an error
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${imageUrl}`);
    toast.success(t("share.copied", "Link copied!"));
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: () => <MessageCircle className="h-4 w-4" />,
      url: `https://wa.me/?text=${encodedText}`,
      color: "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400",
    },
    {
      name: "X",
      icon: () => <span className="text-sm font-bold">𝕏</span>,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
      color: "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
    },
    {
      name: "Facebook",
      icon: () => <span className="text-sm font-bold">f</span>,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareText)}`,
      color: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Native share (mobile-first) */}
      {typeof navigator !== "undefined" && navigator.share && (
        <Button
          variant="outline"
          className="rounded-full gap-2"
          onClick={handleNativeShare}
        >
          <Share2 className="h-4 w-4" />
          {t("share.share", "Share")}
        </Button>
      )}

      {/* Social links */}
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          className={`rounded-full w-10 h-10 transition-colors ${link.color}`}
          asChild
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${t("share.shareOn", "Share on")} ${link.name}`}
          >
            <link.icon />
          </a>
        </Button>
      ))}

      {/* Copy link */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary"
        onClick={handleCopyLink}
        title={t("share.copyLink", "Copy link")}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};
