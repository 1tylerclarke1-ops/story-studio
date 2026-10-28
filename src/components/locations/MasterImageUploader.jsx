import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ImagePlus, Loader2, X } from "lucide-react";
import FileImage from "@/components/characters/FileImage";

export default function MasterImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const addFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      if (file_uri) onChange(file_uri);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative w-32 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          <div className="aspect-[4/5]">
            <FileImage fileUri={value} alt="Master image" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-2 py-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[10px] uppercase tracking-[0.12em] text-white/45 transition hover:text-[#E3A75F]"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-white/35 transition hover:text-white"
              aria-label="Remove master image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="h-4 w-4 animate-spin text-[#E3A75F]" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-[160px] w-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-white/40 transition hover:border-[#E3A75F]/60 hover:text-[#E3A75F] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span className="text-[10px] uppercase tracking-[0.12em]">{busy ? "Uploading" : "Upload"}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => addFile(event.target.files?.[0])}
      />
      <p className="text-[11px] text-white/30">Stored privately. Used as the card cover.</p>
    </div>
  );
}