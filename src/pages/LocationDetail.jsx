import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Camera, Pencil, Plus } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import FileImage from "@/components/characters/FileImage";
import LocationForm from "@/components/locations/LocationForm";
import CameraAngleCard from "@/components/cameraAngles/CameraAngleCard";
import CameraAngleForm from "@/components/cameraAngles/CameraAngleForm";

function Detail({ label, children }) {
  if (!children) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</p>
      <div className="whitespace-pre-line text-[13px] leading-relaxed text-white/60">{children}</div>
    </div>
  );
}

export default function LocationDetail() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [angles, setAngles] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [angleOpen, setAngleOpen] = useState(false);
  const [editingAngle, setEditingAngle] = useState(null);

  const loadLocation = useCallback(async () => {
    try {
      const record = await base44.entities.Location.get(id);
      setLocation(record);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  const loadAngles = useCallback(async () => {
    const res = await base44.entities.CameraAngle.filter(
      { location_id: id },
      { sort: "letter", limit: 200 }
    );
    setAngles(res?.items ?? res ?? []);
  }, [id]);

  useEffect(() => {
    loadLocation();
    loadAngles();
  }, [loadLocation, loadAngles]);

  useEffect(() => {
    if (!notFound) return;
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [notFound]);

  const openNewAngle = () => {
    setEditingAngle(null);
    setAngleOpen(true);
  };

  const openEditAngle = (angle) => {
    setEditingAngle(angle);
    setAngleOpen(true);
  };

  if (notFound) {
    return (
      <div className="relative min-h-screen bg-[#08080A] text-[#F4F1EC]">
        <div className="relative mx-auto max-w-[1380px] px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
          <SiteNav subtitle="Location" />
          <div className="mt-24 text-center">
            <h1 className="font-display text-4xl text-[#F6F3EE]">Location not found</h1>
            <p className="mt-3 text-[13px] text-white/40">It may have been deleted.</p>
            <Link
              to="/locations"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-white/80 transition hover:border-[#E3A75F]/60 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All locations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#08080A] text-[#F4F1EC]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_520px_at_12%_-12%,rgba(227,167,95,0.13),transparent_68%)]" />

      <div className="relative mx-auto max-w-[1380px] px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
        <SiteNav
          subtitle={location?.show}
          action={
            location && (
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[13px] text-white/80 transition hover:border-[#E3A75F]/60 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit location
              </button>
            )
          }
        />

        <Link
          to="/locations"
          className="mt-8 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.16em] text-white/35 transition hover:text-[#E3A75F]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All locations
        </Link>

        {!location ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="aspect-video animate-pulse rounded-[18px] border border-white/[0.06] bg-white/[0.02]" />
            <div className="space-y-3">
              <div className="h-9 w-2/3 animate-pulse rounded-md bg-white/[0.04]" />
              <div className="h-4 w-1/3 animate-pulse rounded-md bg-white/[0.03]" />
              <div className="h-24 animate-pulse rounded-md bg-white/[0.03]" />
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0E0E10]">
              <div className="aspect-video">
                {location.master_image ? (
                  <FileImage
                    fileUri={location.master_image}
                    alt={location.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#232329,#101014)]">
                    <Camera className="h-8 w-8 text-white/12" />
                  </div>
                )}
              </div>
            </div>

            <div>
              {location.first_episode && (
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#E3A75F]">
                  {location.first_episode}
                </p>
              )}
              <h1 className="mt-2 font-display text-[40px] leading-none tracking-tight text-[#F6F3EE] sm:text-[52px]">
                {location.name}
              </h1>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/25">
                {location.show || "Night Cycles"}
              </p>

              <div className="mt-7 space-y-6 border-t border-white/[0.07] pt-6">
                <Detail label="Description prompt">{location.description_prompt}</Detail>
                <Detail label="Notes">{location.notes}</Detail>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-5">
          <div className="flex items-end gap-4">
            <h2 className="font-display text-[30px] leading-none text-[#F6F3EE]">Camera angles</h2>
            {angles && (
              <span className="pb-1 text-[11px] uppercase tracking-[0.2em] text-white/25">
                {angles.length} {angles.length === 1 ? "angle" : "angles"}
              </span>
            )}
          </div>
          {location && (
            <button
              type="button"
              onClick={openNewAngle}
              className="group inline-flex items-center gap-2 rounded-full bg-[#E3A75F] px-4 py-2.5 text-[13px] font-medium text-[#14100A] transition hover:bg-[#F0B979]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              New angle
            </button>
          )}
        </div>

        {!angles ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="aspect-video animate-pulse rounded-[14px] border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : angles.length === 0 ? (
          <div className="mt-8 rounded-[18px] border border-dashed border-white/12 bg-white/[0.02] px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <Camera className="h-5 w-5 text-[#E3A75F]/80" />
            </span>
            <h3 className="mt-5 font-display text-2xl text-[#F6F3EE]">No angles yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/35">
              Add coverage for this location — one card per letter, from wide master to close detail.
            </p>
            <button
              type="button"
              onClick={openNewAngle}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] text-white/80 transition hover:border-[#E3A75F]/60 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add the first angle
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {angles.map((angle) => (
              <CameraAngleCard key={angle.id} angle={angle} onEdit={openEditAngle} />
            ))}
          </div>
        )}
      </div>

      {location && editOpen && (
        <LocationForm
          key={location.id}
          open={editOpen}
          onOpenChange={setEditOpen}
          location={location}
          onSaved={loadLocation}
        />
      )}

      {angleOpen && (
        <CameraAngleForm
          key={editingAngle?.id || "new"}
          open={angleOpen}
          onOpenChange={setAngleOpen}
          angle={editingAngle}
          locationId={id}
          onSaved={loadAngles}
        />
      )}
    </div>
  );
}