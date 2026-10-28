import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import MasterImageUploader from "./MasterImageUploader";

const EMPTY = {
  show: "Night Cycles",
  name: "",
  first_episode: "",
  description_prompt: "",
  master_image: "",
  notes: "",
};

const fieldClass =
  "border-white/10 bg-white/[0.03] text-[#F4F1EC] placeholder:text-white/25 focus-visible:ring-[#E3A75F]/60 focus-visible:ring-offset-0";

function Section({ title, children }) {
  return (
    <section className="space-y-3 border-t border-white/[0.07] pt-5">
      <h4 className="text-[10px] uppercase tracking-[0.22em] text-white/35">{title}</h4>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</Label>
      {children}
    </div>
  );
}

export default function LocationForm({ open, onOpenChange, location, onSaved }) {
  const { toast } = useToast();
  const [values, setValues] = useState(() => ({ ...EMPTY, ...(location || {}) }));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.name?.trim()) {
      toast({ title: "A location needs a name", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...values,
      name: values.name.trim(),
      show: values.show?.trim() || "Night Cycles",
    };
    try {
      if (location?.id) {
        await base44.entities.Location.update(location.id, payload);
      } else {
        await base44.entities.Location.create(payload);
      }
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Could not save location", description: error?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!location?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Location.delete(location.id);
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Could not delete location", description: error?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0D0D10] p-0 text-[#F4F1EC]">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#E3A75F]/80">
              {location ? "Edit location" : "New location"}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-normal leading-tight text-[#F6F3EE]">
              {location ? values.name || "Untitled" : "Add a place"}
            </DialogTitle>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="The Laundromat"
                className={fieldClass}
                autoFocus
              />
            </Field>
            <Field label="First episode">
              <Input
                value={values.first_episode}
                onChange={(event) => set("first_episode", event.target.value)}
                placeholder="S1E1"
                className={fieldClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Show">
                <Input
                  value={values.show}
                  onChange={(event) => set("show", event.target.value)}
                  placeholder="Night Cycles"
                  className={fieldClass}
                />
              </Field>
            </div>
          </div>

          <Section title="Look">
            <Field label="Description prompt">
              <Textarea
                value={values.description_prompt}
                onChange={(event) => set("description_prompt", event.target.value)}
                placeholder="Small 24-hour laundromat at 2am, two rows of washers, a wall of dryers, rain on the front window…"
                rows={4}
                className={`${fieldClass} resize-none leading-relaxed`}
              />
            </Field>
            <Field label="Master image">
              <MasterImageUploader
                value={values.master_image}
                onChange={(next) => set("master_image", next)}
              />
            </Field>
          </Section>

          <Section title="Notes">
            <Field label="Production notes">
              <Textarea
                value={values.notes}
                onChange={(event) => set("notes", event.target.value)}
                  placeholder="Layout rules, fixed props, what must never change between episodes."
                rows={3}
                className={`${fieldClass} resize-none leading-relaxed`}
              />
            </Field>
          </Section>

          <div className="mt-7 flex items-center justify-between gap-3">
            <div>
              {location && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  onBlur={() => setConfirmDelete(false)}
                  className="rounded-full px-3 py-2.5 text-[12.5px] text-[#E3786A]/80 transition hover:text-[#E3786A] disabled:opacity-60"
                >
                  {confirmDelete ? "Tap again to delete" : "Delete"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-4 py-2.5 text-[13px] text-white/50 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#E3A75F] px-6 py-2.5 text-[13px] font-medium text-[#14100A] transition hover:bg-[#F0B979] disabled:opacity-60"
              >
                {saving ? "Saving…" : location ? "Save changes" : "Add location"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}