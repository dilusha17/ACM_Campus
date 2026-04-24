import { Link, router, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  FileText,
  Award,
  MessageSquare,
  Users,
  BookOpen,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

const nav = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/admissions",   label: "Admissions",   icon: FileText },
  { href: "/admin/scholarships", label: "Scholarships", icon: Award },
  { href: "/admin/contacts",     label: "Contacts",     icon: MessageSquare },
  { href: "/admin/programs",     label: "Programmes",   icon: BookOpen },
  { href: "/admin/certificates", label: "Certificates", icon: GraduationCap },
  { href: "/admin/students",     label: "Students",     icon: Users },
];

const SidebarContent = ({ url, onClose }: { url: string; onClose?: () => void }) => (
  <div className="flex flex-col h-full bg-[#1a3a5c]">
    {/* Brand header */}
    <div className="flex items-center justify-between px-5 h-[60px] border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-inner">
          A
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">ACM Campus</p>
          <p className="text-white/40 text-xs">Admin Portal</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors lg:hidden"
        >
          <X size={16} />
        </button>
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = url === href || (href !== "/admin" && url.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
              active
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/8"
            }`}
          >
            <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
            <span className="flex-1">{label}</span>
            {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
          </Link>
        );
      })}
    </nav>

    {/* Sign out */}
    <div className="border-t border-white/10 px-3 py-4 shrink-0">
      <button
        onClick={() => router.post("/admin/logout")}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/55 hover:text-white hover:bg-white/8 transition-all"
      >
        <LogOut size={17} strokeWidth={1.75} />
        Sign Out
      </button>
    </div>
  </div>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 font-body">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 shadow-xl z-40">
        <SidebarContent url={url} />
      </aside>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-64 sm:max-w-none p-0 border-0 [&>button]:hidden"
        >
          <div className="h-full">
            <SidebarContent url={url} onClose={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 md:px-6 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1a3a5c] flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold select-none">A</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
