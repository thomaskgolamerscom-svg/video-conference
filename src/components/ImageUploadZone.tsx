import React, { useState, useRef } from 'react';
import { UploadCloud, X, Check, RefreshCw, Loader2 } from 'lucide-react';
import { AvatarImage } from './AvatarImage';

interface ImageUploadZoneProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  helperText?: string;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  id = 'avatar-upload',
  label = 'Avatar Photo',
  value,
  onChange,
  helperText = 'Drop an image or click to browse (PNG, JPG, WebP)',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Reads any uploaded image via FileReader, converting it into a robust Base64 data URL.
   * To guarantee seamless rendering without crashes or blanks across both Google AI Studio
   * iframes and local VS Code preview webviews (and to prevent URL query parameter truncation
   * when encoded into invitation tokens), large images are cleanly normalized to a crisp
   * high-DPI avatar resolution (max 320x320) as a standard Base64 data URL.
   */
  const processFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/')) {
        setError('Failed to extract Base64 data URL from file.');
        setIsProcessing(false);
        return;
      }

      // Load into an Image to normalize resolution for high-DPI avatar display (max 320x320)
      const img = new Image();
      img.onload = () => {
        try {
          const maxDimension = 320;
          let targetWidth = img.naturalWidth || img.width;
          let targetHeight = img.naturalHeight || img.height;

          if (targetWidth > maxDimension || targetHeight > maxDimension) {
            if (targetWidth > targetHeight) {
              targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
              targetWidth = maxDimension;
            } else {
              targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
              targetHeight = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Retain PNG format if original is PNG (for transparency), else JPEG at high quality
            const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const base64DataUrl = canvas.toDataURL(format, 0.88);
            onChange(base64DataUrl);
          } else {
            // Fallback directly to the FileReader Base64 data URL
            onChange(result);
          }
        } catch {
          // If canvas context throws (e.g. sandbox restriction), fallback directly to FileReader Base64
          onChange(result);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        // Fallback directly to FileReader Base64 data URL if Image element onload fails
        onChange(result);
        setIsProcessing(false);
      };

      img.src = result;
    };

    reader.onerror = () => {
      setError('FileReader encountered an error reading the selected file.');
      setIsProcessing(false);
    };

    // Explicitly read the file as a Base64 data URL
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id={id} className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group rounded-xl border-2 border-dashed p-3 sm:p-4 text-center cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-4 ring-indigo-500/20'
            : value
            ? 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="w-full flex items-center justify-center gap-3 py-2 text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Converting image to Base64 data URL...</span>
          </div>
        ) : value ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <AvatarImage
                src={value}
                alt="Uploaded preview"
                fallbackText="IMG"
                sizeClassName="w-11 h-11"
                className="border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Base64 Image Loaded
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Drop new file or click to replace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Replace image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Drag & drop avatar photo or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {helperText}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 pl-1">
          {error}
        </p>
      )}
    </div>
  );
};

