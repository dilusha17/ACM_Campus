import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft } from "lucide-react";
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

interface Application {
  id: number; full_name: string; email: string; program_slug: string; scheme: string;
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

const Show = ({ application }: { application: Application }) => {
  const { data, setData, patch, processing } = useForm({ status: application.status });

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
              className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors disabled:opacity-60 shadow-sm">
              {processing ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Show;
