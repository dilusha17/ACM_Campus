import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useState } from "react";

// Outside component to prevent remount bug
const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

// Tag-list input for modules / careers / entry requirements
const TagList = ({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) => {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setValue("");
  };

  const remove = (idx: number) =>
    onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="rounded-xl border-gray-200 text-sm flex-1"
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm transition-colors"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-[#1a3a5c]/5 text-[#1a3a5c] text-xs px-2.5 py-1 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(i)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const Create = () => {
  const { data, setData, post, processing, errors } = useForm<{
    slug: string;
    title: string;
    level: string;
    duration: string;
    short: string;
    overview: string;
    modules: string[];
    careers: string[];
    entry: string[];
    is_active: boolean;
    cover_photo: File | null;
  }>({
    slug: "",
    title: "",
    level: "Diploma",
    duration: "",
    short: "",
    overview: "",
    modules: [],
    careers: [],
    entry: [],
    is_active: true,
    cover_photo: null,
  });

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleTitle = (val: string) => {
    setData((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug(val),
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/programs", { forceFormData: true });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/programs"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Programme</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Create a new academic programme
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Basic Info */}
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">
              Basic Information
            </h2>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-5">
            <Field label="Title" error={errors.title}>
              <Input
                required
                value={data.title}
                onChange={(e) => handleTitle(e.target.value)}
                placeholder="BSc Ayurveda"
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Slug" error={errors.slug}>
              <Input
                required
                value={data.slug}
                onChange={(e) => setData("slug", e.target.value)}
                placeholder="bsc-ayurveda"
                className="rounded-xl border-gray-200 font-mono text-sm"
              />
            </Field>

            <Field label="Level" error={errors.level}>
              <Select
                value={data.level}
                onValueChange={(v) => setData("level", v)}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Duration" error={errors.duration}>
              <Input
                required
                value={data.duration}
                onChange={(e) => setData("duration", e.target.value)}
                placeholder="3 Years"
                className="rounded-xl border-gray-200"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Short Description" error={errors.short}>
                <Textarea
                  value={data.short}
                  onChange={(e) => setData("short", e.target.value)}
                  placeholder="One-line summary shown on listings…"
                  rows={2}
                  className="rounded-xl border-gray-200 resize-none"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Overview" error={errors.overview}>
                <Textarea
                  value={data.overview}
                  onChange={(e) => setData("overview", e.target.value)}
                  placeholder="Full programme description…"
                  rows={5}
                  className="rounded-xl border-gray-200 resize-none"
                />
              </Field>
            </div>
          </div>

          {/* Lists */}
          <div className="px-6 py-4 border-t border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">
              Modules &amp; Requirements
            </h2>
          </div>
          <div className="p-6 grid sm:grid-cols-1 gap-6">
            <Field label="Core Modules" error={errors.modules as unknown as string}>
              <TagList
                items={data.modules}
                onChange={(v) => setData("modules", v)}
                placeholder="e.g. Anatomy &amp; Physiology"
              />
            </Field>

            <Field label="Career Pathways" error={errors.careers as unknown as string}>
              <TagList
                items={data.careers}
                onChange={(v) => setData("careers", v)}
                placeholder="e.g. Clinical Practitioner"
              />
            </Field>

            <Field
              label="Entry Requirements"
              error={errors.entry as unknown as string}
            >
              <TagList
                items={data.entry}
                onChange={(v) => setData("entry", v)}
                placeholder="e.g. 2 A-Level passes"
              />
            </Field>
          </div>

          {/* Cover Photo */}
          <div className="px-6 py-4 border-t border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Cover Photo</h2>
          </div>
          <div className="px-6 pb-6">
            <ImageCropper
              aspectRatio={16 / 9}
              maxSizeMb={10}
              onChange={(f) => setData("cover_photo", f)}
              label=""
              error={errors.cover_photo as unknown as string}
            />
          </div>

          {/* Status */}
          <div className="px-6 pb-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData("is_active", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1a3a5c]"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible on website)
              </span>
            </label>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm"
            >
              {processing ? "Saving…" : "Create Programme"}
            </button>
            <Link
              href="/admin/programs"
              className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Create;
