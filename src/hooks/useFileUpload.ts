import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { compressImage } from "@/lib/imageCompression";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface UseFileUploadOptions {
  maxSizeMb?: number;
  onFileChange?: (file: File | null) => void;
}

export const useFileUpload = ({ maxSizeMb = 10, onFileChange }: UseFileUploadOptions = {}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => { if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current); };
  }, []);

  const handleFile = useCallback(async (incoming: File) => {
    if (!ALLOWED_TYPES.includes(incoming.type)) {
      toast.error(t("generate.errorNotImage", "Please upload an image file (JPG, PNG, WebP)"));
      return;
    }
    if (incoming.size > maxSizeMb * 1024 * 1024) {
      toast.error(t("generate.errorTooLarge", "File size must be under 10MB"));
      return;
    }
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);

    setCompressing(true);
    let result: File;
    try {
      result = await compressImage(incoming);
    } catch {
      result = incoming;
    } finally {
      setCompressing(false);
    }
    const url = URL.createObjectURL(result);
    prevUrlRef.current = url;
    setFile(result);
    setPreviewUrl(url);
    onFileChange?.(result);
  }, [maxSizeMb, t, onFileChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const removeFile = useCallback(() => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    prevUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    onFileChange?.(null);
  }, [onFileChange]);

  const dragProps = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); },
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); },
  };

  return { file, previewUrl, isDragging, compressing, handleFile, handleInputChange, dragProps, removeFile };
};
