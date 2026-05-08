import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, Search, Pencil, Trash2, Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusStyles: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  graduated: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  suspended: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

interface StudentProgram {
  program_slug: string;
  status: string;
  enrollment_date: string;
}

interface Student {
  id: number;
  student_id: string;
  full_name: string;
  email: string;
  image_path: string | null;
  student_programs: StudentProgram[];
}

interface Program {
  slug: string;
  title: string;
}

interface Props {
  students: { data: Student[]; links: any[]; meta: any };
  filters: { status?: string; search?: string; programme?: string };
  total_count: number;
  programs: Program[];
}

const Index = ({ students, filters, total_count, programs }: Props) => {
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [importing, setImporting]   = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const setFilter = (key: string, value: string) =>
    router.get("/admin/students", { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });

  const confirmDelete = () => {
    if (deleteId !== null) {
      router.delete(`/admin/students/${deleteId}`);
      setDeleteId(null);
    }
  };

  // ── Export ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.search)    params.set("search", filters.search);
    if (filters.status)    params.set("status", filters.status);
    if (filters.programme) params.set("programme", filters.programme);
    window.location.href = "/admin/students/export?" + params.toString();
  };

  // ── Import ──────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    let res;
    try {
      res = await axios.post<{
        column_error?: string;
        to_import?: Record<string, string>[];
        to_update?: Record<string, string>[];
        skipped?: number;
      }>("/admin/students/import/check", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? (Object.values(err.response.data.errors) as string[][]).flat().join("\n")
          : null) ||
        "Failed to process the file. Please try again.";
      setImportError(msg);
      setImporting(false);
      return;
    }

    setImporting(false);

    if (res.data.column_error) {
      setImportError(res.data.column_error);
      return;
    }

    const toImp    = res.data.to_import ?? [];
    const toUpd    = res.data.to_update ?? [];
    const skipped  = res.data.skipped ?? 0;

    if (toImp.length === 0 && toUpd.length === 0) {
      setImportError(
        skipped > 0
          ? `All ${skipped} row${skipped !== 1 ? "s" : ""} already exist in the system. Nothing to import.`
          : "The file contains no importable data."
      );
      return;
    }

    doImport(toImp, toUpd, skipped);
  };

  const doImport = async (
    rows: Record<string, string>[],
    updateRows: Record<string, string>[],
    skipped: number
  ) => {
    setImporting(true);
    try {
      const res = await axios.post<{ imported: number; updated: number }>(
        "/admin/students/import",
        { rows, update_rows: updateRows }
      );
      const parts: string[] = [];
      if (res.data.imported > 0)
        parts.push(`${res.data.imported} student${res.data.imported !== 1 ? "s" : ""} imported`);
      if (res.data.updated > 0)
        parts.push(`${res.data.updated} programme${res.data.updated !== 1 ? "s" : ""} added/updated for existing students`);
      if (skipped > 0)
        parts.push(`${skipped} row${skipped !== 1 ? "s" : ""} skipped (no changes)`);
      toast.success(parts.join(", ") + ".");
      router.reload();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? (Object.values(err.response.data.errors) as string[][]).flat().join("\n")
          : null) ||
        "Import failed. Please check the file and try again.";
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verified Students</h1>
            <p className="text-gray-500 text-sm mt-1">{total_count} student{total_count !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Import button */}
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
            >
              <Upload size={15} />
              {importing ? "Importing…" : "Import"}
            </button>
            {/* Export button */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download size={15} /> Export
            </button>
            {/* Add Student */}
            <Link
              href="/admin/students/create"
              className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-sm shadow-[#1a3a5c]/20 shrink-0"
            >
              <Plus size={16} /> Add Student
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search name, ID or email…" defaultValue={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
          </div>
          <Select value={filters.status ?? "all"} onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.programme ?? "all"} onValueChange={(v) => setFilter("programme", v === "all" ? "" : v)}>
            <SelectTrigger className="w-48 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All programmes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programmes</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["photo","Student ID","Name","Email","Programme","Status","Enrolled","actions"].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h === "photo" || h === "actions" ? "" : h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p className="text-gray-400 text-sm">No students found.</p>
                    </td>
                  </tr>
                ) : (
                  students.data.map((s) => {
                    const primaryProgram = s.student_programs?.[0];
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3">
                          {s.image_path ? (
                            <img
                              src={`/${s.image_path}`}
                              alt={s.full_name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center text-[#1a3a5c] font-semibold text-sm select-none">
                              {s.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">{s.student_id}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.full_name}</td>
                        <td className="px-4 py-3 text-gray-500">{s.email}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-36">
                          <p className="truncate">{primaryProgram?.program_slug ?? "—"}</p>
                          {s.student_programs?.length > 1 && (
                            <p className="text-xs text-gray-400">+{s.student_programs.length - 1} more</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={primaryProgram?.status ?? "active"} />
                        </td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{primaryProgram?.enrollment_date ? primaryProgram.enrollment_date.slice(0, 10) : "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/students/${s.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a3a5c] transition-colors"
                              title="Edit student"
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(s.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove student"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {students.meta?.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {students.links.map((link: any, i: number) => (
              <Link key={i} href={link.url ?? "#"} preserveState
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  link.active ? "bg-[#1a3a5c] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student from the verified list, along with all their programme enrollments and certificates. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Error AlertDialog */}
      <AlertDialog open={importError !== null} onOpenChange={(open) => !open && setImportError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Error</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap">
              {importError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setImportError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Index;
