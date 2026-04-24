import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, Plus, RefreshCw, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";

interface Program {
  id: number;
  slug: string;
  title: string;
  level: string;
}

interface RecentCert {
  id: number;
  certificate_number: string;
  program_slug: string;
  program_title: string;
  level: string;
}

interface SharedProps {
  flash?: { success?: string; created_certificate?: string };
  [key: string]: unknown;
}

const levelBadge: Record<string, string> = {
  Degree:      "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Diploma:     "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  Certificate: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Master:      "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  PhD:         "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const Create = ({
  programs,
  recent_certificates,
}: {
  programs: Program[];
  recent_certificates: RecentCert[];
}) => {
  const { props } = usePage<SharedProps>();
  const flash = props.flash;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [selectedProgramSlug, setSelectedProgramSlug] = useState("");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [level, setLevel] = useState("Diploma");
  const [generating, setGenerating] = useState(false);

  const programOptions = programs.map((p) => ({
    value: p.slug,
    label: p.title,
    sub:   p.level,
  }));

  const handleProgramChange = (slug: string) => {
    setSelectedProgramSlug(slug);
    const prog = programs.find((p) => p.slug === slug);
    if (prog) setLevel(prog.level);
  };

  const handleGenerate = () => {
    if (!selectedProgramSlug) return;
    setGenerating(true);
    router.post(
      "/admin/certificates",
      { program_slug: selectedProgramSlug, graduated_year: selectedYear, level },
      { onFinish: () => setGenerating(false) }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/certificates"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Certificate</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Generate certificate IDs for a programme batch
            </p>
          </div>
        </div>

        {/* Flash: last generated cert */}
        {flash?.created_certificate && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <Award size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Certificate created</p>
              <p className="font-mono font-bold text-emerald-700 text-base mt-0.5 tracking-wide">
                {flash.created_certificate}
              </p>
            </div>
          </div>
        )}

        {/* Generator form */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Certificate Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Select a programme and graduate year, then press Generate to create a new certificate ID.
            </p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {/* Programme */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Programme</Label>
              <Combobox
                options={programOptions}
                value={selectedProgramSlug}
                onChange={handleProgramChange}
                placeholder="Select programme…"
                searchPlaceholder="Search programmes…"
              />
            </div>

            {/* Graduate Year */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Graduate Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Certificate Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ID preview */}
            {selectedProgramSlug && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">
                  Next ID will follow the pattern:{" "}
                  <span className="font-mono font-semibold text-gray-600">
                    ACM-{selectedYear}-{selectedProgramSlug.toUpperCase().replace(/-/g, "")}-XXX
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-50">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !selectedProgramSlug}
              className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors shadow-sm"
            >
              {generating ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              {generating ? "Generating…" : "Generate Certificate"}
            </button>
          </div>
        </div>

        {/* Unassigned certificate list */}
        {recent_certificates.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm">Unassigned Certificates</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                These have been created but not yet assigned to a student
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/60">
                    {["Certificate No.", "Programme", "Level"].map((h, i) => (
                      <th
                        key={i}
                        className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent_certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#1a3a5c]">
                        {cert.certificate_number}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-700">{cert.program_title}</p>
                        <p className="text-xs text-gray-400">{cert.program_slug}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            levelBadge[cert.level] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {cert.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Create;
