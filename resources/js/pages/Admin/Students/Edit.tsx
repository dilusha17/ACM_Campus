import { Link, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, Pencil, Plus, Trash2, Award, X, Check } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Defined OUTSIDE component to prevent remount-on-keystroke bug
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

interface CertificateData {
  id: number;
  certificate_number: string;
  status: string;
}

interface AvailableCert {
  id: number;
  certificate_number: string;
  program_slug: string;
}

interface StudentProgramRow {
  id: number;
  program_slug: string;
  admission_id: number | null;
  enrollment_date: string;
  graduation_date: string | null;
  suspended_date: string | null;
  status: string;
  certificate: CertificateData | null;
  program: { id: number; slug: string; title: string; level: string } | null;
}

interface Student {
  id: number;
  student_id: string;
  full_name: string;
  date_of_birth: string | null;
  email: string;
  nationality: string | null;
  phone_country_code: string | null;
  phone: string | null;
  address: string | null;
  admission_id: number | null;
  image_path: string | null;
  student_programs: StudentProgramRow[];
}

interface Admission {
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

const statusStyles: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  graduated: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  suspended: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
};

const parseDate = (s: string | null) => (s ? new Date(s.slice(0, 10) + "T00:00:00") : undefined);
const formatDate = (d: Date | undefined) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Inline edit form for a single StudentProgram row
const ProgramEditRow = ({
  sp,
  studentId,
  programs,
  admissions,
  availableCerts,
  onClose,
}: {
  sp: StudentProgramRow;
  studentId: number;
  programs: Program[];
  admissions: Admission[];
  availableCerts: AvailableCert[];
  onClose: () => void;
}) => {
  const { data, setData, patch, processing, errors } = useForm({
    program_slug:    sp.program_slug,
    admission_id:    sp.admission_id ? String(sp.admission_id) : "",
    enrollment_date: sp.enrollment_date ?? "",
    graduation_date: sp.graduation_date ?? "",
    suspended_date:  sp.suspended_date ?? "",
    status:          sp.status,
    certificate_id:  sp.certificate ? String(sp.certificate.id) : "",
  });

  // Merge the currently-assigned cert into the options so it shows as selected
  const certOptions: AvailableCert[] = sp.certificate
    ? [
        { id: sp.certificate.id, certificate_number: sp.certificate.certificate_number, program_slug: sp.program_slug },
        ...availableCerts.filter((c) => c.id !== sp.certificate!.id),
      ]
    : availableCerts;

  const programOptions = programs.map((p) => ({ value: p.slug, label: p.title, sub: p.level }));
  const admissionOptions = [
    { value: "", label: "None" },
    ...admissions.map((a) => ({ value: String(a.id), label: a.full_name, sub: a.email })),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/admin/students/${studentId}/programs/${sp.id}`, { onSuccess: onClose });
  };

  return (
    <form onSubmit={submit} className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 mt-3 grid sm:grid-cols-2 gap-4">
      <Field label="Programme" error={errors.program_slug}>
        <Combobox
          options={programOptions}
          value={data.program_slug}
          onChange={(v) => setData("program_slug", v)}
          placeholder="Select programme..."
          searchPlaceholder="Search..."
        />
      </Field>
      <Field label="Linked Admission" error={errors.admission_id}>
        <Combobox
          options={admissionOptions}
          value={data.admission_id}
          onChange={(v) => setData("admission_id", v)}
          placeholder="None"
          searchPlaceholder="Search..."
        />
      </Field>
      <Field label="Enrollment Date" error={errors.enrollment_date}>
        <DatePicker
          value={parseDate(data.enrollment_date)}
          onChange={(d) => setData("enrollment_date", formatDate(d))}
          placeholder="Enrollment date"
        />
      </Field>
      <Field label="Status" error={errors.status}>
        <Select value={data.status} onValueChange={(v) => setData("status", v)}>
          <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
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
            placeholder="Graduation date"
          />
        </Field>
      )}
      {data.status === "graduated" && (
        <Field label="Certificate" error={errors.certificate_id}>
          <Select
            value={data.certificate_id || "__none__"}
            onValueChange={(v) => setData("certificate_id", v === "__none__" ? "" : v)}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="No certificate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No certificate</SelectItem>
              {certOptions.filter((cert) => cert.id).map((cert) => (
                <SelectItem key={cert.id} value={String(cert.id)}>
                  {cert.certificate_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
      {data.status === "suspended" && (
        <Field label="Suspension Date" error={errors.suspended_date}>
          <DatePicker
            value={parseDate(data.suspended_date)}
            onChange={(d) => setData("suspended_date", formatDate(d))}
            placeholder="Suspension date"
          />
        </Field>
      )}
      <div className="sm:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={processing}
          className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-60 hover:bg-[#1a3a5c]/90 transition-colors"
        >
          <Check size={14} /> Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </form>
  );
};

// Add Programme sub-component
const AddProgramForm = ({
  studentId,
  programs,
  admissions,
  available_certificates,
  onClose,
}: {
  studentId: number;
  programs: Program[];
  admissions: Admission[];
  available_certificates: Record<string, AvailableCert[]>;
  onClose: () => void;
}) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    program_slug:    "",
    admission_id:    "",
    enrollment_date: "",
    graduation_date: "",
    suspended_date:  "",
    status:          "active",
    certificate_id:  "",
  });

  const certsForProgram = data.program_slug
    ? (available_certificates[data.program_slug] ?? [])
    : [];

  const programOptions = programs.map((p) => ({ value: p.slug, label: p.title, sub: p.level }));
  const admissionOptions = [
    { value: "", label: "None" },
    ...admissions.map((a) => ({ value: String(a.id), label: a.full_name, sub: a.email })),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/students/${studentId}/programs`, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  return (
    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/40">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Programme Enrollment</h3>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <Field label="Programme" error={errors.program_slug}>
          <Combobox
            options={programOptions}
            value={data.program_slug}
            onChange={(v) => setData("program_slug", v)}
            placeholder="Select programme..."
            searchPlaceholder="Search..."
          />
        </Field>
        <Field label="Linked Admission" error={errors.admission_id}>
          <Combobox
            options={admissionOptions}
            value={data.admission_id}
            onChange={(v) => setData("admission_id", v)}
            placeholder="None"
            searchPlaceholder="Search..."
          />
        </Field>
        <Field label="Enrollment Date" error={errors.enrollment_date}>
          <DatePicker
            value={parseDate(data.enrollment_date)}
            onChange={(d) => setData("enrollment_date", formatDate(d))}
            placeholder="Enrollment date"
          />
        </Field>
        <Field label="Status" error={errors.status}>
          <Select value={data.status} onValueChange={(v) => setData("status", v)}>
            <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
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
              placeholder="Graduation date"
            />
          </Field>
        )}
        {data.status === "graduated" && (
          <Field label="Certificate" error={errors.certificate_id}>
            <Select
              value={data.certificate_id || "__none__"}
              onValueChange={(v) => setData("certificate_id", v === "__none__" ? "" : v)}
            >
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="No certificate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No certificate</SelectItem>
                {certsForProgram.filter((cert) => cert.id).map((cert) => (
                  <SelectItem key={cert.id} value={String(cert.id)}>
                    {cert.certificate_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {data.status === "suspended" && (
          <Field label="Suspension Date" error={errors.suspended_date}>
            <DatePicker
              value={parseDate(data.suspended_date)}
              onChange={(d) => setData("suspended_date", formatDate(d))}
              placeholder="Suspension date"
            />
          </Field>
        )}
        <div className="sm:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-60 hover:bg-[#1a3a5c]/90 transition-colors"
          >
            <Plus size={14} /> Add Enrollment
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <X size={14} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Edit = ({
  student,
  admissions,
  programs,
  available_certificates,
}: {
  student: Student;
  admissions: Admission[];
  programs: Program[];
  available_certificates: Record<string, AvailableCert[]>;
}) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [editingSpId, setEditingSpId]       = useState<number | null>(null);
  const [deleteSpId, setDeleteSpId]         = useState<number | null>(null);
  const [assignCertMap, setAssignCertMap]   = useState<Record<number, string>>({});
  const [showAddProgram, setShowAddProgram] = useState(false);

  // Student info form (photo + basic fields only)
  const { data, setData, post, processing, errors } = useForm<{
    _method: string;
    student_id: string;
    full_name: string;
    date_of_birth: string;
    email: string;
    nationality: string;
    phone_country_code: string;
    phone: string;
    address: string;
    image: File | null;
  }>({
    _method:            "PUT",
    student_id:         student.student_id,
    full_name:          student.full_name,
    date_of_birth:      student.date_of_birth ?? "",
    email:              student.email,
    nationality:        student.nationality ?? "",
    phone_country_code: student.phone_country_code ?? "",
    phone:              student.phone ?? "",
    address:            student.address ?? "",
    image:              null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    post(`/admin/students/${student.id}`, {
      forceFormData: true,
      onProgress: (progress) => setUploadProgress(progress?.percentage ?? 0),
      onFinish: () => setUploadProgress(null),
    });
  };

  const confirmDelete = () => {
    if (deleteSpId !== null) {
      router.delete(`/admin/students/${student.id}/programs/${deleteSpId}`);
      setDeleteSpId(null);
    }
  };

  const handleAssignCert = (sp: StudentProgramRow) => {
    const certId = assignCertMap[sp.id];
    if (!certId) return;
    router.patch(
      `/admin/students/${student.id}/programs/${sp.id}/certificate`,
      { certificate_id: certId },
      { onSuccess: () => setAssignCertMap((prev) => ({ ...prev, [sp.id]: "" })) }
    );
  };

  const deleteTarget = student.student_programs.find((sp) => sp.id === deleteSpId);

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {student.full_name} — {student.student_id}
            </p>
          </div>
        </div>

        {/* Section 1: Student Info */}
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Student Information</h2>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            <Field label="Student ID" error={errors.student_id}>
              <Input
                required
                value={data.student_id}
                onChange={(e) => setData("student_id", e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Full Name" error={errors.full_name}>
              <Input
                required
                value={data.full_name}
                onChange={(e) => setData("full_name", e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="rounded-xl border-gray-200"
              />
            </Field>

            <Field label="Date of Birth" error={errors.date_of_birth}>
              <DatePicker
                value={data.date_of_birth ? new Date(data.date_of_birth + "T00:00:00") : undefined}
                onChange={(d) => {
                  const y = d ? d.getFullYear() : "";
                  const m = d ? String(d.getMonth() + 1).padStart(2, "0") : "";
                  const day = d ? String(d.getDate()).padStart(2, "0") : "";
                  setData("date_of_birth", d ? `${y}-${m}-${day}` : "");
                }}
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

            <div className="sm:col-span-2">
              <Field label="Student Photo" error={errors.image}>
                <ImageCropper
                  aspectRatio={1}
                  maxSizeMb={5}
                  currentUrl={student.image_path ? `/${student.image_path}` : null}
                  onChange={(f) => setData("image", f)}
                  label=""
                />
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

          <div className="px-6 py-4 border-t border-gray-50 flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm"
            >
              {processing ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/students"
              className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Section 2: Programme Enrollments */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Programme Enrollments</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {student.student_programs.length} programme{student.student_programs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProgram(!showAddProgram)}
              className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-[#1a3a5c]/90 transition-colors"
            >
              <Plus size={13} />
              Add Programme
            </button>
          </div>

          {student.student_programs.length === 0 && !showAddProgram && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No programme enrollments yet. Add one using the button above.
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {student.student_programs.map((sp) => (
              <div key={sp.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800 text-sm">
                        {sp.program?.title ?? sp.program_slug}
                      </p>
                      <span
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                          statusStyles[sp.status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"
                        }`}
                      >
                        {sp.status.charAt(0).toUpperCase() + sp.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-500">
                      <span>Enrolled: {sp.enrollment_date ? sp.enrollment_date.slice(0, 10) : "—"}</span>
                      {sp.graduation_date && <span>Graduated: {sp.graduation_date.slice(0, 10)}</span>}
                      {sp.suspended_date && <span>Suspended: {sp.suspended_date.slice(0, 10)}</span>}
                    </div>

                    {/* Certificate badge or assign UI */}
                    {sp.certificate ? (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 text-xs text-emerald-700">
                        <Award size={12} />
                        <span className="font-mono font-semibold">{sp.certificate.certificate_number}</span>
                        {sp.certificate.status === "revoked" && (
                          <span className="ml-1 text-red-500 font-medium">(Revoked)</span>
                        )}
                      </div>
                    ) : sp.status === "graduated" ? (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {(available_certificates[sp.program_slug] ?? []).length > 0 ? (
                          <>
                            <select
                              value={assignCertMap[sp.id] ?? ""}
                              onChange={(e) =>
                                setAssignCertMap((prev) => ({ ...prev, [sp.id]: e.target.value }))
                              }
                              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                            >
                              <option value="">Select certificate…</option>
                              {(available_certificates[sp.program_slug] ?? []).map((cert) => (
                                <option key={cert.id} value={String(cert.id)}>
                                  {cert.certificate_number}
                                </option>
                              ))}
                            </select>
                            {assignCertMap[sp.id] && (
                              <button
                                type="button"
                                onClick={() => handleAssignCert(sp)}
                                className="inline-flex items-center gap-1 bg-teal-600 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
                              >
                                <Award size={11} />
                                Assign
                              </button>
                            )}
                          </>
                        ) : (
                          <Link
                            href="/admin/certificates/create"
                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#1a3a5c] transition-colors"
                          >
                            <Plus size={11} />
                            No certificates available — Create one
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingSpId(editingSpId === sp.id ? null : sp.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a3a5c] transition-colors"
                      title="Edit enrollment"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteSpId(sp.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove enrollment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                {editingSpId === sp.id && (
                  <ProgramEditRow
                    sp={sp}
                    studentId={student.id}
                    programs={programs}
                    admissions={admissions}
                    availableCerts={available_certificates[sp.program_slug] ?? []}
                    onClose={() => setEditingSpId(null)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Add Programme Form */}
          {showAddProgram && (
            <AddProgramForm
              studentId={student.id}
              programs={programs}
              admissions={admissions}
              available_certificates={available_certificates}
              onClose={() => setShowAddProgram(false)}
            />
          )}
        </div>
      </div>

      {/* Delete Programme AlertDialog */}
      <AlertDialog open={deleteSpId !== null} onOpenChange={(o) => !o && setDeleteSpId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Programme Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Remove enrollment in{" "}
              <span className="font-semibold">
                {deleteTarget?.program?.title ?? deleteTarget?.program_slug}
              </span>?
              {deleteTarget?.certificate && (
                <span className="block mt-2 text-red-600 font-medium">
                  This programme has an issued certificate. Delete the certificate first before removing the enrollment.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!deleteTarget?.certificate && (
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Issue Certificate AlertDialog removed — assignment is inline */}
    </AdminLayout>
  );
};

export default Edit;
