import { useEffect } from "react";
import { Upload, Users, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { GenerationType } from "@/lib/constants";

interface UploadSectionProps {
  generationType: GenerationType;
  onFile1Change: (file: File | null) => void;
  onFile2Change: (file: File | null) => void;
  onPreview1Change?: (url: string | null) => void;
}

export const UploadSection = ({ generationType, onFile1Change, onFile2Change, onPreview1Change }: UploadSectionProps) => {
  const { t } = useTranslation();
  const slot1 = useFileUpload({ onFileChange: onFile1Change });
  const slot2 = useFileUpload({ onFileChange: onFile2Change });

  // Expose primary preview URL to parent (for ResultPanel before/after slider)
  const slot1PreviewUrl = slot1.previewUrl;
  useEffect(() => {
    onPreview1Change?.(slot1PreviewUrl);
  }, [slot1PreviewUrl, onPreview1Change]);

  // Clear slot 2 when switching back to single mode
  const slot2RemoveFile = slot2.removeFile;
  const slot2HasFile = !!slot2.file;
  useEffect(() => {
    if (generationType === "single" && slot2HasFile) {
      slot2RemoveFile();
    }
  }, [generationType, slot2HasFile, slot2RemoveFile]);

  const renderUploadZone = (
    slot: ReturnType<typeof useFileUpload>,
    inputId: string,
    label: string,
    icon: React.ReactNode,
  ) => {
    if (slot.compressing && !slot.previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 min-h-[160px] sm:min-h-[200px] p-4 sm:p-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-sm font-medium text-foreground">{t("generate.optimizing", "Optimizing image...")}</span>
        </div>
      );
    }

    if (slot.previewUrl) {
      return (
        <div className="relative">
          <img src={slot.previewUrl} alt={label} className="w-full max-h-72 rounded-2xl object-contain shadow-md border border-border" />
          <button
            onClick={slot.removeFile}
            aria-label={t("generate.removeImage", "Remove image")}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <label
        htmlFor={inputId}
        aria-label={label}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById(inputId)?.click(); } }}
        {...slot.dragProps}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-[160px] sm:min-h-[200px] p-4 sm:p-8 cursor-pointer transition-all ${
          slot.isDragging ? "border-primary bg-primary/10 shadow-inner" : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        {icon}
        <span className="text-sm font-medium text-foreground mb-1">{t("generate.uploadCta", "Click to upload or drag & drop")}</span>
        <span className="text-xs text-muted-foreground">{t("generate.fileFormats", "JPG, PNG, WebP — max 10MB")}</span>
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={slot.handleInputChange} className="hidden" />
      </label>
    );
  };

  return (
    <div>
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
        <div>
          {generationType === "mix" && (
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">A</span>
              {t("generate.petPhoto", "Your pet's photo")}
            </p>
          )}
          {renderUploadZone(slot1, "upload-pet-photo", "Pet preview", <Upload className="h-12 w-12 text-muted-foreground/30 mb-3" />)}
        </div>

        {generationType === "mix" && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">B</span>
              {t("generate.personPhoto", "Your photo (person)")}
            </p>
            {renderUploadZone(slot2, "upload-second-photo", "Person preview", <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />)}
          </div>
        )}
      </div>
    </div>
  );
};
