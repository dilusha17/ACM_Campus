import { Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { FileText, Award, MessageSquare, Users, ArrowRight } from "lucide-react";

interface Stats {
  pendingAdmissions: number;
  pendingScholarships: number;
  newContacts: number;
  totalStudents: number;
  totalAdmissions: number;
  totalScholarships: number;
}

interface RecentItem {
  id: number;
  full_name?: string;
  name?: string;
  email: string;
  program_slug?: string;
  scheme?: string;
  subject?: string;
  status: string;
  created_at: string;
}

interface Props {
  stats: Stats;
  recentAdmissions: RecentItem[];
  recentScholarships: RecentItem[];
  recentContacts: RecentItem[];
}

const statusStyles: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  reviewed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
  new:      "bg-violet-50 text-violet-700 ring-1 ring-violet-200/80",
  read:     "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80",
  replied:  "bg-teal-50 text-teal-700 ring-1 ring-teal-200/80",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyles[status] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80"}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const StatCard = ({
  label, value, sub, icon: Icon, href, gradient,
}: {
  label: string; value: number; sub?: number; icon: React.ElementType; href: string; gradient: string;
}) => (
  <Link
    href={href}
    className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient} shadow-sm`}>
      <Icon size={21} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
      <p className="text-sm text-gray-500 mt-1 leading-tight">{label}</p>
      {sub !== undefined && (
        <p className="text-xs text-gray-400 mt-0.5">{sub} total</p>
      )}
    </div>
    <ArrowRight size={15} className="text-gray-300 group-hover:text-gray-400 ml-auto shrink-0 transition-colors" />
  </Link>
);

const Avatar = ({ name }: { name: string }) => (
  <div className="w-8 h-8 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center shrink-0">
    <span className="text-[#1a3a5c] text-xs font-semibold uppercase select-none">
      {name.charAt(0)}
    </span>
  </div>
);

const Dashboard = ({ stats, recentAdmissions, recentScholarships, recentContacts }: Props) => (
  <AdminLayout>
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of applications and inquiries</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Pending Admissions" value={stats.pendingAdmissions} sub={stats.totalAdmissions}
          icon={FileText} href="/admin/admissions" gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          label="Pending Scholarships" value={stats.pendingScholarships} sub={stats.totalScholarships}
          icon={Award} href="/admin/scholarships" gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          label="New Contacts" value={stats.newContacts}
          icon={MessageSquare} href="/admin/contacts" gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          label="Verified Students" value={stats.totalStudents}
          icon={Users} href="/admin/students" gradient="bg-gradient-to-br from-teal-500 to-teal-600"
        />
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        {[
          {
            title: "Recent Admissions",
            items: recentAdmissions,
            href: "/admin/admissions",
            nameKey: "full_name" as const,
            subKey: "program_slug" as const,
          },
          {
            title: "Recent Scholarships",
            items: recentScholarships,
            href: "/admin/scholarships",
            nameKey: "full_name" as const,
            subKey: "scheme" as const,
          },
          {
            title: "Recent Contacts",
            items: recentContacts,
            href: "/admin/contacts",
            nameKey: "name" as const,
            subKey: "subject" as const,
          },
        ].map(({ title, items, href, nameKey, subKey }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
              <Link
                href={href}
                className="text-xs text-[#1a3a5c]/70 hover:text-[#1a3a5c] font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {/* Panel items */}
            <div className="divide-y divide-gray-50">
              {items.length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-400 text-center">No records yet.</p>
              ) : (
                items.map((item) => (
                  <Link
                    key={item.id}
                    href={`${href}/${item.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition-colors"
                  >
                    <Avatar name={(item as any)[nameKey] ?? "?"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate leading-tight">
                        {(item as any)[nameKey]}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {(item as any)[subKey]}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </AdminLayout>
);

export default Dashboard;
