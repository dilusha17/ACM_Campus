import { Link, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useState } from "react";
import { countryCodeOptions } from "@/data/countryCodes";

const statusStyles: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  reviewed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
};

interface Admission {
  id: number; full_name: string; email: string; phone: string; nationality: string;
  program_slug: string; education_history: string; english_qualifications: string | null;
  declaration_accepted: boolean; status: string; created_at: string;
}

const Field = ({ label, value }: { label: string; value: string | boolean }) => (
  <div>
    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
    <dd className="text-gray-800 text-sm">{typeof value === "boolean" ? (value ? "Yes" : "No") : value || "—"}</dd>
  </div>
);

const Show = ({ admission }: { admission: Admission }) => {
  const { data, setData, patch, processing } = useForm({ status: admission.status });
  const [showStudentForm, setShowStudentForm] = useState(false);

  const studentForm = useForm<{
    student_id: string;
    full_name: string;
    date_of_birth: string;
    email: string;
    nationality: string;
    phone_country_code: string;
    phone: string;
    address: string;
    program_slug: string;
    admission_id: number;
    enrollment_date: string;
    status: string;
    image: File | null;
  }>({
    student_id:         "",
    full_name:          admission.full_name,
    date_of_birth:      "",
    email:              admission.email,
    nationality:        admission.nationality,
    phone_country_code: "",
    phone:              admission.phone,
    address:            "",
    program_slug:       admission.program_slug,
    admission_id:       admission.id,
    enrollment_date:    "",
    status:             "active",
    image:              null,
  });

  const parseDate = (s: string) => (s ? new Date(s.slice(0, 10) + "T00:00:00") : undefined);
  const formatDate = (d: Date | undefined) => d ? d.toISOString().split("T")[0] : "";

  const submitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    studentForm.post("/admin/students", { forceFormData: true });
  };

  const updateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/admin/admissions/${admission.id}/status`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link
            href="/admin/admissions"
            className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{admission.full_name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[admission.status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
                {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">Admission Application #{admission.id}</p>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Application Details</h2>
          </div>
          <dl className="grid sm:grid-cols-2 gap-5 p-6">
            <Field label="Full Name" value={admission.full_name} />
            <Field label="Email" value={admission.email} />
            <Field label="Phone" value={admission.phone} />
            <Field label="Nationality" value={admission.nationality} />
            <Field label="Programme" value={admission.program_slug} />
            <Field label="Submitted" value={new Date(admission.created_at).toLocaleDateString()} />
            <div className="sm:col-span-2">
              <Field label="Education History" value={admission.education_history} />
            </div>
            {admission.english_qualifications && (
              <div className="sm:col-span-2">
                <Field label="English Qualifications" value={admission.english_qualifications} />
              </div>
            )}
            <Field label="Declaration Accepted" value={admission.declaration_accepted} />
          </dl>
        </div>

        {/* Status update card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Update Status</h2>
          <p className="text-gray-400 text-xs mb-3">Change the application status and save.</p>
          <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
            An email notification will be sent to the applicant when the status changes.
          </p>
          <form onSubmit={updateStatus} className="flex flex-wrap gap-3 items-center">
            <Select value={data.status} onValueChange={(v) => setData("status", v)}>
              <SelectTrigger className="w-44 border-gray-200 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["pending","reviewed","accepted","rejected"].map((s) => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="submit"
              disabled={processing}
              className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors disabled:opacity-60 shadow-sm"
            >
              {processing ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Create Student Record — shown when status is accepted */}
        {(admission.status === "accepted" || data.status === "accepted") && (
          <div className="bg-white rounded-2xl border border-[#1a3a5c]/15 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowStudentForm((v) => !v)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus size={16} className="text-[#1a3a5c]" />
                <span className="font-semibold text-gray-800 text-sm">Create Verified Student Record</span>
              </div>
              {showStudentForm ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {showStudentForm && (
              <form onSubmit={submitStudent} className="px-6 pb-6 border-t border-gray-50">
                <p className="text-xs text-gray-400 mt-4 mb-5">Fields pre-filled from the admission. Add the student ID and enrollment date to complete.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Student ID <span className="text-red-500">*</span></label>
                    <Input
                      required
                      value={studentForm.data.student_id}
                      onChange={(e) => studentForm.setData("student_id", e.target.value)}
                      placeholder="ACM-2025-001"
                      className="rounded-xl border-gray-200"
                    />
                    {studentForm.errors.student_id && <p className="text-red-500 text-xs">{studentForm.errors.student_id}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input value={studentForm.data.full_name} readOnly className="rounded-xl border-gray-200 bg-gray-50" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                    <DatePicker
                      value={studentForm.data.date_of_birth ? new Date(studentForm.data.date_of_birth + "T00:00:00") : undefined}
                      onChange={(d) => studentForm.setData("date_of_birth", d ? d.toISOString().split("T")[0] : "")}
                      placeholder="Pick date of birth"
                    />
                    {studentForm.errors.date_of_birth && <p className="text-red-500 text-xs">{studentForm.errors.date_of_birth}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input value={studentForm.data.email} readOnly className="rounded-xl border-gray-200 bg-gray-50" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Nationality <span className="text-red-500">*</span></label>
                    <Input
                      required
                      value={studentForm.data.nationality}
                      onChange={(e) => studentForm.setData("nationality", e.target.value)}
                      placeholder="e.g. British"
                      className="rounded-xl border-gray-200"
                    />
                    {studentForm.errors.nationality && <p className="text-red-500 text-xs">{studentForm.errors.nationality}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Mobile <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <div className="w-64 shrink-0">
                        <Combobox
                          options={countryCodeOptions}
                          value={studentForm.data.phone_country_code}
                          onChange={(v) => studentForm.setData("phone_country_code", v)}
                          placeholder="Country code…"
                          searchPlaceholder="Search country…"
                        />
                      </div>
                      <Input
                        required
                        value={studentForm.data.phone}
                        onChange={(e) => studentForm.setData("phone", e.target.value)}
                        placeholder="Phone number"
                        className="rounded-xl border-gray-200 flex-1"
                      />
                    </div>
                    {studentForm.errors.phone_country_code && <p className="text-red-500 text-xs">{studentForm.errors.phone_country_code}</p>}
                    {studentForm.errors.phone && <p className="text-red-500 text-xs">{studentForm.errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Input
                      value={studentForm.data.address}
                      onChange={(e) => studentForm.setData("address", e.target.value)}
                      placeholder="Full postal address"
                      className="rounded-xl border-gray-200"
                    />
                    {studentForm.errors.address && <p className="text-red-500 text-xs">{studentForm.errors.address}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Programme</label>
                    <Input value={studentForm.data.program_slug} readOnly className="rounded-xl border-gray-200 bg-gray-50 font-mono text-sm" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Enrollment Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      value={parseDate(studentForm.data.enrollment_date)}
                      onChange={(d) => studentForm.setData("enrollment_date", formatDate(d))}
                      placeholder="Pick enrollment date"
                    />
                    {studentForm.errors.enrollment_date && <p className="text-red-500 text-xs">{studentForm.errors.enrollment_date}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={studentForm.data.status} onValueChange={(v) => studentForm.setData("status", v)}>
                      <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <ImageCropper
                      aspectRatio={1}
                      maxSizeMb={5}
                      onChange={(f) => studentForm.setData("image", f)}
                      label="Student Photo (optional, max 5 MB)"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={studentForm.processing}
                  className="mt-5 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-60 transition-colors shadow-sm"
                >
                  {studentForm.processing ? "Creating…" : "Create Student Record"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Show;
