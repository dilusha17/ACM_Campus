import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, ShieldCheck, ShieldOff, Search } from "lucide-react";
import { useState } from "react";
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

interface Certificate {
  id: number;
  certificate_number: string;
  program_slug: string;
  program_title: string;
  issue_date: string;
  level: string;
  status: string;
  assigned: boolean;
  student: { id: number; student_id: string; full_name: string } | null;
}

interface Props {
  certificates: {
    data: Certificate[];
    links: any[];
    meta: any;
  };
  filters?: { search?: string; status?: string; assigned?: string };
}

const Index = ({ certificates, filters }: Props) => {
  const [revokeTarget, setRevokeTarget]       = useState<Certificate | null>(null);
  const [reinstateTarget, setReinstateTarget] = useState<Certificate | null>(null);
  const [search, setSearch] = useState(filters?.search ?? "");

  const setFilter = (key: string, value: string) =>
    router.get(
      "/admin/certificates",
      { ...filters, [key]: value || undefined },
      { preserveState: true, replace: true }
    );

  const confirmRevoke = () => {
    if (revokeTarget) {
      router.patch(`/admin/certificates/${revokeTarget.id}`, { status: "revoked" });
      setRevokeTarget(null);
    }
  };

  const confirmReinstate = () => {
    if (reinstateTarget) {
      router.patch(`/admin/certificates/${reinstateTarget.id}`, { status: "active" });
      setReinstateTarget(null);
    }
  };

  const levelBadge: Record<string, string> = {
    Degree:      "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Diploma:     "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    Certificate: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Master:      "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    PhD:         "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {certificates.meta?.total ?? 0} certificate{(certificates.meta?.total ?? 0) !== 1 ? "s" : ""} issued
            </p>
          </div>
          <Link
            href="/admin/certificates/create"
            className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Create Certificate
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by cert number or student name…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFilter("search", e.target.value);
              }}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
          </div>
          <select
            value={filters?.status ?? ""}
            onChange={(e) => setFilter("status", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
          <select
            value={filters?.assigned ?? ""}
            onChange={(e) => setFilter("assigned", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
          >
            <option value="">All assignments</option>
            <option value="yes">Assigned</option>
            <option value="no">Unassigned</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["Student", "Certificate No.", "Programme", "Level", "Issue Date", "Status", ""].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certificates.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No certificates found.
                    </td>
                  </tr>
                )}
                {certificates.data.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      {cert.student ? (
                        <>
                          <div className="font-medium text-gray-900">{cert.student.full_name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{cert.student.student_id}</div>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-700">{cert.certificate_number}</td>
                    <td className="px-5 py-3.5 max-w-[180px]">
                      <p className="truncate font-medium text-gray-600">{cert.program_title}</p>
                      <p className="text-xs text-gray-400 truncate">{cert.program_slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelBadge[cert.level] ?? "bg-gray-100 text-gray-600"}`}>
                        {cert.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {new Date(cert.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        cert.status === "active"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-red-50 text-red-600 ring-1 ring-red-200"
                      }`}>
                        {cert.status === "active" ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {cert.status === "active" ? (
                          <button
                            onClick={() => setRevokeTarget(cert)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <ShieldOff size={13} />
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => setReinstateTarget(cert)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <ShieldCheck size={13} />
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {certificates.meta?.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {certificates.links.map((link: any, i: number) => (
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

      {/* Revoke AlertDialog */}
      <AlertDialog open={revokeTarget !== null} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke certificate{" "}
              <span className="font-mono font-semibold">{revokeTarget?.certificate_number}</span>?
              The certificate will be marked as revoked. You can reinstate it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reinstate AlertDialog */}
      <AlertDialog open={reinstateTarget !== null} onOpenChange={(o) => !o && setReinstateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinstate Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Reinstate certificate{" "}
              <span className="font-mono font-semibold">{reinstateTarget?.certificate_number}</span>?
              It will be marked as active again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReinstate}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Reinstate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Index;
