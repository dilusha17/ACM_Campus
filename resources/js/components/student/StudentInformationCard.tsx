import { usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";
import { ImageCropper } from "@/components/ui/image-cropper";
import { countryIdOptions, type CountryCode } from "@/lib/countryCodes";

/**
 * The student's personal details. This is the single definition of the
 * "Student Informations" and "Student Photo" cards, used by the admin
 * Add/Create Verified Student form and by the public "Complete Your Student
 * Details" page so the two can never drift apart.
 */

export interface StudentInfoValues {
  id_type: string;
  id_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  nationality_id: string;
  gender: string;
  /** Selected country (database id). The dial code below is derived from it. */
  country_code_id: string;
  phone_country_code: string;
  phone: string;
  address: string;
}

export type StudentInfoKey = keyof StudentInfoValues;

export interface StudentNationality {
  id: number;
  name: string;
}

export const parseDate = (value: string) => (value ? new Date(value.slice(0, 10) + "T00:00:00") : undefined);

export const formatDate = (value: Date | undefined) => {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

interface StudentInformationCardProps {
  data: StudentInfoValues;
  setData: (key: StudentInfoKey, value: string) => void;
  errors: Partial<Record<string, string>>;
  nationalities: StudentNationality[];
  /** Shown as the read-only, auto-generated Student ID (admin only). */
  nextStudentId?: string;
  /** Extra read-only rows shown first, e.g. the programme on the public form. */
  children?: React.ReactNode;
}

export const StudentInformationCard = ({
  data,
  setData,
  errors,
  nationalities,
  nextStudentId,
  children,
}: StudentInformationCardProps) => {
  const { countryCodes = [] } = usePage<{ countryCodes: CountryCode[] }>().props;

  // The country is chosen by its database id (so +1 / +7 stay unambiguous); the
  // dial code that a student record stores is filled in from that choice.
  const selectedCountryId =
    data.country_code_id ||
    (data.phone_country_code
      ? String(countryCodes.find((c) => c.dial_code === data.phone_country_code)?.id ?? "")
      : "");

  const selectCountry = (id: string) => {
    setData("country_code_id", id);
    setData("phone_country_code", countryCodes.find((c) => String(c.id) === id)?.dial_code ?? "");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">Student Informations</h2>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-5">
        {nextStudentId !== undefined && (
          <Field label="Student ID">
            <div className="relative">
              <Input
                value={nextStudentId}
                disabled
                readOnly
                className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">Auto</span>
            </div>
          </Field>
        )}

        {children}

        <Field label="NIC / Passport No. *" error={errors.id_number}>
          <div className="flex gap-2">
            <Select value={data.id_type} onValueChange={(value) => setData("id_type", value)}>
              <SelectTrigger className="rounded-xl border-gray-200 w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NIC">NIC</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
              </SelectContent>
            </Select>
            <Input
              required
              value={data.id_number}
              onChange={(e) => setData("id_number", e.target.value)}
              placeholder={data.id_type === "NIC" ? "e.g. 199012345678" : "e.g. N1234567"}
              maxLength={20}
              className="rounded-xl border-gray-200 flex-1"
            />
          </div>
        </Field>

        <Field label="First Name *" error={errors.first_name}>
          <Input required value={data.first_name} onChange={(e) => setData("first_name", e.target.value)} placeholder="Jane" className="rounded-xl border-gray-200" />
        </Field>

        <Field label="Last Name *" error={errors.last_name}>
          <Input required value={data.last_name} onChange={(e) => setData("last_name", e.target.value)} placeholder="Doe" className="rounded-xl border-gray-200" />
        </Field>

        <Field label="Full Name *" error={errors.full_name}>
          <Input required value={data.full_name} onChange={(e) => setData("full_name", e.target.value)} placeholder="Jane Doe" className="rounded-xl border-gray-200" />
        </Field>

        <Field label="Email *" error={errors.email}>
          <Input type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="student@email.com" className="rounded-xl border-gray-200" />
        </Field>

        <Field label="Date of Birth *" error={errors.date_of_birth}>
          <DatePicker value={parseDate(data.date_of_birth)} onChange={(value) => setData("date_of_birth", formatDate(value))} placeholder="Pick date of birth" />
        </Field>

        <Field label="Nationality *" error={errors.nationality_id}>
          <Select value={data.nationality_id} onValueChange={(value) => setData("nationality_id", value)}>
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Select nationality..." />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nationality) => (
                <SelectItem key={nationality.id} value={String(nationality.id)}>{nationality.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Gender *" error={errors.gender}>
          <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Select gender..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="not_stated">Prefer Not to Say</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="sm:col-span-2 grid sm:grid-cols-[16rem_1fr] gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Country <span className="text-red-500">*</span></Label>
            <Combobox
              options={countryIdOptions(countryCodes)}
              value={selectedCountryId}
              onChange={selectCountry}
              placeholder="Select country..."
              searchPlaceholder="Search country..."
            />
            {(errors.country_code_id || errors.phone_country_code) && <p className="text-red-500 text-xs">{errors.country_code_id ?? errors.phone_country_code}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
            <Input
              required
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value.replace(/\D/g, ""))}
              placeholder="Digits only"
              className="rounded-xl border-gray-200"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Field label="Address *" error={errors.address}>
            <Textarea required value={data.address} onChange={(e) => setData("address", e.target.value)} placeholder="Full postal address" className="rounded-xl border-gray-200 min-h-[96px]" />
          </Field>
        </div>
      </div>
    </div>
  );
};

interface StudentPhotoCardProps {
  onChange: (file: File | null) => void;
  error?: string;
  currentUrl?: string | null;
  uploadProgress?: number | null;
}

export const StudentPhotoCard = ({ onChange, error, currentUrl, uploadProgress }: StudentPhotoCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-50">
      <h2 className="font-semibold text-gray-800 text-sm">Student Photo</h2>
    </div>
    <div className="p-6">
      <Field label="" error={error}>
        <ImageCropper aspectRatio={1} maxSizeMb={5} currentUrl={currentUrl} onChange={onChange} label="" />
        {uploadProgress !== null && uploadProgress !== undefined && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}
      </Field>
    </div>
  </div>
);
