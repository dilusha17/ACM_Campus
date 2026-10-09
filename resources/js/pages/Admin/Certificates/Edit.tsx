import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft, Paperclip, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgramOption {
  id: number;
  slug: string;
  title: string;
  level: string;
}

interface CertificateData {
  id: number;
  certificate_number: string;
  program_id: number;
  assigned: boolean;
  program_title: string | null;
  program_slug: string | null;
  level: string;
  issue_date: string | null;
  status: string;
  certificate_sample: string | null;
  student: { student_id: string; full_name: string } | null;
}

const parseDate = (value: string) => (value ? new Date(value.slice(0, 10) + "T00:00:00") : undefined);
const formatDate = (value: Date | undefined) => {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const MAX_SAMPLE_MB = 20;

const Edit = ({ certificate, programs }: { certificate: CertificateData; programs: ProgramOption[] }) => {
  const sampleInputRef = useRef<HTMLInputElement>(null);
  const [sampleError, setSampleError] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm<{
    _method: string;
    program_id: string;
    level: string;
    issue_date: string;
    status: string;
    sample: File | null;
    remove_sample: boolean;
  }>({
    _method: "PUT",
    program_id: String(certificate.program_id),
    level: certificate.level,
    issue_date: certificate.issue_date ?? "",
    status: certificate.status,
    sample: null,
    remove_sample: false,
  });

  const programOptions = programs.map((p) => ({ value: String(p.id), label: p.title, sub: p.level }));

  const showCurrent = certificate.certificate_sample && !data.remove_sample && !data.sample;

  const onSampleChange = (file: File | null) => {
    if (file && file.size > MAX_SAMPLE_MB * 1024 * 1024) {
      setSampleError(`The image must be smaller than ${MAX_SAMPLE_MB} MB.`);
      return;
    }
    setSampleError(null);
    setData((prev) => ({ ...prev, sample: file, remove_sample: false }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/certificates/${certificate.id}`, { forceFormData: true });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/certificates"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Certificate</h1>
            <p className="text-gray-400 text-sm mt-0.5 font-mono">{certificate.certificate_number}</p>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Certificate Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              The certificate number cannot be changed because it is printed on the certificate and used for verification. It stays the same even if you change the programme.
            </p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Certificate Number</Label>
              <Input value={certificate.certificate_number} disabled readOnly className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Programme <span className="text-red-500">*</span></Label>
              {certificate.assigned ? (
                <>
                  <Input value={certificate.program_title ?? certificate.program_slug ?? "—"} disabled readOnly className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-400">Assigned to a student, so the programme can't be changed.</p>
                </>
              ) : (
                <Combobox
                  options={programOptions}
                  value={data.program_id}
                  onChange={(v) => v && setData("program_id", v)}
                  placeholder="Select programme…"
                  searchPlaceholder="Search programme…"
                />
              )}
              {errors.program_id && <p className="text-red-500 text-xs">{errors.program_id}</p>}
            </div>

            {certificate.student && (
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Assigned Student</Label>
                <Input value={`${certificate.student.full_name} — ${certificate.student.student_id}`} disabled readOnly className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Certificate Level <span className="text-red-500">*</span></Label>
              <Select value={data.level} onValueChange={(v) => setData("level", v)}>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Degree", "Diploma", "Certificate", "Master", "PhD"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && <p className="text-red-500 text-xs">{errors.level}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Issue Date <span className="text-red-500">*</span></Label>
              <DatePicker
                value={parseDate(data.issue_date)}
                onChange={(value) => setData("issue_date", formatDate(value))}
                placeholder="Pick issue date"
              />
              {errors.issue_date && <p className="text-red-500 text-xs">{errors.issue_date}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></Label>
              <Select value={data.status} onValueChange={(v) => setData("status", v)}>
                <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Sample Certificate Image <span className="text-gray-400 font-normal">(optional — JPG/PNG/WebP)</span>
              </Label>

              {showCurrent && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-start gap-4">
                  <img
                    src={`/${certificate.certificate_sample}`}
                    alt="Current sample certificate"
                    className="h-40 w-auto max-w-full rounded-lg border border-gray-200 bg-white object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setData("remove_sample", true)}
                    className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Trash2 size={13} /> Remove image
                  </button>
                </div>
              )}
              {data.remove_sample && (
                <p className="text-xs text-amber-600">The current image will be removed when you save.</p>
              )}

              <input
                ref={sampleInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => onSampleChange(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => sampleInputRef.current?.click()}
                className="inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors w-full"
              >
                <Paperclip size={14} className="shrink-0" />
                <span className="truncate">
                  {data.sample ? data.sample.name : certificate.certificate_sample ? "Click to replace image…" : "Click to attach image…"}
                </span>
              </button>
              {(sampleError || errors.sample) && <p className="text-red-500 text-xs">{sampleError ?? errors.sample}</p>}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 flex items-center gap-3">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a5c]/90 disabled:opacity-50 transition-colors shadow-xs"
            >
              {processing ? "Saving…" : "Save Changes"}
            </button>
            <Link href="/admin/certificates" className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Edit;
