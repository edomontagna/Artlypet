"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
  label?: string;
  icon?: React.ReactNode;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUpload({
  onFileSelected,
  label = "Drag & drop your photo here",
  icon,
  maxSizeMB = 10,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const acceptTypes = ["image/jpeg", "image/png", "image/webp"];

  function validate(file: File): string | null {
    if (!acceptTypes.includes(file.type)) return "Only JPG, PNG, and WebP files are allowed.";
    if (file.size > maxSizeMB * 1024 * 1024) return `File must be under ${maxSizeMB}MB.`;
    return null;
  }

  function handleFile(file: File) {
    setError(null);
    const err = validate(file);
    if (err) { setError(err); return; }
    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-2xl overflow-hidden bg-muted ${className}`}
      >
        <div className="relative aspect-[4/5] w-full">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
        <button
          onClick={clear}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[300px] ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes.join(",")}
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        {icon || <Upload className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="font-medium text-lg mb-2">{label}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        JPG, PNG or WebP. Max {maxSizeMB}MB.
      </p>
      <Button variant="outline" className="rounded-full" type="button">
        Browse Files
      </Button>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 text-destructive text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
