"use client";

import { useCallback, useState } from "react";

interface FileUploadZoneProps {
  label: string;
  accept: string;
  hint: string;
  file: File | null;
  onFileSelect: (file: File) => void;
}

export default function FileUploadZone({
  label,
  accept,
  hint,
  file,
  onFileSelect,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-indigo-500 bg-indigo-50"
          : file
            ? "border-green-400 bg-green-50"
            : "border-slate-300 hover:border-slate-400 bg-white"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-2">
        <div className="text-3xl">{file ? "\u2705" : "\uD83D\uDCC4"}</div>
        <p className="font-medium text-slate-700">{label}</p>
        {file ? (
          <p className="text-sm text-green-700">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        ) : (
          <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    </div>
  );
}
