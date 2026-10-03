import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageCropper } from "@/components/ui/image-cropper";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryIdOptions, type CountryCode } from "@/lib/countryCodes";

interface DetailRequest {
  token: string;
  full_name: string;
  email: string;
  program_title: string | null;
  expires_at: string;
}

type State = "open" | "submitted" | "expired" | "invalid";

const messages: Record<Exclude<State, "open">, { icon: typeof CheckCircle2; title: string; body: string }> = {
  submitted: {
    icon: CheckCircle2,
    title: "Thank you — details received",
    body: "Your student details have been submitted. Our team will review them, create your student profile and email you your Student ID.",
  },
  expired: {
    icon: Clock,
    title: "This link has expired",
    body: "Please contact info@acmcampus.uk and we will send you a new link.",
  },
  invalid: {
    icon: AlertCircle,
    title: "This link is not valid",
    body: "Please check the link in your email, or contact info@acmcampus.uk for help.",
  },
};

const formatDate = (value: Date | undefined) => {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDate = (value: string) => (value ? new Date(value + "T00:00:00") : undefined);

const StudentDetails = ({ state, request }: { state: State; request: DetailRequest | null }) => {
  const { props } = usePage<{
    countryCodes: CountryCode[];
    nationalityOptions: { id: number; name: string }[];
  }>();
  const countryOptions = countryIdOptions(props.countryCodes ?? []);
  const nationalityOptions = (props.nationalityOptions ?? []).map((n) => ({ value: String(n.id), label: n.name }));
  const [progress, setProgress] = useState<number | null>(null);

  const { data, setData, post, processing, errors } = useForm<{
    id_type: string;
    id_number: string;
    date_of_birth: string;
    nationality_id: string;
    gender: string;
    country_code_id: string;
    phone: string;
    address: string;
    image: File | null;
  }>({
    id_type: "NIC",
    id_number: "",
    date_of_birth: "",
    nationality_id: "",
    gender: "",
    country_code_id: "",
    phone: "",
    address: "",
    image: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.nationality_id) { toast.error("Please select your nationality."); return; }
    if (!data.country_code_id) { toast.error("Please select your country."); return; }
    if (!data.gender) { toast.error("Please select your gender."); return; }
    if (!data.date_of_birth) { toast.error("Please pick your date of birth."); return; }
    if (!data.image) { toast.error("Please upload your photo (under 5 MB)."); return; }

    setProgress(0);
    post(`/student-details/${request?.token}`, {
      forceFormData: true,
      onProgress: (p) => setProgress(p?.percentage ?? 0),
      onError: (errs) => toast.error(Object.values(errs)[0] ?? "Something went wrong. Please try again."),
      onFinish: () => setProgress(null),
    });
  };

  if (state !== "open" || !request) {
    const { icon: Icon, title, body } = messages[state === "open" ? "invalid" : state];
    return (
      <Layout>
        <Section className="bg-gradient-mint">
          <div className="max-w-xl mx-auto text-center">
            <Card className="shadow-card border-border">
              <CardContent className="p-8 space-y-4">
                <Icon className="mx-auto text-secondary" size={44} />
                <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
                <p className="font-body text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          </div>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section className="bg-gradient-mint">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">Complete Your Student Details</h1>
            <p className="font-body text-muted-foreground">
              Congratulations! Please provide the remaining details so we can set up your student profile.
            </p>
          </div>

          <Card className="shadow-card border-border mb-6">
            <CardContent className="p-6 grid sm:grid-cols-3 gap-4 text-sm font-body">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium text-foreground">{request.full_name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground break-all">{request.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Programme</p>
                <p className="font-medium text-foreground">{request.program_title ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-[10rem_1fr] gap-4">
                  <div className="space-y-2">
                    <Label>ID Type <span className="text-red-500">*</span></Label>
                    <Select value={data.id_type} onValueChange={(v) => setData("id_type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIC">NIC</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sd-id">{data.id_type === "NIC" ? "NIC Number" : "Passport Number"} <span className="text-red-500">*</span></Label>
                    <Input
                      id="sd-id"
                      required
                      maxLength={20}
                      value={data.id_number}
                      onChange={(e) => setData("id_number", e.target.value)}
                      placeholder={data.id_type === "NIC" ? "e.g. 199012345678" : "e.g. N1234567"}
                    />
                    {errors.id_number && <p className="text-destructive text-xs">{errors.id_number}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <DatePicker
                      value={parseDate(data.date_of_birth)}
                      onChange={(value) => setData("date_of_birth", formatDate(value))}
                      placeholder="Pick date of birth"
                    />
                    {errors.date_of_birth && <p className="text-destructive text-xs">{errors.date_of_birth}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender <span className="text-red-500">*</span></Label>
                    <Select value={data.gender} onValueChange={(v) => setData("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select gender..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="not_stated">Prefer Not to Say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-destructive text-xs">{errors.gender}</p>}
                  </div>
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
                    <Label htmlFor="sd-phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="sd-phone"
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
                  <Label htmlFor="sd-address">Home Address <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="sd-address"
                    required
                    rows={3}
                    maxLength={500}
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    placeholder="Full postal address"
                  />
                  {errors.address && <p className="text-destructive text-xs">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Your Photo <span className="text-red-500">*</span></Label>
                  <p className="text-xs text-muted-foreground">Clear passport-style photo. JPEG, PNG or WebP, under 5 MB.</p>
                  <ImageCropper aspectRatio={1} maxSizeMb={5} onChange={(file) => setData("image", file)} label="" />
                  {errors.image && <p className="text-destructive text-xs">{errors.image}</p>}
                  {progress !== null && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {processing ? "Submitting…" : "Submit Details"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This link can only be used once and is valid until {request.expires_at}.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </Section>
    </Layout>
  );
};

export default StudentDetails;
