import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import VerifiedStudentForm, {
  AvailableCertificate,
  VerifiedStudentFormValues,
  VerifiedStudentNationality,
  VerifiedStudentProgram,
} from "@/components/admin/VerifiedStudentForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusStyles: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  reviewed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
};

interface DetailRequest {
  id: number;
  submitted: boolean;
  expired: boolean;
  expires_at: string;
  already_enrolled: boolean;
  values: Partial<VerifiedStudentFormValues> | null;
  image_url: string | null;
}

const splitFullName = (fullName: string) => {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
  return { first_name: firstName, last_name: rest.join(" ") };
};

interface Application {
  id: number; program_id: number; full_name: string; email: string; program_slug: string; scheme: string;
  annual_household_income: string; motivation_statement: string;
  referee1_name: string; referee1_email: string; referee2_name: string; referee2_email: string;
  status: string; created_at: string;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</dt>
    <dd className="text-gray-800 text-sm whitespace-pre-wrap">{value || "—"}</dd>
  </div>
);

const Show = ({
  application,
  detail_request,
  nationalities,
  programs,
  next_student_id,
  available_certificates,
}: {
  application: Application;
  detail_request: DetailRequest | null;
  nationalities: VerifiedStudentNationality[];
  programs: VerifiedStudentProgram[];
  next_student_id: string;
  available_certificates: Record<string, AvailableCertificate[]>;
}) => {
  const { data, setData, patch, processing } = useForm({ status: application.status });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const { first_name, last_name } = splitFullName(application.full_name);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link
            href="/admin/scholarships"
            className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{application.full_name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[application.status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">Scholarship Application #{application.id}</p>
          </div>
        </div>

        {/* Main details */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Application Details</h2>
          </div>
          <dl className="grid sm:grid-cols-2 gap-5 p-6">
            <Field label="Full Name" value={application.full_name} />
            <Field label="Email" value={application.email} />
            <Field label="Programme" value={application.program_slug} />
            <Field label="Scheme" value={application.scheme} />
            <Field label="Annual Household Income" value={application.annual_household_income} />
            <Field label="Submitted" value={new Date(application.created_at).toLocaleDateString()} />
            <div className="sm:col-span-2">
              <Field label="Motivation Statement" value={application.motivation_statement} />
            </div>
          </dl>
        </div>

        {/* Referees */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Referees</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-50">
            <div className="p-6 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referee 1</p>
              <p className="text-gray-800 text-sm font-medium">{application.referee1_name}</p>
              <p className="text-gray-500 text-sm">{application.referee1_email}</p>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referee 2</p>
              <p className="text-gray-800 text-sm font-medium">{application.referee2_name}</p>
              <p className="text-gray-500 text-sm">{application.referee2_email}</p>
            </div>
          </div>
        </div>

        {/* Status update */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Update Status</h2>
          <p className="text-gray-400 text-xs mb-3">Change the application status and save.</p>
          <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
            An email notification will be sent to the applicant when the status changes.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); patch(`/admin/scholarships/${application.id}/status`); }}
            className="flex flex-wrap gap-3"
          >
            <Select value={data.status} onValueChange={(v) => setData("status", v)}>
              <SelectTrigger className="w-44 border-gray-200 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["pending","reviewed","approved","rejected"].map((s) => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button type="submit" disabled={processing}
              className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors disabled:opacity-60 shadow-xs">
              {processing ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {(application.status === "approved" || data.status === "approved") && detail_request && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            {detail_request.submitted
              ? detail_request.already_enrolled
                ? "The applicant submitted their student details, and a student record was created from them."
                : "The applicant has submitted their student details. They are pre-filled below."
              : detail_request.expired
                ? "The student-details link expired without a response. Set the status to another value and back to Approved to send a new link."
                : `Waiting for the applicant to complete the student-details form (link valid until ${detail_request.expires_at}).`}
          </div>
        )}

        {/* Create Student Record — shown when status is approved */}
        {(application.status === "approved" || data.status === "approved") && (
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
              <div className="px-6 pb-6 border-t border-gray-50">
                <div className="mt-4">
                  <VerifiedStudentForm
                    nationalities={nationalities}
                    programs={programs}
                    nextStudentId={next_student_id}
                    availableCertificates={available_certificates}
                    submitUrl="/admin/students"
                    submitLabel="Create Student Record"
                    submittingLabel="Creating..."
                    introText={detail_request?.submitted
                      ? "Pre-filled from the scholarship application and the details form the applicant submitted. Review them, then complete enrolment details."
                      : "Some fields were pre-filled from the scholarship application. Complete the remaining details to create the verified student record."}
                    submittedImageUrl={detail_request?.image_url}
                    initialValues={{
                      first_name,
                      last_name,
                      full_name: application.full_name,
                      email: application.email,
                      ...(detail_request?.values ?? {}),
                      program_id: String(application.program_id),
                      scholarship_application_id: String(application.id),
                      detail_request_id: detail_request?.submitted && !detail_request.already_enrolled ? String(detail_request.id) : "",
                      status: "active",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Show;
