import { useState } from "react";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  FileText,
  AlertCircle,
  Info,
  CheckCircle2,
  GraduationCap,
  PauseCircle,
} from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Certificate {
  certificate_number: string;
  issue_date: string;
  level: string;
  status: string;
}

interface ProgramEnrollment {
  program_slug: string;
  status: "active" | "graduated" | "suspended";
  enrollment_date: string | null;
  graduation_date: string | null;
  suspended_date: string | null;
  certificate: Certificate | null;
}

interface VerifyResult {
  student_id: string;
  full_name: string;
  image_path: string | null;
  programs: ProgramEnrollment[];
}

interface Props {
  result: VerifyResult | null;
  searched: boolean;
  query?: { student_id?: string };
}

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  graduated: {
    label: "Graduated",
    icon: GraduationCap,
    cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  suspended: {
    label: "Suspended",
    icon: PauseCircle,
    cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

const levelFromSlug = (slug: string): string => {
  if (slug.startsWith("bsc-") || slug === "bsc") return "Degree (BSc)";
  if (slug.startsWith("diploma-")) return "Diploma";
  if (slug.startsWith("certificate-")) return "Certificate";
  if (slug.startsWith("master-") || slug.startsWith("msc-"))
    return "Master's";
  if (slug.startsWith("phd-")) return "PhD";
  return "Degree";
};

const monthYearOf = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  return dateStr.slice(0, 7);
};

const Verify = ({ result, searched, query }: Props) => {
  const [studentId, setStudentId] = useState(query?.student_id ?? "");
  const [privacyOpen, setPrivacyOpen] = useState(!searched);
  const [openCertSlug, setOpenCertSlug] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    router.post("/verify", {
      student_id: studentId.trim(),
    });
  };

  const handleReset = () => {
    setStudentId("");
    router.get("/verify");
  };

  return (
    <Layout>
      {/* Privacy notice */}
      <AlertDialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display flex items-center gap-2">
              <ShieldCheck className="text-secondary" size={20} />
              Privacy Notice
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body leading-relaxed">
              This lookup tool is provided solely for the verification of
              academic credentials issued by ACM Campus. Information returned is
              limited to what is necessary to confirm authenticity. By
              continuing, you confirm that you are using this service for
              legitimate verification purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>I understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hero */}
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-xs font-body mb-5">
              <ShieldCheck size={14} /> Official Credential Verification
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Verify Student Credentials
            </h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Confirm the authenticity of qualifications awarded by ACM Campus.
              Enter the Student ID printed on the certificate to retrieve
              verified academic records.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search panel */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Look up a student
              </CardTitle>
              <CardDescription className="font-body">
                Enter the Student ID to verify credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="font-body">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    placeholder="e.g. ACM-2021-0142"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="gap-2">
                    <Search size={16} /> Verify
                  </Button>
                  {searched && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    >
                      Clear
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="ml-auto text-xs font-body text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Info size={12} /> Privacy notice
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mt-8">
            {!searched && (
              <Card className="bg-muted/40 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="font-body text-sm text-muted-foreground">
                    Enter a Student ID above to verify credentials.
                  </p>
                </CardContent>
              </Card>
            )}

            {searched && !result && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-display">No record found</AlertTitle>
                <AlertDescription className="font-body">
                  We could not locate a matching student. Please double-check
                  the Student ID (and name, if provided) and try again.
                </AlertDescription>
              </Alert>
            )}

            {searched && result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="shadow-card border-border overflow-hidden">
                  <div className="bg-gradient-primary h-2" />
                  <CardContent className="pt-6">
                    {/* Student header */}
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="shrink-0 self-start">
                        {result.image_path ? (
                          <img
                            src={`/${result.image_path}`}
                            alt={result.full_name}
                            className="w-[7.5rem] h-[7.5rem] rounded-full object-cover ring-2 ring-border"
                          />
                        ) : (
                          <div className="w-[7.5rem] h-[7.5rem] rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-display text-3xl font-bold">
                            {result.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-display font-bold text-foreground">{result.full_name}</h3>
                        <p className="font-mono text-sm text-muted-foreground mt-0.5">{result.student_id}</p>

                        <Separator className="my-4" />

                        {/* Programme enrollments */}
                        <div className="space-y-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Programme Enrollments ({result.programs.length})
                          </p>
                          {result.programs.map((prog, i) => {
                            const cfg = statusConfig[prog.status] ?? statusConfig.active;
                            const StatusIcon = cfg.icon;
                            const certKey = `${prog.program_slug}-${i}`;
                            return (
                              <div key={certKey} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-semibold text-foreground text-sm">
                                    {prog.program_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </p>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
                                    <StatusIcon size={11} />
                                    {cfg.label}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body">
                                  <div>
                                    <p className="text-muted-foreground uppercase tracking-wide mb-0.5">Level</p>
                                    <Badge variant="secondary" className="text-xs">
                                      {prog.certificate?.level ?? levelFromSlug(prog.program_slug)}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground uppercase tracking-wide mb-0.5">Enrolled</p>
                                    <p className="font-medium text-foreground">{monthYearOf(prog.enrollment_date) ?? "—"}</p>
                                  </div>
                                  {prog.status === "graduated" && prog.graduation_date && (
                                    <div>
                                      <p className="text-muted-foreground uppercase tracking-wide mb-0.5">Graduated</p>
                                      <p className="font-medium text-foreground">{monthYearOf(prog.graduation_date)}</p>
                                    </div>
                                  )}
                                  {prog.status === "suspended" && prog.suspended_date && (
                                    <div>
                                      <p className="text-muted-foreground uppercase tracking-wide mb-0.5">Suspended</p>
                                      <p className="font-medium text-foreground">{monthYearOf(prog.suspended_date)}</p>
                                    </div>
                                  )}
                                </div>

                                {prog.status === "graduated" && prog.certificate && prog.certificate.status === "active" && (
                                  <div className="pt-1">
                                    <Dialog open={openCertSlug === certKey} onOpenChange={(o) => setOpenCertSlug(o ? certKey : null)}>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                                          <FileText size={13} /> View Certificate
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle className="font-display">Certificate Preview</DialogTitle>
                                          <DialogDescription className="font-body">Stylised representation of the issued credential.</DialogDescription>
                                        </DialogHeader>
                                        <div className="border-2 border-secondary/30 rounded-lg p-8 bg-gradient-to-br from-background to-muted/40 text-center space-y-4">
                                          <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">ACM Campus · United Kingdom</p>
                                          <h4 className="font-display text-2xl font-bold text-foreground">Certificate of Award</h4>
                                          <p className="font-body text-sm text-muted-foreground">This is to certify that</p>
                                          <p className="font-display text-3xl font-bold text-primary">{result.full_name}</p>
                                          <p className="font-body text-sm text-muted-foreground">has successfully completed the programme of</p>
                                          <p className="font-display text-xl font-semibold text-foreground">
                                            {prog.program_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                          </p>
                                          <p className="font-body text-sm text-muted-foreground">
                                            {prog.certificate.level} — Awarded{" "}
                                            {monthYearOf(prog.certificate.issue_date)}
                                          </p>
                                          <Separator className="my-4" />
                                          <div className="flex justify-between text-xs font-mono text-muted-foreground">
                                            <span>ID: {result.student_id}</span>
                                            <span>Cert: {prog.certificate.certificate_number}</span>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Verify;
