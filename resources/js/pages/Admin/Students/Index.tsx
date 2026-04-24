import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
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

interface Props {
  students: { data: Student[]; links: any[]; meta: any };
  filters: { status?: string; search?: string };
  total_count: number;
}

const Index = ({ students, filters, total_count }: Props) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const setFilter = (key: string, value: string) =>
    router.get("/admin/students", { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });

  const confirmDelete = () => {
    if (deleteId !== null) {
      router.delete(`/admin/students/${deleteId}`);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verified Students</h1>
            <p className="text-gray-500 text-sm mt-1">{total_count} student{total_count !== 1 ? "s" : ""}</p>
          </div>
          <Link
            href="/admin/students/create"
            className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-sm shadow-[#1a3a5c]/20 shrink-0"
          >
            <Plus size={16} /> Add Student
          </Link>
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
          <select value={filters.status ?? ""} onChange={(e) => setFilter("status", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20">
            <option value="">All statuses</option>
            {["active","graduated","suspended"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
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
    </AdminLayout>
  );
};

export default Index;
