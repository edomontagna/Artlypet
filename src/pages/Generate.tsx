import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles, Image as ImageIcon, Crown, Users, AlertCircle, Loader2 } from "lucide-react";
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
import { getCreditCost, CREDIT_COST_SINGLE, CREDIT_COST_MIX } from "@/lib/constants";
import type { GenerationType } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { CreationTheater } from "@/components/CreationTheater";
import { UploadSection } from "@/components/generate/UploadSection";
import { StyleSelector } from "@/components/generate/StyleSelector";
import { ResultPanel } from "@/components/generate/ResultPanel";
import { ConfirmDialog } from "@/components/generate/ConfirmDialog";
import { LowCreditsNudge } from "@/components/LowCreditsNudge";
import { trackEvent } from "@/hooks/useAnalytics";
import { safeSetItem } from "@/lib/storage";

/** Map raw backend/Gemini error messages to user-friendly strings */
const getFriendlyErrorMessage = (raw: string | undefined | null): string => {
  if (!raw) return "Generation failed. Your credits have been refunded.";
  if (raw.includes("high demand") || raw.includes("UNAVAILABLE") || raw.includes("503")) return "Our AI artist is very busy right now! Your credits have been refunded — please try again in a minute.";
  if (raw.includes("Gemini API error")) return "AI service temporarily unavailable. Your credits have been refunded — please try again.";
  if (raw.includes("No image in Gemini response")) return "The AI couldn't generate an image from this photo. Try a different photo or style.";
  if (raw.includes("Original image not found")) return "Your uploaded photo couldn't be found. Please re-upload.";
  return "Generation failed. Your credits have been refunded.";
};

const Generate = () => {
  const { t } = useTranslation();
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
          .catch(() => { if (!controller.signal.aborted) toast.error("Failed to load result"); });
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
      toast.error(getFriendlyErrorMessage(generationStatus.error_message));
      void queryClient.invalidateQueries({ queryKey: ["credits"] });
      safeSetItem("credits-updated", Date.now().toString());
    }
    return () => controller.abort();
  }, [generationStatus?.status, generationStatus?.error_message, generationId, generating, generationType, queryClient]);

  // Polling timeout
  useEffect(() => {
    if (!generating || !generationStartTime) return;
    const timeoutMs = 120_000;
    const elapsed = Date.now() - generationStartTime;
    const remaining = timeoutMs - elapsed;
    if (remaining <= 0) {
      setGenerating(false); isGeneratingRef.current = false; setGenerationId(null);
      setShowRetry(true); setOptimisticCreditDeduction(0);
      toast.error(t("generate.timeoutError", "Generation timed out. Please try again. Your credits have been refunded."));
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      return;
    }
    const timer = setTimeout(() => {
      if (!isGeneratingRef.current) return;
      setGenerating(false); isGeneratingRef.current = false; setGenerationId(null);
      setShowRetry(true); setOptimisticCreditDeduction(0);
      toast.error(t("generate.timeoutError", "Generation timed out. Please try again. Your credits have been refunded."));
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    }, remaining);
    return () => clearTimeout(timer);
  }, [generating, generationStartTime, queryClient, t]);

  // Handlers
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
      toast.error(err instanceof Error ? err.message : "Failed to start generation");
      setUploading(false); setGenerating(false); isGeneratingRef.current = false; setOptimisticCreditDeduction(0);
    }
  };

  const handleUnlockHd = async () => {
    if (!generationId) return;
    try {
      const { url } = await purchaseHdImage(generationId);
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start HD unlock");
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

  const canGenerate = uploadedFile && selectedStyleId && !creditsLoading && (creditBalance ?? 0) >= creditCost && (generationType === "single" || uploadedFile2);
  const selectedStyleName = styles?.find((s) => s.id === selectedStyleId)?.name;

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>

      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("dashboard.tabDashboard", "Dashboard")}
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-semibold text-foreground">{t("generate.title", "Create Portrait")}</span>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {isPremium && (
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 flex items-center gap-1 text-xs font-medium">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {creditsLoading ? <Skeleton className="h-4 w-8 inline-block" /> : displayCredits} {t("generate.credits", "credits")}
            </span>
          </div>
        </div>
      </header>

      <div id="main-content" className="container px-4 lg:px-8 py-8 max-w-4xl">

        {(creditsError || profileError) && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
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
            <div className="text-center mt-6">
              <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-destructive" onClick={handleCancelGeneration}>
                {t("generate.cancelGeneration", "Cancel generation")}
              </Button>
            </div>
          </div>
        )}

        {/* RETRY */}
        {showRetry && !generating && !resultUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("generate.generationFailed", "Generation Failed")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("generate.failedDesc", "Something went wrong. Don't worry — your credits have been automatically refunded.")}</p>
            <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-xl" onClick={() => setShowRetry(false)}>
              {t("generate.tryAgain", "Try Again")}
            </Button>
          </motion.div>
        )}

        {/* CREATE FLOW */}
        {!generating && !resultUrl && !showRetry && (
          <div className="space-y-10">
            {/* Step Progress */}
            {!generationId && !resultUrl && (
              <div className="flex items-center justify-center gap-0 mb-10">
                {[
                  { num: 1, done: true },
                  { num: 2, done: !!uploadedFile },
                  { num: 3, done: !!selectedStyleId },
                ].map((step, i) => (
                  <div key={step.num} className="flex items-center">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step.done ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                      }`}>{step.num}</div>
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                        {step.num === 1 ? t("generate.stepType", "Type") : step.num === 2 ? t("generate.stepUpload", "Upload") : t("generate.stepStyle", "Style")}
                      </span>
                    </div>
                    {i < 2 && <div className={`w-16 h-0.5 transition-all duration-500 ${step.done ? "bg-primary" : "bg-muted"}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Choose type */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-serif text-xl font-bold text-foreground">{t("generate.step2Title", "Choose generation type")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  onClick={() => setGenerationType("single")}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${generationType === "single" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30 hover:shadow-sm"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${generationType === "single" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold block">{t("generate.single", "Single")}</span>
                      <span className="text-xs text-muted-foreground">{CREDIT_COST_SINGLE} {t("generate.credits", "credits")}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("generate.singleDesc", "One pet or one person — perfect for a classic portrait")}</p>
                </Card>
                <Card
                  onClick={() => setGenerationType("mix")}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${generationType === "mix" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30 hover:shadow-sm"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${generationType === "mix" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold block">{t("generate.mix", "Mix")}</span>
                      <span className="text-xs text-muted-foreground">{CREDIT_COST_MIX} {t("generate.credits", "credits")}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("generate.mixDesc", "Pet + person together — create a shared masterpiece")}</p>
                </Card>
              </div>
            </motion.div>

            {/* Pet name (optional) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
              <div className="max-w-md">
                <label htmlFor="pet-name" className="text-sm font-medium text-foreground mb-2 block">
                  {t("generate.petNameLabel", "What's your pet's name?")} <span className="text-muted-foreground font-normal">({t("common.optional", "optional")})</span>
                </label>
                <input
                  id="pet-name"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder={t("generate.petNamePlaceholder", "e.g. Luna, Milo, Bella...")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  maxLength={30}
                />
              </div>
            </motion.div>

            {/* Step 2: Upload */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {generationType === "mix" ? t("generate.uploadBothTitle", "Upload both photos") : t("generate.step1Title", "Upload your photo")}
                </h2>
              </div>
              <UploadSection
                generationType={generationType}
                onFile1Change={setUploadedFile}
                onFile2Change={setUploadedFile2}
                onPreview1Change={setPreviewUrl}
              />
            </motion.div>

            {/* Step 3: Choose style */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="font-serif text-xl font-bold text-foreground">{t("generate.step3Title", "Choose your style")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t("generate.step3Desc", "Select the artistic style for your portrait")}</p>
              <StyleSelector selectedStyleId={selectedStyleId} onSelectStyle={setSelectedStyleId} />

              {/* Custom prompt (optional) */}
              {selectedStyleId && (
                <div className="mt-6">
                  <label htmlFor="custom-prompt" className="text-sm font-medium text-foreground mb-2 block">
                    {t("generate.customPromptLabel", "Add details")} <span className="text-muted-foreground font-normal">({t("common.optional", "optional")})</span>
                  </label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={t("generate.customPromptPlaceholder", "e.g. Add a golden crown, use warm autumn colors, baroque style background...")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    rows={2}
                    maxLength={200}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">{customPrompt.length}/200</p>
                </div>
              )}
            </motion.div>

            {/* Mix validation */}
            {generationType === "mix" && uploadedFile && !uploadedFile2 && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {t("generate.mixBothRequired", "Both photos are required for Mix mode. Upload photo B to continue.")}
              </div>
            )}

            {/* Low credits warning */}
            {!creditsLoading && (
              <LowCreditsNudge
                creditBalance={creditBalance ?? 0}
                creditCost={creditCost}
                onUpgrade={() => setShowPurchaseModal(true)}
              />
            )}

            {/* Generate button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-md">
                {creditsLoading ? (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("generate.loadingCredits", "Loading your credit balance...")}</p>
                  </div>
                ) : (creditBalance ?? 0) < creditCost ? (
                  <div>
                    <p className="text-muted-foreground mb-4 text-lg">{t("generate.needCredits", "You need at least {{cost}} credits", { cost: creditCost })}</p>
                    <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-xl" onClick={() => setShowPurchaseModal(true)}>
                      <Crown className="mr-2 h-5 w-5" />{t("generate.goPremiumShort", "Go Premium — €15 (1500 credits)")}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">{t("generate.readyToCreate", "Everything looks good! Click the button to create your portrait.")}</p>
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!canGenerate || generating || uploading}
                      className={`rounded-full h-12 sm:h-14 lg:h-16 px-6 sm:px-8 lg:px-12 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-xl transition-all disabled:opacity-40${canGenerate && !generating && !uploading ? " shimmer-btn" : ""}`}
                    >
                      {uploading ? (
                        <><span role="status" aria-label="Uploading"><Loader2 className="mr-3 h-6 w-6 animate-spin" /></span>{t("generate.uploading", "Uploading photos...")}</>
                      ) : (
                        <><Sparkles className="mr-3 h-6 w-6" />{t("generate.generateBtn", "Create My Portrait — {{cost}} credits", { cost: creditCost })}</>
                      )}
                    </Button>
                    {uploading && (
                      <div className="mt-4 max-w-xs mx-auto">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div className="h-full w-1/3 rounded-full bg-primary animate-upload-progress" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{t("generate.uploadingHint", "Preparing your photo for the AI artist...")}</p>
                      </div>
                    )}
                    {!canGenerate && (
                      <p className="text-xs text-muted-foreground mt-3">
                        {!uploadedFile ? t("generate.missingPhoto", "↑ Upload a photo first")
                          : !selectedStyleId ? t("generate.missingStyle", "↑ Select a style first")
                          : generationType === "mix" && !uploadedFile2 ? t("generate.missingPhoto2", "↑ Upload both photos for Mix mode") : ""}
                      </p>
                    )}
                    {!isPremium && canGenerate && (
                      <p className="text-sm text-foreground/70 bg-muted rounded-lg p-2 mt-3">{t("generate.freeNote", "Free plan: preview with watermark. Unlock HD for €4.90/image or go Premium.")}</p>
                    )}
                  </div>
                )}
              </div>
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
