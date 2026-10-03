import { useState } from "react";
import { useForm } from "@inertiajs/react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePage } from "@inertiajs/react";
import type { ProgramOption } from "@/types/program";
import { Combobox } from "@/components/ui/combobox";
import { countryIdOptions, type CountryCode } from "@/lib/countryCodes";

interface AdmissionFormProps {
  defaultProgramSlug?: string;
  onSubmitted?: () => void;
}

const AdmissionForm = ({ defaultProgramSlug, onSubmitted }: AdmissionFormProps) => {
  const { props } = usePage<{ programOptions: ProgramOption[]; countryCodes: CountryCode[]; nationalityOptions: { id: number; name: string }[] }>();
  const programs = props.programOptions ?? [];
  const countryOptions = countryIdOptions(props.countryCodes ?? []);
  const nationalityOptions = (props.nationalityOptions ?? []).map((n) => ({ value: String(n.id), label: n.name }));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const defaultProgramId = programs.find((program) => program.slug === defaultProgramSlug)?.id;

  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    full_name:            "",
    email:                "",
    country_code_id:      "",
    phone:                "",
    nationality_id:       "",
    program_id:           defaultProgramId ? String(defaultProgramId) : "",
    education_history:    "",
    english_qualifications: "",
    declaration_accepted: false as boolean,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.program_id) { toast.error("Please select a programme."); return; }
    if (!data.nationality_id) { toast.error("Please select your nationality."); return; }
    if (!data.country_code_id) { toast.error("Please select your country."); return; }
    if (!data.declaration_accepted) return;
    setConfirmOpen(true);
  };

  const finalSubmit = () => {
    setConfirmOpen(false);
    post("/admissions", {
      onSuccess: () => {
        toast.success("Application submitted", {
          description: `Thank you, ${data.full_name}. Our admissions team will be in touch within 10–15 working days.`,
        });
        reset();
        onSubmitted?.();
      },
      onError: (errs) => toast.error(Object.values(errs)[0] ?? "Something went wrong. Please try again."),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ad-fullname">Full Name</Label>
            <Input id="ad-fullname" required value={data.full_name} onChange={(e) => setData("full_name", e.target.value)} placeholder="Jane Doe" />
            {errors.full_name && <p className="text-destructive text-xs">{errors.full_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-email">Email</Label>
            <Input id="ad-email" type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="you@email.com" />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Nationality <span className="text-red-500">*</span></Label>
            <Combobox
              options={nationalityOptions}
              value={data.nationality_id}
              onChange={(v) => setData("nationality_id", v)}
              placeholder="Select nationality..."
              searchPlaceholder="Search nationality..."
            />
            {errors.nationality_id && <p className="text-destructive text-xs">{errors.nationality_id}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-[16rem_1fr] gap-4">
          <div className="space-y-2">
            <Label>Country <span className="text-red-500">*</span></Label>
            <Combobox
              options={countryOptions}
              value={data.country_code_id}
              onChange={(v) => setData("country_code_id", v)}
              placeholder="Select country..."
              searchPlaceholder="Search country..."
            />
            {errors.country_code_id && <p className="text-destructive text-xs">{errors.country_code_id}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input
              id="ad-phone"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value.replace(/\D/g, ""))}
              placeholder="Number (digits only)"
            />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-program">Programme</Label>
          <Select value={data.program_id} onValueChange={(value) => setData("program_id", value)}>
            <SelectTrigger id="ad-program">
              <SelectValue placeholder="Select a programme" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.title} · {p.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.program_id && <p className="text-destructive text-xs">{errors.program_id}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-education">Education History</Label>
          <Textarea id="ad-education" required rows={3} value={data.education_history} onChange={(e) => setData("education_history", e.target.value)} placeholder="Most recent qualifications, institution, year." />
          {errors.education_history && <p className="text-destructive text-xs">{errors.education_history}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-eng">English Qualifications <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
          <Input id="ad-eng" value={data.english_qualifications} onChange={(e) => setData("english_qualifications", e.target.value)} placeholder="e.g. IELTS 6.5, GCSE English Grade B" />
          {errors.english_qualifications && <p className="text-destructive text-xs">{errors.english_qualifications}</p>}
        </div>

        <label className="flex items-start gap-3 text-sm font-body text-muted-foreground">
          <input
            type="checkbox"
            checked={data.declaration_accepted}
            onChange={(e) => setData("declaration_accepted", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-secondary focus:ring-ring"
          />
          <span>I declare the information provided is accurate and consent to ACM Campus processing it for admissions purposes.</span>
        </label>
        {errors.declaration_accepted && <p className="text-destructive text-xs">{errors.declaration_accepted}</p>}

        <Button type="submit" disabled={processing || !data.declaration_accepted} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {processing ? "Submitting…" : "Review & Submit Application"}
        </Button>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your application?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm the details are accurate. You will receive a confirmation email shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review again</AlertDialogCancel>
            <AlertDialogAction onClick={finalSubmit} disabled={processing}>
              Confirm submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdmissionForm;
