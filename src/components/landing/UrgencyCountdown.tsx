import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface UrgencyCountdownProps {
  targetDate: string;
  variant?: "full" | "compact";
  className?: string;
}

export const UrgencyCountdown = ({ targetDate, variant = "full", className = "" }: UrgencyCountdownProps) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) return null;

  if (variant === "compact") {
    return (
      <span className={`text-xs font-medium text-destructive ${className}`}>
        {String(timeLeft.hours + timeLeft.days * 24).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    );
  }

  const units = [
    { value: timeLeft.days, label: t("countdown.days", "Days") },
    { value: timeLeft.hours, label: t("countdown.hours", "Hrs") },
    { value: timeLeft.minutes, label: t("countdown.minutes", "Min") },
    { value: timeLeft.seconds, label: t("countdown.seconds", "Sec") },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-destructive">
        {t("countdown.launchEnds", "Launch Price Ends In:")}
      </span>
      <div className="flex gap-1">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="bg-destructive/10 text-destructive text-xs font-bold rounded px-1.5 py-0.5 min-w-[28px] text-center tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function getTimeLeft(targetDate: string) {
  const total = new Date(targetDate).getTime() - Date.now();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
