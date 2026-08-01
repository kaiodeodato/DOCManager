"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useState } from "react";
import { cx } from "../../utils/cx.js";

export type UploadDropzoneProps = {
  accept?: string;
  disabled?: boolean;
  className?: string;
  onFileSelected: (file: File) => void | Promise<void>;
};

export function UploadDropzone({
  accept = "application/pdf,image/*",
  disabled = false,
  className,
  onFileSelected,
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return;
      setError(null);
      setProgress(10);
      try {
        await onFileSelected(file);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setProgress(null);
      }
    },
    [disabled, onFileSelected],
  );

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <label
      className={cx(
        "dm-upload",
        dragging && "dm-upload--dragging",
        disabled && "dm-upload--disabled",
        className,
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={onInputChange}
        className="dm-upload__input"
      />
      <span className="dm-upload__title">Drop a document or click to browse</span>
      <span className="dm-upload__hint">PDF or image · max 50MB</span>
      {progress != null ? (
        <span className="dm-upload__progress" aria-live="polite">
          {progress}%
        </span>
      ) : null}
      {error ? <span className="dm-upload__error">{error}</span> : null}
    </label>
  );
}
