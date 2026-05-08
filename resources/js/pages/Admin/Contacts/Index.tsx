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
  new:     "bg-violet-50 text-violet-700 ring-1 ring-violet-200/80",
  read:    "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80",
  replied: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/80",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

interface Inquiry {
  id: number; name: string; email: string; subject: string; status: string; created_at: string;
}

interface Props {
  inquiries: { data: Inquiry[]; links: any[]; meta: any };
  filters: { status?: string; search?: string };
}

const Index = ({ inquiries, filters }: Props) => {
  const setFilter = (key: string, value: string) =>
    router.get("/admin/contacts", { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{inquiries.meta?.total ?? 0} total inquiries</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search name, email or subject…" defaultValue={filters.search}
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
              {["new","read","replied"].map((s) => (
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
                  {["Name","Email","Subject","Status","Date",""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="text-gray-400 text-sm">No inquiries found.</p>
                    </td>
                  </tr>
                ) : (
                  inquiries.data.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">{i.name}</td>
                      <td className="px-4 py-3.5 text-gray-500">{i.email}</td>
                      <td className="px-4 py-3.5 text-gray-500 max-w-56"><p className="truncate">{i.subject}</p></td>
                      <td className="px-4 py-3.5"><StatusBadge status={i.status} /></td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">{new Date(i.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/contacts/${i.id}`}
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

        {inquiries.meta?.last_page > 1 && (
          <div className="flex gap-1.5 justify-center flex-wrap">
            {inquiries.links.map((link: any, i: number) => (
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
