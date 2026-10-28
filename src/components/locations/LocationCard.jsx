import React from "react";
import { MapPin, Pencil } from "lucide-react";
import FileImage from "@/components/characters/FileImage";

export default function LocationCard({ location, onEdit }) {
  const { name, first_episode, description_prompt, master_image, notes } = location;

  return (
    <article
      onClick={() => onEdit(location)}
      className="group cursor-pointer overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0E0E10] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#15151A]">
        {master_image ? (
          <FileImage
            fileUri={master_image}
            alt={name}
            className="h-full w-full scale-[1.02] object-cover opacity-95 transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#232329,#101014)]">
            <MapPin className="h-8 w-8 text-white/12" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/35 to-transparent" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(location);
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 opacity-0 backdrop-blur-md transition hover:border-white/40 hover:text-white group-hover:opacity-100"
          aria-label={`Edit ${name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4">
          {first_episode && (
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-[#E3A75F]">
              {first_episode}
            </div>
          )}
          <h3 className="font-display text-[26px] leading-none text-[#F6F3EE]">{name}</h3>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3.5">
        <p className="line-clamp-2 min-h-[34px] text-[12.5px] leading-relaxed text-white/40">
          {description_prompt || "No description prompt yet."}
        </p>

        {notes && (
          <p className="line-clamp-2 border-t border-white/[0.06] pt-3 text-[11.5px] italic leading-relaxed text-white/30">
            {notes}
          </p>
        )}
      </div>
    </article>
  );
}