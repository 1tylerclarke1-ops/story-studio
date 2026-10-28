import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ReferenceUploader from "./ReferenceUploader";
import VoiceSampleUploader from "./VoiceSampleUploader";

const EMPTY = {
  show: "Night Cycles",
  name: "",
  role: "",
  first_episode: "",
  appearance_prompt: "",
  reference_images: [],
  voice_preset: "",
  voice_pace: "",
  voice_pitch: "",
  voice_energy: "",
  voice_sample: "",
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

export default function CharacterForm({ open, onOpenChange, character, onSaved }) {
  const { toast } = useToast();
  const [values, setValues] = useState(() => ({ ...EMPTY, ...(character || {}) }));
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.name?.trim()) {
      toast({ title: "A character needs a name", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...values,
      name: values.name.trim(),
      show: values.show?.trim() || "Night Cycles",
      reference_images: values.reference_images || [],
    };
    try {
      if (character?.id) {
        await base44.entities.Character.update(character.id, payload);
      } else {
        await base44.entities.Character.create(payload);
      }
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Could not save character",
        description: error?.message,
        variant: "destructive",
      });
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
              {character ? "Edit character" : "New character"}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-normal leading-tight text-[#F6F3EE]">
              {character ? values.name || "Untitled" : "Add to the cast"}
            </DialogTitle>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="Mara Voss"
                className={fieldClass}
                autoFocus
              />
            </Field>
            <Field label="Role">
              <Input
                value={values.role}
                onChange={(event) => set("role", event.target.value)}
                placeholder="Lead"
                className={fieldClass}
              />
            </Field>
            <Field label="Show">
              <Input
                value={values.show}
                onChange={(event) => set("show", event.target.value)}
                placeholder="Night Cycles"
                className={fieldClass}
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
          </div>

          <Section title="Appearance">
            <Field label="Appearance prompt">
              <Textarea
                value={values.appearance_prompt}
                onChange={(event) => set("appearance_prompt", event.target.value)}
                placeholder="Late 30s, cropped silver hair, weathered trench coat, permanent five o'clock shadow…"
                rows={4}
                className={`${fieldClass} resize-none leading-relaxed`}
              />
            </Field>
            <Field label="Reference images">
              <ReferenceUploader
                value={values.reference_images || []}
                onChange={(next) => set("reference_images", next)}
              />
            </Field>
          </Section>

          <Section title="Voice">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preset">
                <Input
                  value={values.voice_preset}
                  onChange={(event) => set("voice_preset", event.target.value)}
                  placeholder="Warm baritone"
                  className={fieldClass}
                />
              </Field>
              <Field label="Pace">
                <Input
                  value={values.voice_pace}
                  onChange={(event) => set("voice_pace", event.target.value)}
                  placeholder="Measured"
                  className={fieldClass}
                />
              </Field>
              <Field label="Pitch">
                <Input
                  value={values.voice_pitch}
                  onChange={(event) => set("voice_pitch", event.target.value)}
                  placeholder="Low"
                  className={fieldClass}
                />
              </Field>
              <Field label="Energy">
                <Input
                  value={values.voice_energy}
                  onChange={(event) => set("voice_energy", event.target.value)}
                  placeholder="Steady"
                  className={fieldClass}
                />
              </Field>
            </div>
            <Field label="Voice sample">
              <VoiceSampleUploader
                value={values.voice_sample}
                onChange={(next) => set("voice_sample", next)}
              />
            </Field>
          </Section>

          <div className="mt-7 flex items-center justify-end gap-3">
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
              {saving ? "Saving…" : character ? "Save changes" : "Add character"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}