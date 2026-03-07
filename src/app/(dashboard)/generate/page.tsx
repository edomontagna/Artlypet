'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Sparkles, ArrowRight, ArrowLeft, Wand2, Download, ShoppingCart, PawPrint, User, Blend, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ART_STYLES } from '@/config/styles';
import { useStore } from '@/store/useStore';
import { GenerationMode } from '@/types';
import { cn } from '@/lib/utils';

const modes: { id: GenerationMode; label: string; icon: typeof PawPrint; desc: string; color: string }[] = [
  { id: 'animals', label: 'Pet Portrait', icon: PawPrint, desc: 'Transform your pet photo', color: 'from-violet-500 to-indigo-500' },
  { id: 'humans', label: 'Human Portrait', icon: User, desc: 'Create an artistic portrait', color: 'from-pink-500 to-rose-500' },
  { id: 'mix', label: 'Creative Mix', icon: Blend, desc: 'Combine two photos together', color: 'from-amber-500 to-orange-500' },
];

type Step = 'mode' | 'upload' | 'style' | 'generating' | 'result';

export default function GeneratePage() {
  const [step, setStep] = useState<Step>('mode');
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const {
    selectedMode, setSelectedMode,
    selectedStyle, setSelectedStyle,
    uploadedImage, setUploadedImage,
    uploadedImage2, setUploadedImage2,
    isGenerating, setIsGenerating,
  } = useStore();

  const onDrop1 = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setUploadedImage(file);
      setPreview1(URL.createObjectURL(file));
    }
  }, [setUploadedImage]);

  const onDrop2 = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setUploadedImage2(file);
      setPreview2(URL.createObjectURL(file));
    }
  }, [setUploadedImage2]);

  const dropzone1 = useDropzone({
    onDrop: onDrop1,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const dropzone2 = useDropzone({
    onDrop: onDrop2,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return;
    setStep('generating');
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      if (uploadedImage2) formData.append('image2', uploadedImage2);
      formData.append('mode', selectedMode);
      formData.append('style', selectedStyle);
      formData.append('resolution', '1080x1527');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setStep('result');
    } catch {
      setStep('style');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setStep('mode');
    setSelectedStyle(null);
    setUploadedImage(null);
    setUploadedImage2(null);
    setPreview1(null);
    setPreview2(null);
    setGeneratedImage(null);
  };

  const stepIndex = ['mode', 'upload', 'style', 'generating', 'result'].indexOf(step);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Mode', 'Upload', 'Style', 'Create', 'Result'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500',
                  i <= stepIndex
                    ? 'bg-gradient-to-br from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-gray-600 border border-white/10'
                )}>
                  {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < 4 && (
                  <div className={cn(
                    'hidden sm:block w-16 lg:w-24 h-0.5 mx-2 transition-all duration-500',
                    i < stepIndex ? 'bg-gradient-to-r from-violet-600 to-pink-600' : 'bg-white/10'
                  )} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Mode Selection */}
          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">What would you like to create?</h2>
                <p className="text-gray-400">Choose your creation mode</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {modes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;
                  return (
                    <motion.div
                      key={mode.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedMode(mode.id); setStep('upload'); }}
                      className={cn(
                        'relative cursor-pointer rounded-2xl border p-6 text-center transition-all duration-300',
                        isSelected
                          ? 'border-violet-500/50 bg-violet-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      )}
                    >
                      <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center', mode.color)}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{mode.label}</h3>
                      <p className="text-sm text-gray-400">{mode.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Upload */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedMode === 'mix' ? 'Upload Your Photos' : 'Upload Your Photo'}
                </h2>
                <p className="text-gray-400">
                  {selectedMode === 'mix'
                    ? 'Upload two photos to combine into one artwork'
                    : 'For best results, use a clear, well-lit photo'}
                </p>
              </div>

              <div className={cn('grid gap-6', selectedMode === 'mix' ? 'sm:grid-cols-2' : 'max-w-lg mx-auto')}>
                {/* Upload Zone 1 */}
                <Card>
                  <CardContent className="p-6">
                    {selectedMode === 'mix' && (
                      <p className="text-sm text-gray-400 mb-3 font-medium">Photo 1 (Human or Animal)</p>
                    )}
                    {preview1 ? (
                      <div className="relative">
                        <img src={preview1} alt="Preview" className="w-full rounded-xl object-cover aspect-[3/4]" />
                        <button
                          onClick={() => { setPreview1(null); setUploadedImage(null); }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        {...dropzone1.getRootProps()}
                        className={cn(
                          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 aspect-[3/4] flex flex-col items-center justify-center',
                          dropzone1.isDragActive
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
                        )}
                      >
                        <input {...dropzone1.getInputProps()} />
                        <Upload className="w-10 h-10 text-gray-500 mb-4" />
                        <p className="text-sm text-gray-400 mb-1">
                          {dropzone1.isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-xs text-gray-600">JPG, PNG, WEBP (max 10MB)</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upload Zone 2 (Mix mode only) */}
                {selectedMode === 'mix' && (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-400 mb-3 font-medium">Photo 2 (Human or Animal)</p>
                      {preview2 ? (
                        <div className="relative">
                          <img src={preview2} alt="Preview 2" className="w-full rounded-xl object-cover aspect-[3/4]" />
                          <button
                            onClick={() => { setPreview2(null); setUploadedImage2(null); }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          {...dropzone2.getRootProps()}
                          className={cn(
                            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 aspect-[3/4] flex flex-col items-center justify-center',
                            dropzone2.isDragActive
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-white/10 hover:border-pink-500/50 hover:bg-white/5'
                          )}
                        >
                          <input {...dropzone2.getInputProps()} />
                          <Upload className="w-10 h-10 text-gray-500 mb-4" />
                          <p className="text-sm text-gray-400 mb-1">
                            {dropzone2.isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
                          </p>
                          <p className="text-xs text-gray-600">JPG, PNG, WEBP (max 10MB)</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep('mode')}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={() => setStep('style')}
                  disabled={!preview1 || (selectedMode === 'mix' && !preview2)}
                >
                  Choose Style <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Style Selection */}
          {step === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Art Style</h2>
                <p className="text-gray-400">Select the style that speaks to you</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {ART_STYLES.map((style) => (
                  <motion.div
                    key={style.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      'relative cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300',
                      selectedStyle === style.id
                        ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-violet-950/50 to-pink-950/30 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-violet-400/50" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">{style.name}</h3>
                        {style.premium && <Badge variant="premium" className="text-[10px] px-1.5">Pro</Badge>}
                      </div>
                    </div>
                    {selectedStyle === style.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep('upload')}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleGenerate} disabled={!selectedStyle}>
                  <Wand2 className="w-4 h-4" /> Generate Artwork
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Generating */}
          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 mx-auto mb-8 rounded-full border-4 border-violet-500/20 border-t-violet-500 shadow-lg shadow-violet-500/20"
              />
              <h2 className="text-2xl font-bold text-white mb-3">Creating Your Masterpiece</h2>
              <p className="text-gray-400 mb-2">Our AI is working its magic...</p>
              <p className="text-sm text-gray-600">This usually takes 15-30 seconds</p>

              <motion.div
                className="mt-8 flex justify-center gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 rounded-full bg-violet-500"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step 5: Result */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
                >
                  <Check className="w-4 h-4" />
                  Artwork Created Successfully!
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Masterpiece</h2>
              </div>

              <div className="max-w-lg mx-auto">
                <Card className="overflow-hidden">
                  <div className="aspect-[3/4] bg-gradient-to-br from-violet-950/50 to-pink-950/30 flex items-center justify-center">
                    {generatedImage ? (
                      <img src={generatedImage} alt="Generated artwork" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-8">
                        <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-4" />
                        <p className="text-gray-400">Your artwork preview</p>
                        <p className="text-xs text-gray-600 mt-1">Connect AI provider to see results</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="secondary" size="lg">
                  <Download className="w-5 h-5" />
                  Download HD
                </Button>
                <Button size="lg">
                  <ShoppingCart className="w-5 h-5" />
                  Order Print
                </Button>
              </div>

              <div className="text-center pt-4">
                <Button variant="ghost" onClick={resetFlow}>
                  Create Another <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
