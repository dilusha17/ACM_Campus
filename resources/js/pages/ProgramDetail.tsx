import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, GraduationCap, Briefcase, BookOpen } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdmissionForm from "@/components/forms/AdmissionForm";
import ScholarshipForm from "@/components/forms/ScholarshipForm";
import type { PublicProgram } from "@/types/program";

const ProgramDetail = () => {
  const { props } = usePage<{ program: PublicProgram | null }>();
  const program = props.program;
  const [admitOpen, setAdmitOpen] = useState(false);
  const [scholarOpen, setScholarOpen] = useState(false);

  if (!program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Programme not found</p>
          <Link href="/programs" className="text-primary underline hover:text-primary/90">
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        {program.image ? (
          <img src={program.image} alt={program.title} className="absolute inset-0 w-full h-full object-cover" width={1280} height={720} />
        ) : (
          <div className="absolute inset-0 bg-gradient-primary" />
        )}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link href="/programs" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground font-body text-sm mb-4 w-fit">
            <ArrowLeft size={16} /> All Programs
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-accent text-accent-foreground border-0">{program.level}</Badge>
              <span className="inline-flex items-center gap-1.5 text-primary-foreground/80 font-body text-sm">
                <Clock size={14} /> {program.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground leading-tight">
              {program.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="text-secondary" size={22} /> Overview
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed text-base">{program.overview}</p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Modules</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {program.modules.map((m) => (
                  <Card key={m} className="shadow-soft">
                    <CardContent className="p-4 font-body text-sm text-foreground">{m}</CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="text-secondary" size={22} /> Career Outcomes
              </h2>
              <div className="flex flex-wrap gap-2">
                {program.careers.map((c) => (
                  <Badge key={c} variant="secondary" className="font-body text-sm py-1.5 px-3">{c}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Entry Requirements</h2>
              <Accordion type="single" collapsible defaultValue="entry">
                <AccordionItem value="entry">
                  <AccordionTrigger className="font-body">Standard requirements</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 font-body text-sm text-muted-foreground">
                      {program.entry.map((e) => (
                        <li key={e} className="flex gap-2"><span className="text-secondary">•</span>{e}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="shadow-card border-border sticky top-32">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-secondary">
                  <GraduationCap size={20} />
                  <span className="font-body font-semibold text-sm">Take the next step</span>
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  Apply for admission or request scholarship support directly from this page.
                </p>

                <Dialog open={admitOpen} onOpenChange={setAdmitOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      Apply for Admission
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Admission Application</DialogTitle>
                      <DialogDescription>{program.title}</DialogDescription>
                    </DialogHeader>
                    <AdmissionForm defaultProgramSlug={program.slug} onSubmitted={() => setAdmitOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={scholarOpen} onOpenChange={setScholarOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">Apply for Scholarship</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Scholarship Application</DialogTitle>
                      <DialogDescription>{program.title}</DialogDescription>
                    </DialogHeader>
                    <ScholarshipForm defaultProgramSlug={program.slug} onSubmitted={() => setScholarOpen(false)} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Section>
    </Layout>
  );
};

export default ProgramDetail;
