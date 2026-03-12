"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import { Cat, User, Users, ArrowRight, Wand2, Lock, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { STYLES } from "@/lib/constants";

const styleImages: Record<string, string> = {
  watercolor: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/11df905c0481ee4777378ccda14e8d53.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=BUMdElojPVxh1Dc4Gdn3iJ6mHr0=",
  "oil-painting": "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/2a252c27b54eaf33e353a9665ee4e67f.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=hPHHYMghU9ojsV5PP1o6qes8TCU=",
  renaissance: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/be2b3b61eeed3ddcb6783df61f522ca5.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=ZrXoOfErc0aldP6y3LtczYbPwqY=",
  "pop-art": "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/fb53e57b7f68e12383d396589c7954bb.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=gqadLtXxlNIwtC2Y9sMVw8e3vpk=",
  "art-nouveau": "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/f713ef32ea0d54e322f7e455282bf082.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=cEhnB7sNpQ7z/E3ZNzGw/AtAyWw=",
  impressionist: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/3979c646714ab13e36bed746536f1659.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=0lD3Er/8+jFeJx7vQ5i5d5Gd5mY=",
};

const progressSteps = [
  "Analyzing your photo...",
  "Applying artistic brushstrokes...",
  "Adding light and shadows...",
  "Final touches and details...",
  "Your masterpiece is ready!",
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [mode, setMode] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<{ main?: File; second?: File }>({});
  const [progressStep, setProgressStep] = React.useState(0);

  // Placeholder — user tier would come from Supabase
  const userTier: string = "free";

  const modeOptions = [
    { id: "pets", title: "My Pet", icon: Cat, desc: "Dogs, cats, birds, and more.", locked: false },
    { id: "humans", title: "Human", icon: User, desc: "Yourself or a loved one.", locked: false },
    { id: "mix", title: "Mix", icon: Users, desc: "You and your pet together.", locked: userTier === "free" },
  ];

  // Progress animation for step 4
  React.useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= progressSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => router.push("/result/demo"), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [step, router]);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">

        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Create your <span className="text-primary italic">Portrait</span>
            </h1>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Step {step} of 4
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step 1: Mode */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-medium mb-8 text-center">Who is the subject?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modeOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => !m.locked && setMode(m.id)}
                  disabled={m.locked}
                  className={`relative p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                    m.locked
                      ? "border-border opacity-60 cursor-not-allowed"
                      : mode === m.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {m.locked && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="pro" className="text-[10px]">CREATOR+</Badge>
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                    mode === m.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    <m.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mb-2">{m.title}</h3>
                  <p className="text-muted-foreground text-sm">{m.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              <Button
                size="lg"
                className="rounded-full px-8 h-14"
                disabled={!mode}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-medium mb-8 text-center">Upload your photos</h2>

            {mode === "mix" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUpload
                  onFileSelected={(f) => setFiles((prev) => ({ ...prev, main: f }))}
                  label="Upload Human Photo"
                  icon={<User className="w-8 h-8 text-muted-foreground" />}
                />
                <ImageUpload
                  onFileSelected={(f) => setFiles((prev) => ({ ...prev, second: f }))}
                  label="Upload Pet Photo"
                  icon={<Cat className="w-8 h-8 text-muted-foreground" />}
                />
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <ImageUpload
                  onFileSelected={(f) => setFiles({ main: f })}
                  label="Drag & drop your photo here"
                />
              </div>
            )}

            <div className="mt-12 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">Back</Button>
              <Button
                size="lg"
                className="rounded-full px-8 h-14"
                disabled={!files.main || (mode === "mix" && !files.second)}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Style */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-medium mb-8 text-center">Choose an Art Style</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {STYLES.map((s) => {
                const img = styleImages[s.id];
                const isLocked = s.tier === "pro" && userTier !== "pro";
                const isSelected = selectedStyle === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => !isLocked && setSelectedStyle(s.id)}
                    disabled={isLocked}
                    className={`group relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted text-left transition-all duration-300 ${
                      isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    } ${isSelected ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={s.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {isLocked && (
                      <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-white" />
                          <Badge variant="pro">PRO</Badge>
                        </div>
                      </div>
                    )}

                    {!isLocked && !isSelected && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium">Select</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-medium">{s.name}</p>
                      <p className="text-white/70 text-xs">{s.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="rounded-full">Back</Button>
              <Button
                size="lg"
                className="rounded-full px-8 h-14"
                disabled={!selectedStyle}
                onClick={() => setStep(4)}
              >
                Generate Portrait <Wand2 className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Generating */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wand2 className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>

            <h2 className="font-serif text-4xl font-bold mb-4">Creating your masterpiece...</h2>

            <div className="space-y-2 mb-8">
              {progressSteps.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i <= progressStep ? 1 : 0.3 }}
                  className={`text-sm transition-colors duration-300 ${
                    i === progressStep
                      ? "text-primary font-medium"
                      : i < progressStep
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground/30"
                  }`}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            <div className="w-full max-w-md mx-auto bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((progressStep + 1) / progressSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
