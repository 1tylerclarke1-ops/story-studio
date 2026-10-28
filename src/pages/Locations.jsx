import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Plus } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import LocationCard from "@/components/locations/LocationCard";
import LocationForm from "@/components/locations/LocationForm";

export default function Locations() {
  const [locations, setLocations] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const res = await base44.entities.Location.list({ sort: "-created_date", limit: 200 });
    setLocations(res?.items ?? res ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (location) => {
    setEditing(location);
    setOpen(true);
  };

  const showName = locations?.find((location) => location.show)?.show || "Night Cycles";

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
              New location
            </button>
          }
        />

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-8">
          <div>
            <h1 className="font-display text-[44px] leading-none tracking-tight text-[#F6F3EE] sm:text-[60px]">
              Locations
            </h1>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/40">
              The places of {showName} — sets, exteriors, and the master frames that keep them
              recognizable from episode to episode.
            </p>
          </div>
          {locations && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/25">
              {locations.length} {locations.length === 1 ? "location" : "locations"}
            </p>
          )}
        </div>

        {!locations ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((key) => (
              <div
                key={key}
                className="aspect-video animate-pulse rounded-[18px] border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="mt-10 rounded-[22px] border border-dashed border-white/12 bg-white/[0.02] px-6 py-20 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <MapPin className="h-5 w-5 text-[#E3A75F]/80" />
            </span>
            <h2 className="mt-5 font-display text-2xl text-[#F6F3EE]">No locations yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/35">
              Add a place with a master image, a description prompt, and production notes.
            </p>
            <button
              type="button"
              onClick={openNew}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-white/80 transition hover:border-[#E3A75F]/60 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add a location
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {open && (
        <LocationForm
          key={editing?.id || "new"}
          open={open}
          onOpenChange={setOpen}
          location={editing}
          onSaved={load}
        />
      )}
    </div>
  );
}