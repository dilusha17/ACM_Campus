import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  StudentInformationCard,
  StudentPhotoCard,
  type StudentInfoValues,
  type StudentNationality,
} from "@/components/student/StudentInformationCard";

interface DetailRequest {
  token: string;
  first_name: string;
  last_name: string;
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

const StudentDetails = ({ state, request }: { state: State; request: DetailRequest | null }) => {
  const { props } = usePage<{ nationalityOptions: StudentNationality[] }>();
  const nationalities = props.nationalityOptions ?? [];
  const [progress, setProgress] = useState<number | null>(null);

  // Same fields as the admin "Add Verified Student" form. Name and email are
  // pre-filled from the application and can be corrected by the applicant.
  const { data, setData, post, processing, errors } = useForm<StudentInfoValues & { image: File | null }>({
    id_type: "NIC",
    id_number: "",
    first_name: request?.first_name ?? "",
    last_name: request?.last_name ?? "",
    full_name: request?.full_name ?? "",
    email: request?.email ?? "",
    date_of_birth: "",
    nationality_id: "",
    gender: "",
    country_code_id: "",
    phone_country_code: "",
    phone: "",
    address: "",
    image: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.date_of_birth) { toast.error("Please pick your date of birth."); return; }
    if (!data.nationality_id) { toast.error("Please select your nationality."); return; }
    if (!data.gender) { toast.error("Please select your gender."); return; }
    if (!data.country_code_id) { toast.error("Please select your country."); return; }
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
              Congratulations! Please check and complete the details below so we can set up your student profile.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <StudentInformationCard
              data={data}
              setData={(key, value) => setData(key, value)}
              errors={errors}
              nationalities={nationalities}
            >
              <div className="sm:col-span-2">
                <Field label="Programme">
                  <Input
                    value={request.program_title ?? "—"}
                    disabled
                    readOnly
                    className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </Field>
              </div>
            </StudentInformationCard>

            <StudentPhotoCard
              onChange={(file) => setData("image", file)}
              error={errors.image}
              uploadProgress={progress}
            />

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
        </div>
      </Section>
    </Layout>
  );
};

export default StudentDetails;
