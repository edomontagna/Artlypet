import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Upload, Sparkles, Image as ImageIcon, X, Download, Share2, Lock, Crown, Users } from "lucide-react";
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

const Generate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: creditBalance, isLoading: creditsLoading } = useCreditBalance();
  const { data: profile } = useProfile();
  const { data: styles, isLoading: stylesLoading } = useStyles();
  const queryClient = useQueryClient();

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>("single");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<"hd" | "watermarked" | null>(null);

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const creditCost = getCreditCost(generationType);

  const { data: generationStatus } = useGenerationStatus(generationId, generating);

  // Cleanup object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Handle generation completion — use serve-image to get correct quality
  useEffect(() => {
    if (!generationId || !generating) return;

    if (generationStatus?.status === "completed") {
      setGenerating(false);
      getServedImage(generationId)
        .then((data) => {
          setResultUrl(data.url);
          setResultMode(data.mode);
        })
        .catch(() => toast.error("Failed to load result"));
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    } else if (generationStatus?.status === "failed") {
      setGenerating(false);
      setGenerationId(null);
      toast.error(generationStatus.error_message || "Generation failed. Credits have been refunded.");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    }
  }, [generationStatus?.status, generationId, generating, queryClient]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setResultMode(null);
    setGenerationId(null);
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultMode(null);
    setGenerationId(null);
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedStyleId || !user || (creditBalance ?? 0) < creditCost) return;

    setGenerating(true);
    try {
      const original = await uploadOriginalImage(user.id, uploadedFile);
      const result = await requestGeneration(original.id, selectedStyleId, generationType);
      setGenerationId(result.generation_id);
      toast.success(t("generate.generationStarted", "Generation started! This may take up to 60 seconds."));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start generation");
      setGenerating(false);
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
              {creditsLoading ? <Skeleton className="h-4 w-8 inline-block" /> : (creditBalance ?? 0)} {t("generate.credits", "credits")}
            </span>
          </div>
        </div>
      </header>

      <div className="container px-4 lg:px-8 py-10 max-w-5xl">
        {/* Result display */}
        {resultUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 text-center"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {t("generate.portraitReady", "Your Portrait is Ready!")}
            </h2>

            {/* Image with optional watermark overlay */}
            <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl border border-border relative">
              <img
                src={resultUrl}
                alt="Generated portrait"
                className="w-full"
                style={resultMode === "watermarked" ? { maxWidth: "768px" } : undefined}
              />
              {resultMode === "watermarked" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rotate-[-30deg] opacity-30">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <p key={i} className="text-white font-serif text-4xl font-bold tracking-widest mb-16 select-none" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                        Artlypet &nbsp; Artlypet &nbsp; Artlypet
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Watermark notice + Unlock HD */}
            {resultMode === "watermarked" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl border border-primary/20 bg-primary/5"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  {t("generate.watermarkedPreview", "Preview with watermark — Unlock HD for full resolution without watermark")}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button onClick={handleUnlockHd} className="rounded-full gap-2 shadow-md">
                    <Lock className="h-4 w-4" />
                    {t("generate.unlockHd", "Unlock HD — €4.90")}
                  </Button>
                  <Button variant="outline" asChild className="rounded-full gap-2">
                    <Link to="/dashboard?upgrade=true">
                      <Crown className="h-4 w-4" />
                      {t("generate.goPremium", "Go Premium — €15")}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Download/Share for HD images */}
            {resultMode === "hd" && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button asChild className="rounded-full gap-2 shadow-md">
                  <a href={resultUrl} download="artlypet-portrait.png">
                    <Download className="h-4 w-4" />
                    {t("generate.downloadHd", "Download HD")}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: "My Artlypet Portrait", url: resultUrl });
                    } else {
                      navigator.clipboard.writeText(resultUrl);
                      toast.success("Link copied to clipboard");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  {t("generate.share", "Share")}
                </Button>
              </div>
            )}

            {/* Download watermarked version for free users */}
            {resultMode === "watermarked" && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button variant="ghost" asChild className="rounded-full gap-2 text-muted-foreground">
                  <a href={resultUrl} download="artlypet-preview.jpg">
                    <Download className="h-4 w-4" />
                    {t("generate.downloadPreview", "Download Preview")}
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Generation in progress */}
        {generating && !resultUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              {t("generate.creating", "Creating Your Portrait...")}
            </h2>
            <p className="text-muted-foreground">
              {t("generate.creatingDesc", "This usually takes 30-60 seconds. Please don't close this page.")}
            </p>
          </motion.div>
        )}

        {/* Upload + Style selection (hidden during generation) */}
        {!generating && !resultUrl && (
          <>
            {/* Step 1: Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {t("generate.step1Title", "1. Upload your photo")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("generate.step1Desc", "Choose a clear, well-lit photo of your pet or person")}
              </p>

              {previewUrl ? (
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="max-h-64 rounded-2xl object-contain shadow-md" />
                  <button
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <Upload className="h-10 w-10 text-muted-foreground/40 mb-4" />
                  <span className="text-sm text-muted-foreground">{t("generate.uploadCta", "Click to upload or drag & drop")}</span>
                  <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP — max 10MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </motion.div>

            {/* Step 2: Generation Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-12"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {t("generate.step2Title", "2. Choose generation type")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("generate.step2Desc", "Single subject or a mix of pet and person")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <Card
                  onClick={() => setGenerationType("single")}
                  className={`rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                    generationType === "single"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <span className="font-serif font-semibold">{t("generate.single", "Single")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("generate.singleDesc", "One pet or one person")}</p>
                  <p className="text-sm font-medium text-primary mt-2">{CREDIT_COST_SINGLE} {t("generate.credits", "credits")}</p>
                </Card>

                <Card
                  onClick={() => setGenerationType("mix")}
                  className={`rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                    generationType === "mix"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-serif font-semibold">{t("generate.mix", "Mix")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("generate.mixDesc", "Pet + person together")}</p>
                  <p className="text-sm font-medium text-primary mt-2">{CREDIT_COST_MIX} {t("generate.credits", "credits")}</p>
                </Card>
              </div>
            </motion.div>

            {/* Step 3: Choose Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {t("generate.step3Title", "3. Choose your style")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("generate.step3Desc", "Select the artistic style for your portrait")}
              </p>

              {stylesLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="aspect-square rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {styles?.map((style) => (
                    <Card
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`relative aspect-square overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl shadow-sm ${
                        selectedStyleId === style.id
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02] shadow-md"
                          : "hover:shadow-md"
                      }`}
                    >
                      {style.preview_url ? (
                        <img
                          src={style.preview_url}
                          alt={style.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <span className="font-serif text-sm font-semibold text-primary-foreground block">{style.name}</span>
                        {style.description && (
                          <span className="text-xs text-primary-foreground/70">{style.description}</span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Step 4: Generate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              {(creditBalance ?? 0) < creditCost ? (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm mb-4">
                  <p className="text-muted-foreground mb-3">
                    {t("generate.needCredits", "You need at least {{cost}} credits to generate this portrait", { cost: creditCost })}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button asChild className="rounded-full shadow-md">
                      <Link to="/dashboard?upgrade=true">
                        {t("generate.goPremiumShort", "Go Premium — €15 (1500 credits)")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!uploadedFile || !selectedStyleId}
                  className="rounded-full px-10 h-13 text-base shadow-xl"
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  {t("generate.generateBtn", "Generate Portrait ({{cost}} credits)", { cost: creditCost })}
                </Button>
              )}

              {!isPremium && (creditBalance ?? 0) >= creditCost && (
                <p className="text-xs text-muted-foreground mt-3">
                  {t("generate.freeNote", "Free plan: preview with watermark. Unlock HD for €4.90/image or go Premium.")}
                </p>
              )}
            </motion.div>
          </>
        )}

        {/* New portrait button after result */}
        {resultUrl && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setResultUrl(null);
                setResultMode(null);
                setGenerationId(null);
                removeFile();
              }}
            >
              {t("generate.createAnother", "Create Another Portrait")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
