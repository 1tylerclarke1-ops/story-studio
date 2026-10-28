import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import MasterImageUploader from "@/components/locations/MasterImageUploader";

const EMPTY = {
  letter: "",
  name: "",
  description_prompt: "",
  reference_image: "",
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

export default function CameraAngleForm({ open, onOpenChange, angle, locationId, onSaved }) {
  const { toast } = useToast();
  const [values, setValues] = useState(() => ({ ...EMPTY, ...(angle || {}) }));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.name?.trim() && !values.letter?.trim()) {
      toast({ title: "An angle needs a letter and a name", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...values,
      location_id: locationId,
      letter: values.letter?.trim().toUpperCase(),
      name: values.name.trim(),
    };
    try {
      if (angle?.id) {
        await base44.entities.CameraAngle.update(angle.id, payload);
      } else {
        await base44.entities.CameraAngle.create(payload);
      }
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Could not save angle", description: error?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!angle?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    try {
      await base44.entities.CameraAngle.delete(angle.id);
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Could not delete angle", description: error?.message, variant: "destructive" });
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
              {angle ? "Edit angle" : "New angle"}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-normal leading-tight text-[#F6F3EE]">
              {angle ? values.name || "Untitled" : "Add a camera angle"}
            </DialogTitle>
          </div>

          <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
            <Field label="Letter">
              <Input
                value={values.letter}
                onChange={(event) => set("letter", event.target.value.toUpperCase())}
                placeholder="A"
                maxLength={3}
                className={`${fieldClass} text-center font-display text-lg`}
                autoFocus
              />
            </Field>
            <Field label="Name">
              <Input
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="Wide master"
                className={fieldClass}
              />
            </Field>
          </div>

          <Section title="Frame">
            <Field label="Description prompt">
              <Textarea
                value={values.description_prompt}
                onChange={(event) => set("description_prompt", event.target.value)}
                placeholder="Wide from the street door: both washer rows in frame, dryer wall on the left, rain on the glass…"
                rows={4}
                className={`${fieldClass} resize-none leading-relaxed`}
              />
            </Field>
            <Field label="Reference image">
              <MasterImageUploader
                value={values.reference_image}
                onChange={(next) => set("reference_image", next)}
              />
            </Field>
          </Section>

          <Section title="Notes">
            <Field label="Production notes">
              <Textarea
                value={values.notes}
                onChange={(event) => set("notes", event.target.value)}
                placeholder="Lens, height, blocking — anything that must stay fixed."
                rows={3}
                className={`${fieldClass} resize-none leading-relaxed`}
              />
            </Field>
          </Section>

          <div className="mt-7 flex items-center justify-between gap-3">
            <div>
              {angle && (
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
                {saving ? "Saving…" : angle ? "Save changes" : "Add angle"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}