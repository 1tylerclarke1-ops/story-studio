import React from "react";
import { Camera, Pencil } from "lucide-react";
import FileImage from "@/components/characters/FileImage";

export default function CameraAngleCard({ angle, onEdit }) {
  const { letter, name, description_prompt, reference_image, notes } = angle;

  return (
    <article
      onClick={() => onEdit(angle)}
      className="group cursor-pointer overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#0E0E10] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#15151A]">
        {reference_image ? (
          <FileImage
            fileUri={reference_image}
            alt={`${letter} — ${name}`}
            className="h-full w-full scale-[1.02] object-cover opacity-95 transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#232329,#101014)]">
            <Camera className="h-6 w-6 text-white/12" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/25 to-transparent" />

        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border border-[#E3A75F]/40 bg-black/50 font-display text-[14px] leading-none text-[#E3A75F] backdrop-blur-md">
          {letter || "?"}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(angle);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 opacity-0 backdrop-blur-md transition hover:border-white/40 hover:text-white group-hover:opacity-100"
          aria-label={`Edit angle ${letter}`}
        >
          <Pencil className="h-3 w-3" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <h3 className="font-display text-[21px] leading-none text-[#F6F3EE]">{name}</h3>
        </div>
      </div>

      <div className="space-y-2 px-3.5 pb-3.5 pt-3">
        <p className="line-clamp-2 min-h-[32px] text-[12px] leading-relaxed text-white/40">
          {description_prompt || "No description prompt yet."}
        </p>
        {notes && (
          <p className="line-clamp-1 border-t border-white/[0.06] pt-2.5 text-[11px] italic text-white/30">
            {notes}
          </p>
        )}
      </div>
    </article>
  );
}