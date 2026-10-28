import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ImagePlus, Loader2, X } from "lucide-react";
import FileImage from "./FileImage";

export default function ReferenceUploader({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const addFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
        if (file_uri) uploaded.push(file_uri);
      }
      onChange([...value, ...uploaded]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {value.map((uri, index) => (
          <div
            key={uri}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
          >
            <FileImage fileUri={uri} alt={`Reference ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[9px] uppercase tracking-[0.12em] text-white/70">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((item) => item !== uri))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white/80 opacity-0 transition group-hover:opacity-100 hover:text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-[3/4] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-white/40 transition hover:border-[#E3A75F]/60 hover:text-[#E3A75F] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span className="text-[10px] uppercase tracking-[0.12em]">{busy ? "Uploading" : "Add"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => addFiles(event.target.files)}
      />
      <p className="text-[11px] text-white/30">
        Stored privately. The first image is used as the card cover.
      </p>
    </div>
  );
}