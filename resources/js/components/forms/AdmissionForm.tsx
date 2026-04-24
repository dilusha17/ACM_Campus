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

interface AdmissionFormProps {
  defaultProgramSlug?: string;
  onSubmitted?: () => void;
}

const AdmissionForm = ({ defaultProgramSlug, onSubmitted }: AdmissionFormProps) => {
  const { props } = usePage<{ programOptions: ProgramOption[] }>();
  const programs = props.programOptions ?? [];
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    full_name:            "",
    email:                "",
    phone:                "",
    nationality:          "",
    program_slug:         defaultProgramSlug ?? "",
    education_history:    "",
    english_qualifications: "",
    declaration_accepted: false as boolean,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.program_slug) { toast.error("Please select a programme."); return; }
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
      onError: () => toast.error("Something went wrong. Please try again."),
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
            <Label htmlFor="ad-phone">Phone</Label>
            <Input id="ad-phone" required value={data.phone} onChange={(e) => setData("phone", e.target.value)} placeholder="+44 ..." />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-nationality">Nationality</Label>
            <Input id="ad-nationality" required value={data.nationality} onChange={(e) => setData("nationality", e.target.value)} placeholder="British" />
            {errors.nationality && <p className="text-destructive text-xs">{errors.nationality}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad-program">Programme</Label>
          <Select value={data.program_slug} onValueChange={(v) => setData("program_slug", v)}>
            <SelectTrigger id="ad-program">
              <SelectValue placeholder="Select a programme" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.title} · {p.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.program_slug && <p className="text-destructive text-xs">{errors.program_slug}</p>}
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
