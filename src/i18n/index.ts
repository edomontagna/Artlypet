import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Only import English (fallback language) eagerly.
// All other languages are loaded on demand when the user switches.
import en from "./locales/en.json";

const SUPPORTED_LANGUAGES = ["en", "it", "de", "fr", "es"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (lng: string): lng is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(lng as SupportedLanguage);

const localeLoaders: Record<Exclude<SupportedLanguage, "en">, () => Promise<{ default: Record<string, unknown> }>> = {
  it: () => import("./locales/it.json"),
  de: () => import("./locales/de.json"),
  fr: () => import("./locales/fr.json"),
  es: () => import("./locales/es.json"),
};

const loadLanguage = async (lng: string): Promise<void> => {
  if (lng === "en" || !isSupportedLanguage(lng)) return;
  if (i18n.hasResourceBundle(lng, "translation")) return;

  const loader = localeLoaders[lng as Exclude<SupportedLanguage, "en">];
  const module = await loader();
  i18n.addResourceBundle(lng, "translation", module.default, true, true);
};

// Detect the initial language before init so we can eagerly load it
const detector = new LanguageDetector();
detector.init({
  order: ["localStorage", "navigator"],
  caches: ["localStorage"],
});
const detected = detector.detect();
const initialLng = (Array.isArray(detected) ? detected[0] : detected) || "en";
// Normalize to base language code (e.g. "en-US" -> "en")
const baseLng = initialLng.split("-")[0];
const resolvedLng = isSupportedLanguage(baseLng) ? baseLng : "en";

// Pre-load the detected language (if not English) before init
const initialResources: Record<string, { translation: Record<string, unknown> }> = {
  en: { translation: en },
};

const initI18n = async () => {
  // If the detected language is not English, load it before initializing
  if (resolvedLng !== "en") {
    const loader = localeLoaders[resolvedLng as Exclude<SupportedLanguage, "en">];
    const module = await loader();
    initialResources[resolvedLng] = { translation: module.default };
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: initialResources,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
      partialBundledLanguages: true,
    });

  // Load additional languages on demand when user switches
  i18n.on("languageChanged", (lng) => {
    const base = lng.split("-")[0];
    if (!i18n.hasResourceBundle(base, "translation") && isSupportedLanguage(base)) {
      loadLanguage(base);
    }
  });
};

// Execute initialization and export the ready promise
export const i18nReady = initI18n();

export default i18n;
