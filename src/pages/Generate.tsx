import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Upload, Sparkles, Image as ImageIcon, X, Download, Lock, Crown, Users, AlertCircle, Printer, ArrowRight, Star } from "lucide-react";
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
import { SharePanel } from "@/components/SharePanel";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CreationTheater } from "@/components/CreationTheater";

const Generate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: creditBalance, isLoading: creditsLoading, isError: creditsError } = useCreditBalance();
  const { data: profile, isError: profileError } = useProfile();
  const { data: styles, isLoading: stylesLoading } = useStyles();
  const queryClient = useQueryClient();

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>("single");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile2, setUploadedFile2] = useState<File | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<"hd" | "watermarked" | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const [optimisticCreditDeduction, setOptimisticCreditDeduction] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const creditCost = getCreditCost(generationType);
  const displayCredits = optimisticCreditDeduction > 0
    ? Math.max(0, (creditBalance ?? 0) - optimisticCreditDeduction)
    : (creditBalance ?? 0);

  const { data: generationStatus } = useGenerationStatus(generationId, generating);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  useEffect(() => {
    return () => { if (previewUrl2) URL.revokeObjectURL(previewUrl2); };
  }, [previewUrl2]);

  useEffect(() => {
    if (generationType === "single") {
      if (previewUrl2) URL.revokeObjectURL(previewUrl2);
      setUploadedFile2(null);
      setPreviewUrl2(null);
    }
  }, [generationType]);

  useEffect(() => {
    if (!generationId || !generating) return;
    if (generationStatus?.status === "completed") {
      setGenerating(false);
      setOptimisticCreditDeduction(0);
      getServedImage(generationId)
        .then((data) => { setResultUrl(data.url); setResultMode(data.mode); })
        .catch(() => toast.error("Failed to load result"));
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    } else if (generationStatus?.status === "failed") {
      setGenerating(false);
      setGenerationId(null);
      setShowRetry(true);
      setOptimisticCreditDeduction(0);
      toast.error(generationStatus.error_message || "Generation failed. Credits have been refunded.");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    }
  }, [generationStatus?.status, generationId, generating, queryClient]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error(t("generate.errorNotImage", "Please upload an image file (JPG, PNG, WebP)")); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error(t("generate.errorTooLarge", "File size must be under 10MB")); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null); setResultMode(null); setGenerationId(null);
  }, [previewUrl, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); };
  const removeFile = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); setUploadedFile(null); setPreviewUrl(null); setResultUrl(null); setResultMode(null); setGenerationId(null); };

  const handleFile2 = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error(t("generate.errorNotImage", "Please upload an image file")); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error(t("generate.errorTooLarge", "File size must be under 10MB")); return; }
    if (previewUrl2) URL.revokeObjectURL(previewUrl2);
    setUploadedFile2(file); setPreviewUrl2(URL.createObjectURL(file));
  }, [previewUrl2, t]);

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile2(file); };
  const handleDragOver2 = (e: React.DragEvent) => { e.preventDefault(); setIsDragging2(true); };
  const handleDragLeave2 = (e: React.DragEvent) => { e.preventDefault(); setIsDragging2(false); };
  const handleDrop2 = (e: React.DragEvent) => { e.preventDefault(); setIsDragging2(false); const file = e.dataTransfer.files[0]; if (file) handleFile2(file); };
  const removeFile2 = () => { if (previewUrl2) URL.revokeObjectURL(previewUrl2); setUploadedFile2(null); setPreviewUrl2(null); };

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedStyleId || !user || (creditBalance ?? 0) < creditCost) return;
    if (generationType === "mix" && !uploadedFile2) return;
    setGenerating(true); setGenerationStartTime(Date.now()); setShowRetry(false); setOptimisticCreditDeduction(creditCost);
    try {
      const original = await uploadOriginalImage(user.id, uploadedFile);
      let originalId2: string | undefined;
      if (generationType === "mix" && uploadedFile2) { const original2 = await uploadOriginalImage(user.id, uploadedFile2); originalId2 = original2.id; }
      const result = await requestGeneration(original.id, selectedStyleId, generationType, originalId2);
      setGenerationId(result.generation_id);
      toast.success(t("generate.generationStarted", "Generation started! This may take up to 60 seconds."));
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to start generation"); setGenerating(false); setOptimisticCreditDeduction(0); }
  };

  const handleUnlockHd = async () => {
    if (!generationId) return;
    try { const { url } = await purchaseHdImage(generationId); if (url) window.location.href = url; }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to start HD unlock"); }
  };

  const canGenerate = uploadedFile && selectedStyleId && (creditBalance ?? 0) >= creditCost && (generationType === "single" || uploadedFile2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-serif text-xl font-bold text-primary">{t("generate.title", "Create Portrait")}</h1>
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

      <div className="container px-4 lg:px-8 py-8 max-w-4xl">

        {(creditsError || profileError) && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{t("generate.loadError", "Could not load your account data. Please refresh and try again.")}</p>
          </div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/*  RESULT — Celebration & Next Steps     */}
        {/* ═══════════════════════════════════════ */}
        {resultUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            {/* Success header */}
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                {t("generate.portraitReady", "Your Portrait is Ready!")}
              </h2>
              <p className="text-muted-foreground">
                {t("generate.portraitReadyDesc", "Here's your masterpiece. Choose what to do next.")}
              </p>
            </div>

            {/* Before / After — interactive drag slider */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
            {previewUrl ? (
              <div className="max-w-xl mx-auto">
                <BeforeAfterSlider beforeUrl={previewUrl} afterUrl={resultUrl} />
              </div>
            ) : (
              <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-primary relative">
                <img src={resultUrl} alt="Generated portrait" className="w-full" />
                {resultMode === "watermarked" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="rotate-[-30deg] opacity-25">
                      {[0, 1, 2].map((i) => (
                        <p key={i} className="text-white font-serif text-3xl font-bold tracking-widest mb-12 select-none" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                          Artlypet &nbsp; Artlypet
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            </motion.div>

            {/* ══ WHAT TO DO NEXT — Big, clear action cards ══ */}
            <div className="space-y-4 max-w-2xl mx-auto">

              <h3 className="font-serif text-xl font-bold text-foreground text-center">
                {t("generate.whatNext", "What would you like to do?")}
              </h3>

              {/* Card 1: HD Unlock (FREE users only) */}
              {resultMode === "watermarked" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Download className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                          {t("generate.unlockHdTitle", "Download in Full HD")}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t("generate.unlockHdDesc", "Remove the watermark and get your portrait in stunning 2K resolution, perfect for printing and sharing.")}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Button onClick={handleUnlockHd} size="lg" className="rounded-full gap-2 shadow-lg h-12 px-8 text-base">
                            <Lock className="h-4 w-4" />
                            {t("generate.unlockHdBtn", "Unlock HD — €4.90")}
                          </Button>
                          <span className="text-xs text-muted-foreground">{t("generate.oneTimePayment", "One-time payment")}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Card 2: Go Premium (FREE users only) */}
              {!isPremium && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Crown className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                          {t("generate.premiumTitle", "Go Premium — Save Big")}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {t("generate.premiumDesc", "1500 credits + ALL images in HD + discounted prints. No more watermarks, ever.")}
                        </p>
                        <p className="text-xs text-primary font-medium mb-3">
                          {t("generate.premiumSaving", "5 HD images would cost €24.50 — Premium is just €15!")}
                        </p>
                        <Button variant="outline" size="lg" className="rounded-full gap-2 h-12 px-8 text-base border-primary/30 text-primary hover:bg-primary/5" onClick={() => setShowPurchaseModal(true)}>
                            <Crown className="h-4 w-4" />
                            {t("generate.premiumBtn", "Go Premium — €15")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Card 3: Canvas Print (ALWAYS visible) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Printer className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                        {t("generate.printTitle", "Print on Canvas")}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t("generate.printDesc2", "Museum-quality canvas print, shipped directly to your door. Perfect as a gift or wall decoration.")}
                      </p>
                      {resultMode === "watermarked" && (
                        <p className="text-xs text-muted-foreground mb-2 italic">
                          {t("generate.printRequiresHd", "Requires HD unlock or Premium plan")}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Button variant="outline" asChild size="lg" className="rounded-full gap-2 h-12 px-8 text-base">
                          <Link to="/prints">
                            <Printer className="h-4 w-4" />
                            {t("generate.printBtn", "Order Canvas — {{price}}", { price: isPremium ? "€59.90" : "€79.90" })}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Card 4: Download (HD users) */}
              {resultMode === "hd" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <Card className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Download className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-bold text-foreground mb-1">
                          {t("generate.downloadTitle", "Download Your Portrait")}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t("generate.downloadDesc", "Full 2K HD resolution, no watermark. Ready to print or share.")}
                        </p>
                        <Button asChild size="lg" className="rounded-full gap-2 shadow-lg h-12 px-8 text-base">
                          <a href={resultUrl} target="_blank" rel="noopener noreferrer" download="artlypet-portrait-HD.png">
                            <Download className="h-4 w-4" />
                            {t("generate.downloadHd", "Download HD")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Download preview for free users */}
              {resultMode === "watermarked" && (
                <div className="text-center">
                  <Button variant="ghost" asChild className="rounded-full gap-2 text-muted-foreground text-sm">
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3" />
                      {t("generate.downloadPreview", "View watermarked preview")}
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Share */}
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {t("generate.shareHeading", "Share your masterpiece!")}
              </h3>
              <SharePanel imageUrl={resultUrl} />
            </div>

            {/* Create another */}
            <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
              <Button variant="outline" className="rounded-full gap-2" onClick={() => { setResultUrl(null); setResultMode(null); setGenerationId(null); setSelectedStyleId(null); }}>
                <Star className="h-4 w-4" />
                {t("generate.tryDifferentStyle", "Try Different Style")}
              </Button>
              <Button variant="outline" className="rounded-full gap-2" onClick={() => { setResultUrl(null); setResultMode(null); setGenerationId(null); removeFile(); }}>
                <ImageIcon className="h-4 w-4" />
                {t("generate.createAnother", "Create Another Portrait")}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/*  GENERATING — Creation Theater          */}
        {/* ═══════════════════════════════════════ */}
        {generating && !resultUrl && (
          <CreationTheater previewUrl={previewUrl} styleName={styles?.find((s) => s.id === selectedStyleId)?.name} startTime={generationStartTime} />
        )}

        {/* ═══════════════════════════════════════ */}
        {/*  RETRY after failure                    */}
        {/* ═══════════════════════════════════════ */}
        {showRetry && !generating && !resultUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
              {t("generate.generationFailed", "Generation Failed")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("generate.failedDesc", "Something went wrong. Don't worry — your credits have been automatically refunded.")}
            </p>
            <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-xl" onClick={() => setShowRetry(false)}>
              {t("generate.tryAgain", "Try Again")}
            </Button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/*  CREATE FLOW — Steps 1-4                */}
        {/* ═══════════════════════════════════════ */}
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
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step.done
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {step.num}
                    </div>
                    {i < 2 && (
                      <div className={`w-16 h-0.5 transition-all duration-500 ${
                        step.done ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 1: Choose type ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {t("generate.step2Title", "Choose generation type")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  onClick={() => setGenerationType("single")}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    generationType === "single" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
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
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    generationType === "mix" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
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

            {/* ── Step 2: Upload photos ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {generationType === "mix"
                    ? t("generate.uploadBothTitle", "Upload both photos")
                    : t("generate.step1Title", "Upload your photo")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("generate.uploadTip", "Use a clear, well-lit photo where the face is visible. The better the photo, the better the portrait!")}
              </p>
              <details className="mb-4 text-sm">
                <summary className="text-primary cursor-pointer hover:underline font-medium">
                  {t("generate.photoTipsToggle", "Photo tips for best results")}
                </summary>
                <ul className="mt-2 space-y-1 text-muted-foreground pl-4 list-disc">
                  <li>{t("generate.tip1", "Natural daylight works best — avoid harsh flash")}</li>
                  <li>{t("generate.tip2", "Face clearly visible, looking towards the camera")}</li>
                  <li>{t("generate.tip3", "Simple background — avoid busy or cluttered scenes")}</li>
                  <li>{t("generate.tip4", "High resolution photo — at least 500×500px")}</li>
                </ul>
              </details>

              <div className={generationType === "mix" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "max-w-md"}>
                {/* Upload 1 */}
                <div>
                  {generationType === "mix" && (
                    <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">A</span>
                      {t("generate.petPhoto", "Your pet's photo")}
                    </p>
                  )}
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Pet preview" className="w-full max-h-72 rounded-2xl object-contain shadow-md border border-border" />
                      <button onClick={removeFile} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 shadow-md">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-[200px] p-8 cursor-pointer transition-all ${
                        isDragging ? "border-primary bg-primary/10 shadow-inner" : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <Upload className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <span className="text-sm font-medium text-foreground mb-1">{t("generate.uploadCta", "Click to upload or drag & drop")}</span>
                      <span className="text-xs text-muted-foreground">{t("generate.fileFormats", "JPG, PNG, WebP — max 10MB")}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Upload 2 (mix only) */}
                {generationType === "mix" && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">B</span>
                      {t("generate.personPhoto", "Your photo (person)")}
                    </p>
                    {previewUrl2 ? (
                      <div className="relative">
                        <img src={previewUrl2} alt="Person preview" className="w-full max-h-72 rounded-2xl object-contain shadow-md border border-border" />
                        <button onClick={removeFile2} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 shadow-md">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label onDragOver={handleDragOver2} onDragLeave={handleDragLeave2} onDrop={handleDrop2}
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-[200px] p-8 cursor-pointer transition-all ${
                          isDragging2 ? "border-primary bg-primary/10 shadow-inner" : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <span className="text-sm font-medium text-foreground mb-1">{t("generate.uploadCta", "Click to upload or drag & drop")}</span>
                        <span className="text-xs text-muted-foreground">{t("generate.fileFormats", "JPG, PNG, WebP — max 10MB")}</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile2Change} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Step 3: Choose style ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {t("generate.step3Title", "Choose your style")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("generate.step3Desc", "Select the artistic style for your portrait")}
              </p>
              {stylesLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {styles?.map((style) => (
                    <Card
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`relative aspect-square overflow-hidden cursor-pointer transition-all duration-200 rounded-2xl ${
                        selectedStyleId === style.id
                          ? "ring-3 ring-primary ring-offset-2 ring-offset-background scale-[1.03] shadow-lg"
                          : "shadow-sm hover:shadow-md"
                      }`}
                    >
                      {style.preview_url ? (
                        <img src={style.preview_url} alt={style.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
              )}
            </motion.div>

            {/* ══ GENERATE BUTTON — BIG, IMPOSSIBLE TO MISS ══ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-md">
                {(creditBalance ?? 0) < creditCost ? (
                  <div>
                    <p className="text-muted-foreground mb-4 text-lg">
                      {t("generate.needCredits", "You need at least {{cost}} credits", { cost: creditCost })}
                    </p>
                    <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-xl" onClick={() => setShowPurchaseModal(true)}>
                        <Crown className="mr-2 h-5 w-5" />
                        {t("generate.goPremiumShort", "Go Premium — €15 (1500 credits)")}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("generate.readyToCreate", "Everything looks good! Click the button to create your portrait.")}
                    </p>
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className={`rounded-full h-16 px-12 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all disabled:opacity-40${canGenerate ? " shimmer-btn" : ""}`}
                    >
                      <Sparkles className="mr-3 h-6 w-6" />
                      {t("generate.generateBtn", "Create My Portrait — {{cost}} credits", { cost: creditCost })}
                    </Button>
                    {!canGenerate && (
                      <p className="text-xs text-muted-foreground mt-3">
                        {!uploadedFile
                          ? t("generate.missingPhoto", "↑ Upload a photo first")
                          : !selectedStyleId
                          ? t("generate.missingStyle", "↑ Select a style first")
                          : generationType === "mix" && !uploadedFile2
                          ? t("generate.missingPhoto2", "↑ Upload both photos for Mix mode")
                          : ""}
                      </p>
                    )}
                    {!isPremium && canGenerate && (
                      <p className="text-xs text-muted-foreground mt-3">
                        {t("generate.freeNote", "Free plan: preview with watermark. Unlock HD for €4.90/image or go Premium.")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <CreditPurchaseModal open={showPurchaseModal} onOpenChange={setShowPurchaseModal} />
    </div>
  );
};

export default Generate;
