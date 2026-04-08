import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

// City/style keys are translated below via t() so the feed adapts to user locale
const ACTIVITIES = [
  { name: "Sophie", cityKey: "activity.city.berlin", style: "activity.style.oilPainting" },
  { name: "Marco", cityKey: "activity.city.rome", style: "activity.style.renaissance" },
  { name: "Claire", cityKey: "activity.city.paris", style: "activity.style.watercolor" },
  { name: "Anna", cityKey: "activity.city.munich", style: "activity.style.artNouveau" },
  { name: "Luca", cityKey: "activity.city.milan", style: "activity.style.popArt" },
  { name: "Emma", cityKey: "activity.city.london", style: "activity.style.impressionist" },
  { name: "Pablo", cityKey: "activity.city.madrid", style: "activity.style.oilPainting" },
  { name: "Marie", cityKey: "activity.city.lyon", style: "activity.style.watercolor" },
  { name: "Thomas", cityKey: "activity.city.vienna", style: "activity.style.renaissance" },
  { name: "Giulia", cityKey: "activity.city.florence", style: "activity.style.artNouveau" },
];

export const ActivityFeed = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("artlypet_activity_dismissed") === "true");

  useEffect(() => {
    if (dismissed) return;

    // Show first notification after 5 seconds
    const showTimer = setTimeout(() => setVisible(true), 5000);

    // Cycle through activities
    const cycleTimer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleTimer);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("artlypet_activity_dismissed", "true");
  };

  if (dismissed) return null;

  const activity = ACTIVITIES[currentIndex];
  const minutesAgo = 1 + (currentIndex % 4);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 sm:bottom-4 left-4 z-40 bg-card border border-border rounded-xl shadow-lg p-3 flex items-center gap-3 max-w-xs"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{activity.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {t("activity.justCreated", "{{name}} from {{city}} just created a {{style}} portrait", {
                name: activity.name,
                city: t(activity.cityKey, activity.cityKey.split(".").pop()),
                style: t(activity.style, activity.style.split(".").pop()),
              })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t("activity.minutesAgo", "{{count}} min ago", { count: minutesAgo })}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
