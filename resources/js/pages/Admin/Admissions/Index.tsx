import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdmissionForm from "@/components/forms/AdmissionForm";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  reviewed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

interface Admission {
  id: number; full_name: string; email: string; phone: string;
  nationality: string; program_title: string | null; status: string; created_at: string;
}

interface Props {
  admissions: { data: Admission[]; links: any[]; meta: any };
  filters: { status?: string; search?: string };
  total_applications: number;
}

const clampTwoLines = "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] break-words";

const Index = ({ admissions, filters, total_applications }: Props) => {
  const setFilter = (key: string, value: string) =>
    router.get("/admin/admissions", { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
  const [newAdmissionOpen, setNewAdmissionOpen] = useState(false);

  return (
    <>
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
            <p className="text-gray-500 text-sm mt-1">{total_applications ?? admissions.meta?.total ?? 0} total applications</p>
          </div>
          <button
            type="button"
            onClick={() => setNewAdmissionOpen(true)}
            className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Record Admission
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name or email…"
              defaultValue={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]/30"
            />
          </div>
          <Select value={filters.status ?? "all"} onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["pending","reviewed","accepted","rejected"].map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Name","Email","Programme","Nationality","Status","Date",""].map((h) => (
                    <th
                      key={h}
                      className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Name" ? "w-[20%]" : ""} ${h === "Email" ? "w-[22%]" : ""} ${h === "Programme" ? "w-[20%]" : ""} ${h === "Nationality" ? "w-[14%]" : ""} ${h === "Status" ? "w-[10%]" : ""} ${h === "Date" ? "w-[10%]" : ""} ${h === "" ? "w-[4rem]" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admissions.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="text-gray-400 text-sm">No applications found.</p>
                    </td>
                  </tr>
                ) : (
                  admissions.data.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5 align-top font-medium text-gray-800"><p className={clampTwoLines}>{a.full_name}</p></td>
                      <td className="px-4 py-3.5 align-top text-gray-500"><p className={clampTwoLines}>{a.email}</p></td>
                      <td className="px-4 py-3.5 align-top text-gray-500"><p className={clampTwoLines}>{a.program_title ?? "—"}</p></td>
                      <td className="px-4 py-3.5 align-top text-gray-500"><p className={clampTwoLines}>{a.nationality}</p></td>
                      <td className="px-4 py-3.5 align-top"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5 align-top">
                        <Link
                          href={`/admin/admissions/${a.id}`}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>

        {/* Pagination */}
        {admissions.meta?.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {admissions.links.map((link: any, i: number) => (
              <Link
                key={i}
                href={link.url ?? "#"}
                preserveState
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  link.active
                    ? "bg-[#1a3a5c] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>

    <Dialog open={newAdmissionOpen} onOpenChange={setNewAdmissionOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Admission</DialogTitle>
        </DialogHeader>
        <AdmissionForm onSubmitted={() => { setNewAdmissionOpen(false); router.reload(); }} />
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Index;
