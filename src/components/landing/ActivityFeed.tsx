import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const ACTIVITIES = [
  { name: "Sophie", city: "Berlin", style: "Oil Painting" },
  { name: "Marco", city: "Roma", style: "Renaissance" },
  { name: "Claire", city: "Paris", style: "Watercolor" },
  { name: "Anna", city: "Munich", style: "Art Nouveau" },
  { name: "Luca", city: "Milano", style: "Pop Art" },
  { name: "Emma", city: "London", style: "Impressionist" },
  { name: "Pablo", city: "Madrid", style: "Oil Painting" },
  { name: "Marie", city: "Lyon", style: "Watercolor" },
  { name: "Thomas", city: "Vienna", style: "Renaissance" },
  { name: "Giulia", city: "Firenze", style: "Art Nouveau" },
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
                city: activity.city,
                style: activity.style,
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
