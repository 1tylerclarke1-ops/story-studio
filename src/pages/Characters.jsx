import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Film, Plus } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CharacterCard from "@/components/characters/CharacterCard";
import CharacterForm from "@/components/characters/CharacterForm";

export default function Characters() {
  const [characters, setCharacters] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const res = await base44.entities.Character.list({ sort: "-created_date", limit: 200 });
    setCharacters(res?.items ?? res ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (character) => {
    setEditing(character);
    setOpen(true);
  };

  const showName = characters?.find((character) => character.show)?.show || "Night Cycles";

  return (
    <div className="relative min-h-screen bg-[#08080A] text-[#F4F1EC]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_520px_at_12%_-12%,rgba(227,167,95,0.13),transparent_68%)]" />

      <div className="relative mx-auto max-w-[1380px] px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
        <SiteNav
          subtitle={showName}
          action={
            <button
              type="button"
              onClick={openNew}
              className="group inline-flex items-center gap-2 rounded-full bg-[#E3A75F] px-4 py-2.5 text-[13px] font-medium text-[#14100A] transition hover:bg-[#F0B979]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              New character
            </button>
          }
        />

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-8">
          <div>
            <h1 className="font-display text-[44px] leading-none tracking-tight text-[#F6F3EE] sm:text-[60px]">
              Characters
            </h1>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/40">
              The cast of {showName} — looks, voices, and the reference frames that keep them
              consistent from episode to episode.
            </p>
          </div>
          {characters && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/25">
              {characters.length} {characters.length === 1 ? "character" : "characters"}
            </p>
          )}
        </div>

        {!characters ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((key) => (
              <div
                key={key}
                className="aspect-[3/4.2] animate-pulse rounded-[18px] border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="mt-10 rounded-[22px] border border-dashed border-white/12 bg-white/[0.02] px-6 py-20 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Film className="h-5 w-5 text-[#E3A75F]/80" />
            </span>
            <h2 className="mt-5 font-display text-2xl text-[#F6F3EE]">The cast is empty</h2>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/35">
              Add your first character with a look, a voice, and the episode they appear in.
            </p>
            <button
              type="button"
              onClick={openNew}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-white/80 transition hover:border-[#E3A75F]/60 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add a character
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {open && (
        <CharacterForm
          key={editing?.id || "new"}
          open={open}
          onOpenChange={setOpen}
          character={editing}
          onSaved={load}
        />
      )}
    </div>
  );
}