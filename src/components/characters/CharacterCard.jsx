import React from "react";
import { Mic, Pencil } from "lucide-react";
import FileImage from "./FileImage";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function CharacterCard({ character, onEdit }) {
  const {
    name,
    role,
    first_episode,
    appearance_prompt,
    reference_images = [],
    voice_preset,
    voice_pace,
    voice_pitch,
    voice_energy,
  } = character;

  const cover = reference_images?.[0];
  const voiceMods = [voice_pace, voice_pitch, voice_energy].filter(Boolean).join(" · ");

  return (
    <article
      onClick={() => onEdit(character)}
      className="group cursor-pointer overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0E0E10] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#15151A]">
        {cover ? (
          <FileImage
            fileUri={cover}
            alt={name}
            className="h-full w-full scale-[1.02] object-cover opacity-95 transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#232329,#101014)]">
            <span className="font-display text-5xl text-white/15">{initialsOf(name) || "?"}</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/35 to-transparent" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(character);
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 opacity-0 backdrop-blur-md transition hover:border-white/40 hover:text-white group-hover:opacity-100"
          aria-label={`Edit ${name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#E3A75F]">
            {role && <span className="truncate">{role}</span>}
            {role && first_episode && <span className="h-1 w-1 rounded-full bg-white/25" />}
            {first_episode && <span className="text-white/45">{first_episode}</span>}
          </div>
          <h3 className="font-display text-[26px] leading-none text-[#F6F3EE]">{name}</h3>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3.5">
        <p className="line-clamp-2 min-h-[34px] text-[12.5px] leading-relaxed text-white/40">
          {appearance_prompt || "No appearance prompt yet."}
        </p>

        {(voice_preset || voiceMods) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
            {voice_preset && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70">
                <Mic className="h-3 w-3 text-[#E3A75F]" />
                {voice_preset}
              </span>
            )}
            {voiceMods && <span className="text-[11px] text-white/30">{voiceMods}</span>}
          </div>
        )}
      </div>
    </article>
  );
}