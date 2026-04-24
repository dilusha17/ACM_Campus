import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useState } from "react";
import { countryCodeOptions } from "@/data/countryCodes";

// Defined OUTSIDE the form component to prevent remount-on-keystroke
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

interface AcceptedAdmission {
  id: number;
  full_name: string;
  email: string;
  program_slug: string;
}

interface Program {
  id: number;
  slug: string;
  title: string;
  level: string;
}

interface AvailableCert {
  id: number;
  certificate_number: string;
  program_slug: string;
}

const parseDate = (s: string) => (s ? new Date(s.slice(0, 10) + "T00:00:00") : undefined);
const formatDate = (d: Date | undefined) => {
  if (!d) return "";
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Create = ({
  admissions,
  programs,
  next_student_id,
  available_certificates,
}: {
  admissions: AcceptedAdmission[];
  programs: Program[];
  next_student_id: string;
  available_certificates: Record<string, AvailableCert[]>;
}) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const { data, setData, post, processing, errors } = useForm<{
    full_name: string;
    date_of_birth: string;
    email: string;
    nationality: string;
    phone_country_code: string;
    phone: string;
    address: string;
    program_slug: string;
    admission_id: string;
    enrollment_date: string;
    graduation_date: string;
    suspended_date: string;
    status: string;
    certificate_id: string;
    image: File | null;
  }>({
    full_name:          "",
    date_of_birth:      "",
    email:              "",
    nationality:        "",
    phone_country_code: "",
    phone:              "",
    address:            "",
    program_slug:       "",
    admission_id:       "",
    enrollment_date:    "",
    graduation_date:    "",
    suspended_date:     "",
    status:             "active",
    certificate_id:     "",
    image:              null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    post("/admin/students", {
      forceFormData: true,
      onProgress: (progress) => setUploadProgress(progress?.percentage ?? 0),
      onFinish: () => setUploadProgress(null),
    });
  };

  const programOptions = programs.map((p) => ({
    value: p.slug,
    label: p.title,
    sub:   p.level,
  }));

  const admissionOptions = [
    { value: "", label: "None" },
    ...admissions.map((a) => ({
      value: String(a.id),
      label: a.full_name,
      sub:   a.email,
    })),
  ];

  // Certificates available for the currently selected programme
  const certsForProgram: AvailableCert[] = data.program_slug
    ? (available_certificates[data.program_slug] ?? [])
    : [];

  const handleProgramChange = (slug: string) => {
    setData((prev) => ({ ...prev, program_slug: slug, certificate_id: "" }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Verified Student</h1>
            <p className="text-gray-400 text-sm mt-0.5">Enter the student's details below</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Student Information</h2>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">

            {/* Auto-generated Student ID — disabled */}
            <Field label="Student ID">
              <div className="relative">
                <Input
                  value={next_student_id}
                  disabled
                  readOnly
                  className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">
                  Auto
                </span>
              </div>
            </Field>

            <Field label="Full Name" error={errors.full_name}>
              <Input
                required
                value={data.full_name}
                onChange={(e) => setData("full_name", e.target.value)}
                placeholder="Jane Doe"
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="student@email.com"
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Date of Birth" error={errors.date_of_birth}>
              <DatePicker
                value={parseDate(data.date_of_birth)}
                onChange={(d) => setData("date_of_birth", formatDate(d))}
                placeholder="Pick date of birth"
              />
            </Field>

            <Field label="Nationality" error={errors.nationality}>
              <Input
                required
                value={data.nationality}
                onChange={(e) => setData("nationality", e.target.value)}
                placeholder="e.g. British"
                className="rounded-xl border-gray-200"
              />
            </Field>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Mobile <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="w-64 shrink-0">
                  <Combobox
                    options={countryCodeOptions}
                    value={data.phone_country_code}
                    onChange={(v) => setData("phone_country_code", v)}
                    placeholder="Country code…"
                    searchPlaceholder="Search country…"
                  />
                </div>
                <Input
                  required
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Phone number"
                  className="rounded-xl border-gray-200 flex-1"
                />
              </div>
              {errors.phone_country_code && <p className="text-red-500 text-xs">{errors.phone_country_code}</p>}
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <Field label="Address" error={errors.address}>
                <Input
                  value={data.address}
                  onChange={(e) => setData("address", e.target.value)}
                  placeholder="Full postal address"
                  className="rounded-xl border-gray-200"
                />
              </Field>
            </div>

            <Field label="Programme" error={errors.program_slug}>
              <Combobox
                options={programOptions}
                value={data.program_slug}
                onChange={handleProgramChange}
                placeholder="Select programme…"
                searchPlaceholder="Search programmes…"
              />
            </Field>

            <Field label="Link to Admission (optional)" error={errors.admission_id}>
              <Combobox
                options={admissionOptions}
                value={data.admission_id}
                onChange={(v) => setData("admission_id", v)}
                placeholder="Search accepted admissions…"
                searchPlaceholder="Search by name or email…"
              />
            </Field>

            <Field label="Enrollment Date" error={errors.enrollment_date}>
              <DatePicker
                value={parseDate(data.enrollment_date)}
                onChange={(d) => setData("enrollment_date", formatDate(d))}
                placeholder="Pick enrollment date"
              />
            </Field>

            <Field label="Status" error={errors.status}>
              <Select
                value={data.status}
                onValueChange={(v) => {
                  setData((prev) => ({
                    ...prev,
                    status:         v,
                    certificate_id: v !== "graduated" ? "" : prev.certificate_id,
                  }));
                }}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {data.status === "graduated" && (
              <Field label="Graduation Date" error={errors.graduation_date}>
                <DatePicker
                  value={parseDate(data.graduation_date)}
                  onChange={(d) => setData("graduation_date", formatDate(d))}
                  placeholder="Pick graduation date"
                />
              </Field>
            )}

            {data.status === "suspended" && (
              <Field label="Suspension Date" error={errors.suspended_date}>
                <DatePicker
                  value={parseDate(data.suspended_date)}
                  onChange={(d) => setData("suspended_date", formatDate(d))}
                  placeholder="Pick suspension date"
                />
              </Field>
            )}

            {/* Certificate assignment — only shown when graduated and programme is selected */}
            {data.status === "graduated" && data.program_slug && (
              <div className="sm:col-span-2">
                <Field label="Assign Certificate (optional)" error={errors.certificate_id}>
                  {certsForProgram.length > 0 ? (
                    <Select
                      value={data.certificate_id || "__none__"}
                      onValueChange={(v) => setData("certificate_id", v === "__none__" ? "" : v)}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select a certificate…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {certsForProgram.map((cert) => (
                          <SelectItem key={cert.id} value={String(cert.id)}>
                            {cert.certificate_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 px-4 py-3 bg-gray-50">
                      <p className="text-sm text-gray-400">
                        No unassigned certificates for this programme.{" "}
                        <Link
                          href="/admin/certificates/create"
                          className="text-[#1a3a5c] hover:underline font-medium"
                        >
                          Create one →
                        </Link>
                      </p>
                    </div>
                  )}
                </Field>
              </div>
            )}

            <div className="sm:col-span-2">
              <Field label="Student Photo" error={errors.image}>
                <ImageCropper
                  aspectRatio={1}
                  maxSizeMb={5}
                  onChange={(f) => setData("image", f)}
                  label=""
                />
                {uploadProgress !== null && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5" />
                  </div>
                )}
              </Field>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm"
            >
              {processing ? "Saving…" : "Add Student"}
            </button>
            <Link
              href="/admin/students"
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
