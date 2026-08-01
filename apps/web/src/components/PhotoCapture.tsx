"use client";

import { useCallback, useRef, useState } from "react";

export type PhotoCaptureProps = {
  onCapture?: (blob: Blob) => void;
  facingMode?: "environment" | "user";
};

/**
 * Camera capture via getUserMedia / capture attribute (E13.02).
 */
export function PhotoCapture({
  onCapture,
  facingMode = "environment",
}: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("getUserMedia_unsupported");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
        setActive(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "camera_error");
    }
  }, [facingMode]);

  const stop = useCallback(() => {
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
    setActive(false);
  }, []);

  const snap = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92),
    );
    if (blob) onCapture?.(blob);
  }, [onCapture]);

  return (
    <div className="flex flex-col gap-3">
      <video
        ref={videoRef}
        className="aspect-video w-full max-w-lg rounded-xl bg-slate-100 object-cover"
        playsInline
        muted
      />
      <div className="flex flex-wrap gap-2">
        {!active ? (
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            onClick={() => void start()}
          >
            Abrir câmara
          </button>
        ) : (
          <>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              onClick={() => void snap()}
            >
              Capturar
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
              onClick={stop}
            >
              Fechar
            </button>
          </>
        )}
        <label className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
          Galeria / ficheiro
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onCapture?.(file);
            }}
          />
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
