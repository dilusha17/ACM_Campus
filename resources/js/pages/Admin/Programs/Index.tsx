import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Program {
  id: number;
  slug: string;
  title: string;
  level: string;
  duration: string;
  is_active: boolean;
}

interface Props {
  programs: Program[];
  filters: { search?: string; level?: string };
}

const levelBadge: Record<string, string> = {
  Degree: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Diploma: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  Certificate: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

const Index = ({ programs, filters }: Props) => {
  const [search, setSearch] = useState(filters.search ?? "");
  const [level, setLevel] = useState(filters.level ?? "");
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);

  const applyFilters = (newSearch: string, newLevel: string) => {
    router.get(
      "/admin/programs",
      { search: newSearch || undefined, level: newLevel || undefined },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, level);
  };

  const handleLevelChange = (v: string) => {
    const val = v === "all" ? "" : v;
    setLevel(val);
    applyFilters(search, val);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      router.delete(`/admin/programs/${deleteTarget.id}`);
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programmes</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {programs.length} programme{programs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/programs/create"
            className="flex items-center gap-2 bg-[#1a3a5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Programme
          </Link>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programmes…"
              className="pl-9 rounded-xl border-gray-200 text-sm"
            />
          </div>
          <Select value={level || "all"} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Degree">Degree</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Certificate">Certificate</SelectItem>
            </SelectContent>
          </Select>
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Programme
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Level
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Duration
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {programs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-400 text-sm"
                    >
                      No programmes found.
                    </td>
                  </tr>
                )}
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{prog.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{prog.slug}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          levelBadge[prog.level] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {prog.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{prog.duration}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          prog.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {prog.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/programs/${prog.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a5c] hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(prog)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Programme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{deleteTarget?.title}"</span>?
              This will also remove all related student enrollments and certificates. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Index;
