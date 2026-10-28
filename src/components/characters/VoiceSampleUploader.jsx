import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileAudio, Loader2, X } from "lucide-react";
import useSignedFile from "@/hooks/useSignedFile";

export default function VoiceSampleUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const audioUrl = useSignedFile(value);

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
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[12px] text-white/60">
              <FileAudio className="h-3.5 w-3.5 text-[#E3A75F]" />
              Voice sample attached
            </span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-white/35 transition hover:text-white"
              aria-label="Remove voice sample"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {audioUrl && <audio controls src={audioUrl} className="h-9 w-full" />}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] py-3 text-[12px] text-white/40 transition hover:border-[#E3A75F]/60 hover:text-[#E3A75F] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileAudio className="h-4 w-4" />}
          {busy ? "Uploading sample" : "Attach an audio sample"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(event) => addFile(event.target.files?.[0])}
      />
    </div>
  );
}