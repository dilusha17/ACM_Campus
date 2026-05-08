import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Search } from "lucide-react";
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

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

interface Application {
  id: number; full_name: string; email: string; program_slug: string;
  scheme: string; status: string; created_at: string;
}

interface Props {
  applications: { data: Application[]; links: any[]; meta: any };
  filters: { status?: string; scheme?: string; search?: string };
}

const Index = ({ applications, filters }: Props) => {
  const setFilter = (key: string, value: string) =>
    router.get("/admin/scholarships", { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarship Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{applications.meta?.total ?? 0} total applications</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name or email…"
              defaultValue={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            />
          </div>
          <Select value={filters.scheme ?? "all"} onValueChange={(v) => setFilter("scheme", v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All schemes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All schemes</SelectItem>
              {["Merit","Need-based","International","Research"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status ?? "all"} onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 rounded-xl border-gray-200 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["pending","reviewed","approved","rejected"].map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Name","Email","Programme","Scheme","Status","Date",""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="text-gray-400 text-sm">No applications found.</p>
                    </td>
                  </tr>
                ) : (
                  applications.data.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">{a.full_name}</td>
                      <td className="px-4 py-3.5 text-gray-500">{a.email}</td>
                      <td className="px-4 py-3.5 text-gray-500 max-w-36"><p className="truncate">{a.program_slug}</p></td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{a.scheme}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/scholarships/${a.id}`}
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
        </div>

        {applications.meta?.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {applications.links.map((link: any, i: number) => (
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
    </AdminLayout>
  );
};

export default Index;
