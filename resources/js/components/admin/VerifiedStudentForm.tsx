import { Link, useForm, usePage } from "@inertiajs/react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useState } from "react";
import { dialCodeOptions, type CountryCode } from "@/lib/countryCodes";

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

export interface VerifiedStudentNationality {
  id: number;
  name: string;
}

export interface VerifiedStudentProgram {
  id: number;
  slug: string;
  title: string;
  level: string;
}

export interface AvailableCertificate {
  id: number;
  certificate_number: string;
  program_id: number;
}

export interface VerifiedStudentFormValues {
  id_type: string;
  id_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  email: string;
  nationality_id: string;
  gender: string;
  phone_country_code: string;
  phone: string;
  address: string;
  program_id: string;
  admission_id: string;
  enrollment_date: string;
  graduation_date: string;
  suspended_date: string;
  status: string;
  certificate_id: string;
  image: File | null;
}

interface VerifiedStudentFormProps {
  nationalities: VerifiedStudentNationality[];
  programs: VerifiedStudentProgram[];
  nextStudentId: string;
  availableCertificates: Record<string, AvailableCertificate[]>;
  submitUrl: string;
  submitLabel: string;
  submittingLabel: string;
  cancelHref?: string;
  introText?: string;
  initialValues?: Partial<VerifiedStudentFormValues>;
}

const defaultValues: VerifiedStudentFormValues = {
  id_type: "NIC",
  id_number: "",
  first_name: "",
  last_name: "",
  full_name: "",
  date_of_birth: "",
  email: "",
  nationality_id: "",
  gender: "",
  phone_country_code: "",
  phone: "",
  address: "",
  program_id: "",
  admission_id: "",
  enrollment_date: "",
  graduation_date: "",
  suspended_date: "",
  status: "active",
  certificate_id: "",
  image: null,
};

const parseDate = (value: string) => (value ? new Date(value.slice(0, 10) + "T00:00:00") : undefined);
const formatDate = (value: Date | undefined) => {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const VerifiedStudentForm = ({
  nationalities,
  programs,
  nextStudentId,
  availableCertificates,
  submitUrl,
  submitLabel,
  submittingLabel,
  cancelHref,
  introText,
  initialValues,
}: VerifiedStudentFormProps) => {
  const { countryCodes } = usePage<{ countryCodes: CountryCode[] }>().props;
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { data, setData, post, processing, errors } = useForm<VerifiedStudentFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const programOptions = programs.map((program) => ({
    value: String(program.id),
    label: program.title,
    sub: program.level,
  }));

  const certificatesForProgram = data.program_id
    ? (availableCertificates[data.program_id] ?? [])
    : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    post(submitUrl, {
      forceFormData: true,
      onProgress: (progress) => setUploadProgress(progress?.percentage ?? 0),
      onFinish: () => setUploadProgress(null),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {introText && <p className="text-xs text-gray-400">{introText}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Student Information</h2>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-5">
          <Field label="Student ID">
            <div className="relative">
              <Input
                value={nextStudentId}
                disabled
                readOnly
                className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">Auto</span>
            </div>
          </Field>

          <Field label="NIC / Passport No. *" error={errors.id_number}>
            <div className="flex gap-2">
              <Select value={data.id_type} onValueChange={(value) => setData("id_type", value)}>
                <SelectTrigger className="rounded-xl border-gray-200 w-36 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NIC">NIC</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                </SelectContent>
              </Select>
              <Input
                required
                value={data.id_number}
                onChange={(e) => setData("id_number", e.target.value)}
                placeholder={data.id_type === "NIC" ? "e.g. 199012345678" : "e.g. N1234567"}
                maxLength={20}
                className="rounded-xl border-gray-200 flex-1"
              />
            </div>
          </Field>

          <Field label="First Name *" error={errors.first_name}>
            <Input required value={data.first_name} onChange={(e) => setData("first_name", e.target.value)} placeholder="Jane" className="rounded-xl border-gray-200" />
          </Field>

          <Field label="Last Name *" error={errors.last_name}>
            <Input required value={data.last_name} onChange={(e) => setData("last_name", e.target.value)} placeholder="Doe" className="rounded-xl border-gray-200" />
          </Field>

          <Field label="Full Name *" error={errors.full_name}>
            <Input required value={data.full_name} onChange={(e) => setData("full_name", e.target.value)} placeholder="Jane Doe" className="rounded-xl border-gray-200" />
          </Field>

          <Field label="Email *" error={errors.email}>
            <Input type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="student@email.com" className="rounded-xl border-gray-200" />
          </Field>

          <Field label="Date of Birth *" error={errors.date_of_birth}>
            <DatePicker value={parseDate(data.date_of_birth)} onChange={(value) => setData("date_of_birth", formatDate(value))} placeholder="Pick date of birth" />
          </Field>

          <Field label="Nationality *" error={errors.nationality_id}>
            <Select value={data.nationality_id} onValueChange={(value) => setData("nationality_id", value)}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Select nationality..." />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality.id} value={String(nationality.id)}>{nationality.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Gender *" error={errors.gender}>
            <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Select gender..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="not_stated">Prefer Not to Say</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Mobile <span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <div className="w-64 shrink-0">
                <Combobox
                  options={dialCodeOptions(countryCodes)}
                  value={data.phone_country_code}
                  onChange={(value) => setData("phone_country_code", value)}
                  placeholder="Country code..."
                  searchPlaceholder="Search country..."
                />
              </div>
              <Input
                required
                inputMode="numeric"
                pattern="[0-9]*"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value.replace(/\D/g, ""))}
                placeholder="Digits only"
                className="rounded-xl border-gray-200 flex-1"
              />
            </div>
            {errors.phone_country_code && <p className="text-red-500 text-xs">{errors.phone_country_code}</p>}
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          <div className="sm:col-span-2">
            <Field label="Address *" error={errors.address}>
              <Textarea required value={data.address} onChange={(e) => setData("address", e.target.value)} placeholder="Full postal address" className="rounded-xl border-gray-200 min-h-[96px]" />
            </Field>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Course Details</h2>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-5">
          <Field label="Programme *" error={errors.program_id}>
            <Combobox
              options={programOptions}
              value={data.program_id}
              onChange={(value) => setData((previous) => ({ ...previous, program_id: value, certificate_id: "" }))}
              placeholder="Select programme..."
              searchPlaceholder="Search programmes..."
            />
          </Field>

          <Field label="Enrollment Date *" error={errors.enrollment_date}>
            <DatePicker value={parseDate(data.enrollment_date)} onChange={(value) => setData("enrollment_date", formatDate(value))} placeholder="Pick enrollment date" />
          </Field>

          <Field label="Student Status *" error={errors.status}>
            <Select
              value={data.status}
              onValueChange={(value) => setData((previous) => ({
                ...previous,
                status: value,
                certificate_id: value !== "graduated" ? "" : previous.certificate_id,
              }))}
            >
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Select status..." />
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
              <DatePicker value={parseDate(data.graduation_date)} onChange={(value) => setData("graduation_date", formatDate(value))} placeholder="Pick graduation date" />
            </Field>
          )}

          {data.status === "suspended" && (
            <Field label="Suspension Date" error={errors.suspended_date}>
              <DatePicker value={parseDate(data.suspended_date)} onChange={(value) => setData("suspended_date", formatDate(value))} placeholder="Pick suspension date" />
            </Field>
          )}

          {data.status === "graduated" && data.program_id && (
            <div className="sm:col-span-2">
              <Field label="Assign Certificate (optional)" error={errors.certificate_id}>
                {certificatesForProgram.length > 0 ? (
                  <Select value={data.certificate_id || "__none__"} onValueChange={(value) => setData("certificate_id", value === "__none__" ? "" : value)}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select a certificate..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {certificatesForProgram.map((certificate) => (
                        <SelectItem key={certificate.id} value={String(certificate.id)}>{certificate.certificate_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 px-4 py-3 bg-gray-50">
                    <p className="text-sm text-gray-400">
                      No unassigned certificates for this programme.{" "}
                      <Link href="/admin/certificates/create" className="text-[#1a3a5c] hover:underline font-medium">Create one {"->"}</Link>
                    </p>
                  </div>
                )}
              </Field>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Student Photo</h2>
        </div>
        <div className="p-6">
          <Field label="" error={errors.image}>
            <ImageCropper aspectRatio={1} maxSizeMb={5} onChange={(file) => setData("image", file)} label="" />
            {uploadProgress !== null && (
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}
          </Field>
        </div>
      </div>

      <input type="hidden" value={data.admission_id} readOnly name="admission_id" />

      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex gap-3">
        <button type="submit" disabled={processing} className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm">
          {processing ? submittingLabel : submitLabel}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
};

export default VerifiedStudentForm;