import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Upload, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  aspectRatio: number;           // e.g. 16/9 or 1
  maxSizeMb: number;             // e.g. 10 or 5
  currentUrl?: string | null;    // existing image URL to preview
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
  error?: string;
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y,
        pixelCrop.width, pixelCrop.height,
        0, 0,
        pixelCrop.width, pixelCrop.height,
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob failed"));
      }, "image/jpeg", 0.92);
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}

export function ImageCropper({
  aspectRatio,
  maxSizeMb,
  currentUrl,
  onChange,
  label = "Cover Photo",
  className = "",
  error,
}: ImageCropperProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawSrc, setRawSrc]       = useState<string | null>(null);
  const [crop, setCrop]           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]           = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [fileErr, setFileErr]     = useState<string | null>(null);
  const [cropping, setCropping]   = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileErr(null);

    if (!ACCEPTED.includes(file.type)) {
      setFileErr("Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setFileErr(`File must be under ${maxSizeMb} MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setRawSrc(url);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleCropConfirm = async () => {
    if (!rawSrc || !croppedArea) return;
    setCropping(true);
    try {
      const blob = await getCroppedBlob(rawSrc, croppedArea);
      const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
      setRawSrc(null);
      onChange(file);
    } finally {
      setCropping(false);
    }
  };

  const handleCancel = () => {
    setRawSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = preview ?? currentUrl ?? null;

  const aspectLabel = aspectRatio === 1 ? "1:1" : "16:9";

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>

      {/* Crop modal */}
      {rawSrc && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center gap-4 p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-lg">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="font-semibold text-gray-800 text-sm">Crop Image ({aspectLabel})</p>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="relative w-full bg-gray-900" style={{ height: 320 }}>
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            {/* Zoom controls */}
            <div className="px-5 py-3 flex items-center gap-3 border-t border-gray-50">
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500">
                <ZoomOut size={16} />
              </button>
              <input
                type="range"
                min={1} max={3} step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#1a3a5c]"
              />
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500">
                <ZoomIn size={16} />
              </button>
            </div>
            <div className="px-5 pb-4 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button type="button" size="sm" onClick={handleCropConfirm} disabled={cropping}
                className="bg-[#1a3a5c] text-white hover:bg-[#1a3a5c]/90">
                {cropping ? "Processing…" : "Crop & Use"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview or drop zone */}
      {displayUrl ? (
        <div className="relative inline-block">
          <img
            src={displayUrl}
            alt="Preview"
            className="rounded-xl border border-gray-200 object-cover"
            style={aspectRatio === 1
              ? { width: 120, height: 120 }
              : { width: "100%", maxWidth: 480, aspectRatio: "16/9" }
            }
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/80 transition-colors"
          >
            <Upload size={11} /> Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-[#1a3a5c]/30 hover:text-[#1a3a5c] transition-colors cursor-pointer"
          style={aspectRatio === 1
            ? { width: 120, height: 120 }
            : { width: "100%", maxWidth: 480, aspectRatio: "16/9" }
          }
        >
          <ImageIcon size={28} strokeWidth={1.5} />
          <span className="text-xs font-medium">Click to upload</span>
          <span className="text-xs text-gray-300">{aspectLabel} · max {maxSizeMb} MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {(fileErr || error) && (
        <p className="text-red-500 text-xs">{fileErr ?? error}</p>
      )}
    </div>
  );
}
