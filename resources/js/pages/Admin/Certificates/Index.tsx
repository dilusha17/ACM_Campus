import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, ShieldCheck, ShieldOff, Search, Eye, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Certificate {
  id: number;
  certificate_number: string;
  program_slug: string;
  program_title: string;
  issue_date: string;
  certificate_sample: string | null;
  level: string;
  status: string;
  assigned: boolean;
  student: { id: number; student_id: string; full_name: string } | null;
}

interface Props {
  certificates: {
    data: Certificate[];
    links: any[];
    last_page: number;
    total: number;
  };
  filters?: { search?: string; status?: string; assigned?: string };
}

const Index = ({ certificates, filters }: Props) => {
  const [revokeTarget, setRevokeTarget]       = useState<Certificate | null>(null);
  const [reinstateTarget, setReinstateTarget] = useState<Certificate | null>(null);
  const [search, setSearch] = useState(filters?.search ?? "");
  const [previewTarget, setPreviewTarget]     = useState<Certificate | null>(null);

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
              {certificates.total ?? 0} certificate{(certificates.total ?? 0) !== 1 ? "s" : ""} issued
            </p>
          </div>
          <Link
            href="/admin/certificates/create"
            className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-xs"
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
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
          </div>
          <Select value={filters?.status ?? "all"} onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters?.assigned ?? "all"} onValueChange={(v) => setFilter("assigned", v === "all" ? "" : v)}>
            <SelectTrigger className="w-44 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All assignments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignments</SelectItem>
              <SelectItem value="yes">Assigned</SelectItem>
              <SelectItem value="no">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["Certificate No.", "Programme", "Level", "Issue Date", "Status", "Actions"].map((h, i) => (
                    <th key={i} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certificates.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No certificates found.
                    </td>
                  </tr>
                )}
                {certificates.data.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
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
                        <button
                          type="button"
                          onClick={() => setPreviewTarget(cert)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a5c] hover:bg-gray-100 transition-colors"
                          title="Preview certificate"
                          aria-label="Preview certificate"
                        >
                          <Eye size={15} />
                        </button>
                        <Link
                          href={`/admin/certificates/${cert.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a5c] hover:bg-gray-100 transition-colors"
                          title="Edit certificate"
                          aria-label="Edit certificate"
                        >
                          <Pencil size={15} />
                        </Link>
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
        {certificates.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {certificates.links.map((link: any, i: number) => (
              <Link
                key={i}
                href={link.url ?? "#"}
                preserveState
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  link.active
                    ? "bg-[#1a3a5c] text-white shadow-xs"
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

      {/* Preview dialog */}
      <Dialog open={previewTarget !== null} onOpenChange={(o) => !o && setPreviewTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-base">{previewTarget?.certificate_number}</DialogTitle>
            <DialogDescription>
              {previewTarget?.program_title}
              {previewTarget ? ` · ${previewTarget.level}` : ""}
            </DialogDescription>
          </DialogHeader>
          {previewTarget?.certificate_sample ? (
            <img
              src={`/${previewTarget.certificate_sample}`}
              alt={`Sample of certificate ${previewTarget.certificate_number}`}
              className="w-full rounded-lg border border-gray-200 bg-white object-contain"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-sm text-gray-500">
              No sample image uploaded for this certificate.
              {previewTarget && (
                <div className="mt-3">
                  <Link href={`/admin/certificates/${previewTarget.id}/edit`} className="text-[#1a3a5c] font-medium hover:underline">
                    Upload one in Edit
                  </Link>
                </div>
              )}
            </div>
          )}
          {previewTarget && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400">Issue Date</dt>
                <dd className="text-gray-800">{new Date(previewTarget.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400">Status</dt>
                <dd className="text-gray-800">{previewTarget.status === "active" ? "Active" : "Revoked"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wide text-gray-400">Assigned Student</dt>
                <dd className="text-gray-800">{previewTarget.student ? `${previewTarget.student.full_name} — ${previewTarget.student.student_id}` : "Not assigned"}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Index;
