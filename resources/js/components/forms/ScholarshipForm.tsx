import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
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
import type { ProgramOption } from "@/types/program";

interface ScholarshipFormProps {
  defaultProgramSlug?: string;
  onSubmitted?: () => void;
}

const schemes = ["Merit", "Need-based", "International", "Research"];

const ScholarshipForm = ({ defaultProgramSlug, onSubmitted }: ScholarshipFormProps) => {
  const { props } = usePage<{ programOptions: ProgramOption[] }>();
  const programs = props.programOptions ?? [];
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    full_name:               "",
    email:                   "",
    program_slug:            defaultProgramSlug ?? "",
    scheme:                  "",
    annual_household_income: "",
    motivation_statement:    "",
    referee1_name:           "",
    referee1_email:          "",
    referee2_name:           "",
    referee2_email:          "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.program_slug || !data.scheme) {
      toast.error("Please select a programme and scholarship scheme.");
      return;
    }
    setConfirmOpen(true);
  };

  const finalSubmit = () => {
    setConfirmOpen(false);
    post("/scholarships", {
      onSuccess: () => {
        toast.success("Scholarship application submitted", {
          description: "Our scholarships committee reviews applications monthly. You will hear from us soon.",
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
            <Label htmlFor="sc-name">Full Name</Label>
            <Input id="sc-name" required value={data.full_name} onChange={(e) => setData("full_name", e.target.value)} />
            {errors.full_name && <p className="text-destructive text-xs">{errors.full_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sc-email">Email</Label>
            <Input id="sc-email" type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Programme</Label>
            <Select value={data.program_slug} onValueChange={(v) => setData("program_slug", v)}>
              <SelectTrigger><SelectValue placeholder="Select programme" /></SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.program_slug && <p className="text-destructive text-xs">{errors.program_slug}</p>}
          </div>
          <div className="space-y-2">
            <Label>Scholarship Scheme</Label>
            <Select value={data.scheme} onValueChange={(v) => setData("scheme", v)}>
              <SelectTrigger><SelectValue placeholder="Select scheme" /></SelectTrigger>
              <SelectContent>
                {schemes.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.scheme && <p className="text-destructive text-xs">{errors.scheme}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sc-income">Annual Household Income (GBP)</Label>
          <Input id="sc-income" required value={data.annual_household_income} onChange={(e) => setData("annual_household_income", e.target.value)} placeholder="£" />
          {errors.annual_household_income && <p className="text-destructive text-xs">{errors.annual_household_income}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sc-motivation">Motivation Statement</Label>
          <Textarea id="sc-motivation" required rows={5} value={data.motivation_statement} onChange={(e) => setData("motivation_statement", e.target.value)} placeholder="Tell us why this scholarship matters to your studies and goals (max 500 words)." />
          {errors.motivation_statement && <p className="text-destructive text-xs">{errors.motivation_statement}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">Referee 1</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sc-ref1-name">Name</Label>
              <Input id="sc-ref1-name" required value={data.referee1_name} onChange={(e) => setData("referee1_name", e.target.value)} placeholder="Full name" />
              {errors.referee1_name && <p className="text-destructive text-xs">{errors.referee1_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sc-ref1-email">Email</Label>
              <Input id="sc-ref1-email" type="email" required value={data.referee1_email} onChange={(e) => setData("referee1_email", e.target.value)} placeholder="email@example.com" />
              {errors.referee1_email && <p className="text-destructive text-xs">{errors.referee1_email}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">Referee 2</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sc-ref2-name">Name</Label>
              <Input id="sc-ref2-name" required value={data.referee2_name} onChange={(e) => setData("referee2_name", e.target.value)} placeholder="Full name" />
              {errors.referee2_name && <p className="text-destructive text-xs">{errors.referee2_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sc-ref2-email">Email</Label>
              <Input id="sc-ref2-email" type="email" required value={data.referee2_email} onChange={(e) => setData("referee2_email", e.target.value)} placeholder="email@example.com" />
              {errors.referee2_email && <p className="text-destructive text-xs">{errors.referee2_email}</p>}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={processing} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
          {processing ? "Submitting…" : "Submit Scholarship Application"}
        </Button>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit scholarship application?</AlertDialogTitle>
            <AlertDialogDescription>
              By submitting, you authorise ACM Campus to contact your referees and review your financial information confidentially.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={finalSubmit} disabled={processing}>
              Confirm submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ScholarshipForm;
