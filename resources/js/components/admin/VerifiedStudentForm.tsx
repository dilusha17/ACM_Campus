import { Link, useForm } from "@inertiajs/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import {
  Field,
  StudentInformationCard,
  StudentPhotoCard,
  formatDate,
  parseDate,
} from "@/components/student/StudentInformationCard";

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
  country_code_id: string;
  phone_country_code: string;
  phone: string;
  address: string;
  program_id: string;
  admission_id: string;
  scholarship_application_id: string;
  detail_request_id: string;
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
  submittedImageUrl?: string | null;
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
  country_code_id: "",
  phone_country_code: "",
  phone: "",
  address: "",
  program_id: "",
  admission_id: "",
  scholarship_application_id: "",
  detail_request_id: "",
  enrollment_date: "",
  graduation_date: "",
  suspended_date: "",
  status: "active",
  certificate_id: "",
  image: null,
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
  submittedImageUrl,
  initialValues,
}: VerifiedStudentFormProps) => {
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

      <StudentInformationCard
        data={data}
        setData={(key, value) => setData(key, value)}
        errors={errors}
        nationalities={nationalities}
        nextStudentId={nextStudentId}
      />

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

      <StudentPhotoCard
        onChange={(file) => setData("image", file)}
        error={errors.image}
        currentUrl={submittedImageUrl}
        uploadProgress={uploadProgress}
      />

      <input type="hidden" value={data.admission_id} readOnly name="admission_id" />

      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex gap-3">
        <button type="submit" disabled={processing} className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-xs">
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