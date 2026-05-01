import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowUpRight, Image as ImageIcon, Crown, Users, AlertCircle, Loader2, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCreditBalance } from "@/hooks/useCredits";
import { useProfile } from "@/hooks/useProfile";
import { useStyles } from "@/hooks/useStyles";
import { useGenerationStatus } from "@/hooks/useGenerations";
import { uploadOriginalImage } from "@/services/storage";
import { requestGeneration, getServedImage, purchaseHdImage } from "@/services/generations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getCreditCost, CREDIT_COST_SINGLE, CREDIT_COST_MIX, HD_UNLOCK_PRICE } from "@/lib/constants";
import type { GenerationType } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { CreationTheater } from "@/components/CreationTheater";
import { UploadSection } from "@/components/generate/UploadSection";
import { StyleSelector } from "@/components/generate/StyleSelector";
import { ResultPanel } from "@/components/generate/ResultPanel";
import { ConfirmDialog } from "@/components/generate/ConfirmDialog";
import { LowCreditsNudge } from "@/components/LowCreditsNudge";
import { trackEvent, trackInitiateCheckout } from "@/hooks/useAnalytics";
import { safeSetItem } from "@/lib/storage";
import { MagneticButton } from "@/components/ui/magnetic-button";

/** Map raw backend/Gemini error messages to a translated, sanitised user-facing string */
const useFriendlyError = () => {
  const { t } = useTranslation();
  return (raw: string | undefined | null): string => {
    if (!raw) return t("generate.errors.generic", "Generation failed. Your credits have been refunded.");
    if (raw.includes("high demand") || raw.includes("UNAVAILABLE") || raw.includes("503"))
      return t("generate.errors.busy", "Our AI artist is very busy right now. Your credits have been refunded — please try again in a minute.");
    if (raw.includes("Gemini API error"))
      return t("generate.errors.unavailable", "AI service temporarily unavailable. Your credits have been refunded — please try again.");
    if (raw.includes("No image in Gemini response"))
      return t("generate.errors.noImage", "The AI couldn't generate an image from this photo. Try a different photo or style.");
    if (raw.includes("Original image not found"))
      return t("generate.errors.notFound", "Your uploaded photo couldn't be found. Please re-upload.");
    return t("generate.errors.generic", "Generation failed. Your credits have been refunded.");
  };
};

const Generate = () => {
  const { t } = useTranslation();
  const friendlyError = useFriendlyError();
  const { user } = useAuth();
  const { data: creditBalance, isLoading: creditsLoading, isError: creditsError } = useCreditBalance();
  const { data: profile, isError: profileError } = useProfile();
  const { data: styles } = useStyles();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Core state
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>("single");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFile2, setUploadedFile2] = useState<File | null>(null);
  const [petName, setPetName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<"hd" | "watermarked" | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const [optimisticCreditDeduction, setOptimisticCreditDeduction] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);

  // UI state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isGeneratingRef = useRef(false);
  const confettiFired = useRef(false);

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const creditCost = getCreditCost(generationType);
  const displayCredits = optimisticCreditDeduction > 0
    ? Math.max(0, (creditBalance ?? 0) - optimisticCreditDeduction)
    : (creditBalance ?? 0);

  const { data: generationStatus } = useGenerationStatus(generationId, generating, generationStartTime);

  // Pre-select style from URL
  useEffect(() => {
    const styleParam = searchParams.get("style");
    if (styleParam && styles && styles.some((s) => s.id === styleParam)) {
      setSelectedStyleId(styleParam);
    }
  }, [searchParams, styles]);

  // Poll generation status
  useEffect(() => {
    if (!generationId || !generating) return;
    const controller = new AbortController();
    if (generationStatus?.status === "completed") {
      setGenerationComplete(true);
      isGeneratingRef.current = false;
      trackEvent("GenerationCompleted", "generation_completed", { generation_id: generationId, generation_type: generationType });
      setOptimisticCreditDeduction(0);
      setTimeout(() => {
        setGenerating(false);
        getServedImage(generationId)
          .then((data) => { if (!controller.signal.aborted) { setResultUrl(data.url); setResultMode(data.mode); } })
          .catch(() => { if (!controller.signal.aborted) toast.error(t("generate.errors.loadResult", "Failed to load result")); });
      }, 800);
      void queryClient.invalidateQueries({ queryKey: ["credits"] });
      void queryClient.invalidateQueries({ queryKey: ["generations"] });
      safeSetItem("credits-updated", Date.now().toString());
    } else if (generationStatus?.status === "failed") {
      setGenerating(false);
      isGeneratingRef.current = false;
      setGenerationId(null);
      setShowRetry(true);
      setOptimisticCreditDeduction(0);
      trackEvent("GenerationFailed", "generation_failed", { generation_id: generationId, generation_type: generationType, error: generationStatus.error_message });
      toast.error(friendlyError(generationStatus.error_message));
      void queryClient.invalidateQueries({ queryKey: ["credits"] });
      safeSetItem("credits-updated", Date.now().toString());
    }
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationStatus?.status, generationStatus?.error_message, generationId, generating, generationType, queryClient]);

  // Polling timeout
  useEffect(() => {
    if (!generating || !generationStartTime) return;
    const timeoutMs = 120_000;
    const elapsed = Date.now() - generationStartTime;
    const remaining = timeoutMs - elapsed;
    const fireTimeout = () => {
      setGenerating(false); isGeneratingRef.current = false; setGenerationId(null);
      setShowRetry(true); setOptimisticCreditDeduction(0);
      toast.error(t("generate.timeoutError", "Generation timed out. Please try again. Your credits have been refunded."));
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    };
    if (remaining <= 0) { fireTimeout(); return; }
    const timer = setTimeout(() => { if (isGeneratingRef.current) fireTimeout(); }, remaining);
    return () => clearTimeout(timer);
  }, [generating, generationStartTime, queryClient, t]);

  const handleGenerate = () => {
    if (!uploadedFile || !selectedStyleId || !user || (creditBalance ?? 0) < creditCost) return;
    if (generationType === "mix" && !uploadedFile2) return;
    if (isGeneratingRef.current) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirmDialog(false);
    if (!uploadedFile || !selectedStyleId || !user) return;
    if (generationType === "mix" && !uploadedFile2) return;
    if (isGeneratingRef.current) return;

    isGeneratingRef.current = true;
    setGenerating(true); setGenerationStartTime(Date.now()); setShowRetry(false);
    setGenerationComplete(false); setOptimisticCreditDeduction(creditCost);
    try {
      setUploading(true);
      const original = await uploadOriginalImage(user.id, uploadedFile);
      let originalId2: string | undefined;
      if (generationType === "mix" && uploadedFile2) {
        const original2 = await uploadOriginalImage(user.id, uploadedFile2);
        originalId2 = original2.id;
      }
      setUploading(false);
      const result = await requestGeneration(original.id, selectedStyleId, generationType, originalId2);
      setGenerationId(result.generation_id);
      trackEvent("GenerationStarted", "generation_started", { generation_type: generationType, style_id: selectedStyleId });
      toast.success(t("generate.generationStarted", "Generation started! This may take up to 60 seconds."));
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast.error(friendlyError(message));
      setUploading(false); setGenerating(false); isGeneratingRef.current = false; setOptimisticCreditDeduction(0);
    }
  };

  const handleUnlockHd = async () => {
    if (!generationId) return;
    trackInitiateCheckout(HD_UNLOCK_PRICE, "hd_unlock");
    try {
      const { url } = await purchaseHdImage(generationId);
      if (url) window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast.error(friendlyError(message));
    }
  };

  const handleCancelGeneration = () => {
    setGenerating(false);
    isGeneratingRef.current = false;
    setGenerationId(null);
    setOptimisticCreditDeduction(0);
    toast.info(t("generate.cancelled", "Generation cancelled. Your credits will be refunded if they were deducted."));
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  };

  const canGenerate = !!uploadedFile && !!selectedStyleId && !creditsLoading && (creditBalance ?? 0) >= creditCost && (generationType === "single" || !!uploadedFile2);
  const selectedStyleName = styles?.find((s) => s.id === selectedStyleId)?.name;

  // Step progression — drives the top progress bar
  const stepsDone = (uploadedFile ? 1 : 0) + (selectedStyleId ? 1 : 0);
  const totalSteps = 2;
  const progressPct = (stepsDone / totalSteps) * 100;

  return (
    <div className="app-ui min-h-[100dvh] bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>

      {/* Header — glass refraction sticky */}
      <header className="sticky top-0 z-40 h-16 lg:h-[68px] glass-refraction border-b border-border/60">
        <div className="container mx-auto h-full flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/dashboard"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors btn-press"
              aria-label={t("nav.backToDashboard", "Back to dashboard")}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline truncate">
                {t("dashboard.tabDashboard", "Dashboard")}
              </Link>
              <span className="text-muted-foreground/40 hidden sm:inline">/</span>
              <span className="font-semibold text-foreground truncate">{t("generate.title", "Create portrait")}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {isPremium && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                <Crown className="h-3 w-3" strokeWidth={2} /> {t("generate.premium", "Premium")}
              </span>
            )}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5">
              <Coins className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              <span className="font-mono tabular text-sm font-semibold text-foreground">
                {creditsLoading ? <Skeleton className="h-3.5 w-6 inline-block align-middle" /> : displayCredits}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{t("generate.credits", "credits")}</span>
            </div>
          </div>
        </div>

        {/* Step progress bar — only visible during the build flow */}
        {!generating && !resultUrl && !showRetry && (
          <div className="absolute left-0 right-0 -bottom-px h-px bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        )}
      </header>

      <div id="main-content" className="container px-5 lg:px-8 py-10 lg:py-14 max-w-5xl">

        {(creditsError || profileError) && (
          <div className="mb-7 rounded-2xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" strokeWidth={1.75} />
            <p className="text-sm text-destructive">{t("generate.loadError", "Could not load your account data. Please refresh and try again.")}</p>
          </div>
        )}

        {/* RESULT */}
        {resultUrl && resultMode && (
          <ResultPanel
            resultUrl={resultUrl}
            resultMode={resultMode}
            previewUrl={previewUrl}
            isPremium={isPremium}
            generationId={generationId}
            selectedStyleName={selectedStyleName}
            downloadFileName={`artlypet-${selectedStyleName?.toLowerCase().replace(/\s+/g, "-") || "portrait"}-HD.png`}
            onUnlockHd={handleUnlockHd}
            onTryDifferentStyle={() => { setResultUrl(null); setResultMode(null); setGenerationId(null); setSelectedStyleId(null); }}
            onCreateAnother={() => { setResultUrl(null); setResultMode(null); setGenerationId(null); setUploadedFile(null); setUploadedFile2(null); setPreviewUrl(null); }}
            onShowPurchaseModal={() => setShowPurchaseModal(true)}
            onConfettiReady={() => {
              if (confettiFired.current) return;
              confettiFired.current = true;
              import("canvas-confetti").then((confetti) => {
                confetti.default({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ["#d4956a", "#c17d52", "#e8b896", "#4a9d6e"] });
              });
            }}
          />
        )}

        {/* GENERATING */}
        {generating && !resultUrl && (
          <div>
            <CreationTheater previewUrl={previewUrl} styleName={selectedStyleName} startTime={generationStartTime} isComplete={generationComplete} petName={petName || undefined} />
            <div className="text-center mt-8">
              <button
                onClick={handleCancelGeneration}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors btn-press"
              >
                {t("generate.cancelGeneration", "Cancel generation")}
              </button>
            </div>
          </div>
        )}

        {/* RETRY — beautifully composed error state */}
        {showRetry && !generating && !resultUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bento-card-lg p-10 lg:p-14 max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/12 mb-6">
              <AlertCircle className="h-7 w-7 text-destructive" strokeWidth={1.75} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
              {t("generate.generationFailed", "Generation failed")}
            </h2>
            <p className="text-base text-muted-foreground max-w-md mx-auto mb-9 leading-relaxed">
              {t("generate.failedDesc", "Something went wrong. Don't worry — your credits have been automatically refunded.")}
            </p>
            <MagneticButton
              onClick={() => setShowRetry(false)}
              className="shimmer-btn rounded-full h-13 px-9 text-base font-semibold shadow-tinted"
              strength={0.30}
            >
              <span>{t("generate.tryAgain", "Try again")}</span>
            </MagneticButton>
          </motion.div>
        )}

        {/* CREATE FLOW — Bento layout */}
        {!generating && !resultUrl && !showRetry && (
          <div className="space-y-6 lg:space-y-7">

            {/* Title block — not centered, anti-center bias */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-2">
              <div className="lg:col-span-8">
                <span className="sec-label">{t("generate.kicker", "Studio")}</span>
                <h1 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] text-foreground">
                  {t("generate.heading", "Three quick choices, then we paint.")}
                </h1>
              </div>
              <div className="lg:col-span-4 flex lg:items-end">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("generate.subtitle", "Type, photo, style. The AI does the rest in about a minute.")}
                </p>
              </div>
            </div>

            {/* STEP 1 — Type */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              aria-labelledby="step-type"
              className="bento-card p-6 lg:p-8"
            >
              <header className="flex items-center gap-3 mb-5">
                <span className="font-mono tabular text-xs font-semibold text-muted-foreground">01</span>
                <span className="h-3 w-px bg-border" />
                <h2 id="step-type" className="text-base font-semibold text-foreground">
                  {t("generate.step2Title", "Choose generation type")}
                </h2>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setGenerationType("single")}
                  aria-pressed={generationType === "single"}
                  className={`group text-left rounded-2xl border p-5 transition-all btn-press ${
                    generationType === "single"
                      ? "border-primary bg-primary/5 shadow-tinted"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      generationType === "single" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <ImageIcon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="flex-1">
                      <div className="text-base font-bold text-foreground">{t("generate.single", "Single")}</div>
                      <div className="font-mono tabular text-xs text-muted-foreground">{CREDIT_COST_SINGLE} {t("generate.credits", "credits")}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("generate.singleDesc", "One pet or one person — perfect for a classic portrait")}
                  </p>
                </button>

                <button
                  onClick={() => setGenerationType("mix")}
                  aria-pressed={generationType === "mix"}
                  className={`group text-left rounded-2xl border p-5 transition-all btn-press ${
                    generationType === "mix"
                      ? "border-primary bg-primary/5 shadow-tinted"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      generationType === "mix" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <Users className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="flex-1">
                      <div className="text-base font-bold text-foreground">{t("generate.mix", "Mix")}</div>
                      <div className="font-mono tabular text-xs text-muted-foreground">{CREDIT_COST_MIX} {t("generate.credits", "credits")}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("generate.mixDesc", "Pet + person together — create a shared masterpiece")}
                  </p>
                </button>
              </div>

              {/* Pet name — divide-y instead of new card (skill: anti-card overuse) */}
              <div className="mt-6 pt-6 border-t border-border">
                <label htmlFor="pet-name" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">
                  {t("generate.petNameLabel", "Pet's name")} <span className="text-muted-foreground/70 normal-case font-normal tracking-normal">— {t("common.optional", "optional")}</span>
                </label>
                <input
                  id="pet-name"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder={t("generate.petNamePlaceholder", "Luna, Milo, Bella…")}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  maxLength={30}
                />
              </div>
            </motion.section>

            {/* STEP 2 — Upload */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              aria-labelledby="step-upload"
              className="bento-card p-6 lg:p-8"
            >
              <header className="flex items-center gap-3 mb-5">
                <span className="font-mono tabular text-xs font-semibold text-muted-foreground">02</span>
                <span className="h-3 w-px bg-border" />
                <h2 id="step-upload" className="text-base font-semibold text-foreground">
                  {generationType === "mix" ? t("generate.uploadBothTitle", "Upload both photos") : t("generate.step1Title", "Upload your photo")}
                </h2>
              </header>
              <UploadSection
                generationType={generationType}
                onFile1Change={setUploadedFile}
                onFile2Change={setUploadedFile2}
                onPreview1Change={setPreviewUrl}
              />
              {generationType === "mix" && uploadedFile && !uploadedFile2 && (
                <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                  {t("generate.mixBothRequired", "Both photos are required for Mix mode. Upload photo B to continue.")}
                </div>
              )}
            </motion.section>

            {/* STEP 3 — Style */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              aria-labelledby="step-style"
              className="bento-card p-6 lg:p-8"
            >
              <header className="flex items-center gap-3 mb-5">
                <span className="font-mono tabular text-xs font-semibold text-muted-foreground">03</span>
                <span className="h-3 w-px bg-border" />
                <h2 id="step-style" className="text-base font-semibold text-foreground">{t("generate.step3Title", "Choose your style")}</h2>
              </header>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {t("generate.step3Desc", "Select the artistic style for your portrait")}
              </p>
              <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />

              {/* Custom prompt — anti-card overuse, divide-y */}
              {selectedStyleId && (
                <div className="mt-6 pt-6 border-t border-border">
                  <label htmlFor="custom-prompt" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">
                    {t("generate.customPromptLabel", "Add details")} <span className="text-muted-foreground/70 normal-case font-normal tracking-normal">— {t("common.optional", "optional")}</span>
                  </label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={t("generate.customPromptPlaceholder", "e.g. Add a golden crown, warm autumn colors, baroque background…")}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    rows={2}
                    maxLength={200}
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{t("generate.customPromptHint", "Optional flavour for the AI")}</span>
                    <span className="font-mono tabular text-[10px] text-muted-foreground">{customPrompt.length}/200</span>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Low credits warning */}
            {!creditsLoading && (
              <LowCreditsNudge
                creditBalance={creditBalance ?? 0}
                creditCost={creditCost}
                onUpgrade={() => setShowPurchaseModal(true)}
              />
            )}

            {/* Generate CTA — sticky on mobile via the footer band */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bento-card p-7 lg:p-9 flex flex-col items-center text-center"
            >
              {creditsLoading ? (
                <div className="flex items-center justify-center gap-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("generate.loadingCredits", "Loading your credit balance...")}</p>
                </div>
              ) : (creditBalance ?? 0) < creditCost ? (
                <>
                  <p className="text-base text-muted-foreground mb-5">
                    {t("generate.needCredits", "You need at least {{cost}} credits", { cost: creditCost })}
                  </p>
                  <MagneticButton
                    onClick={() => setShowPurchaseModal(true)}
                    className="shimmer-btn rounded-full h-13 px-8 text-base font-semibold shadow-tinted"
                    strength={0.30}
                  >
                    <Crown className="h-4 w-4" strokeWidth={2} />
                    <span>{t("generate.goPremiumShort", "Go Premium — €15 (1500 credits)")}</span>
                  </MagneticButton>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-5">
                    {canGenerate
                      ? t("generate.readyToCreate", "Everything looks good. Hit the button to begin.")
                      : !uploadedFile
                        ? t("generate.missingPhoto", "Upload a photo first")
                        : !selectedStyleId
                          ? t("generate.missingStyle", "Pick a style next")
                          : t("generate.missingPhoto2", "Upload both photos for Mix mode")}
                  </p>

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || generating || uploading}
                    className={`btn-press rounded-full h-14 px-8 text-base font-semibold disabled:opacity-40 ${
                      canGenerate && !generating && !uploading ? "shimmer-btn shadow-tinted" : "bg-foreground text-background"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        <span>{t("generate.uploading", "Uploading photo…")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("generate.generateBtn", "Create My Portrait — {{cost}} credits", { cost: creditCost })}</span>
                        <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={2.25} />
                      </>
                    )}
                  </Button>

                  {uploading && (
                    <div className="mt-5 max-w-xs w-full">
                      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-upload-progress" />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2">{t("generate.uploadingHint", "Preparing your photo for the AI…")}</p>
                    </div>
                  )}

                  {!isPremium && canGenerate && (
                    <p className="text-xs text-muted-foreground mt-5 max-w-md leading-relaxed">
                      {t("generate.freeNote", "Free plan: preview with watermark. Unlock HD for €4.90 per image, or go Premium for unlimited HD.")}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      <CreditPurchaseModal open={showPurchaseModal} onOpenChange={setShowPurchaseModal} />
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmGenerate}
        creditCost={creditCost}
        creditsRemaining={(creditBalance ?? 0) - creditCost}
      />
    </div>
  );
};

export default Generate;
