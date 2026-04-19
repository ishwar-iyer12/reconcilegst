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
        <div className="flex justify-center">
          {file ? (
            <svg
              className="h-10 w-10 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          ) : (
            <svg
              className="h-10 w-10 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>
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
