import { motion } from "framer-motion";
import { FileCheck, ClipboardList, UserCheck, GraduationCap, ChevronRight, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import AdmissionForm from "@/components/forms/AdmissionForm";

const requirements = [
  "Completed secondary education (A-Levels or equivalent)",
  "Minimum grade requirements vary by programme",
  "English language proficiency (IELTS 5.5+ or equivalent)",
  "Valid identification and academic transcripts",
  "Health clearance certificate where required",
  "Two references (academic or professional)",
];

const steps = [
  { icon: ClipboardList, title: "Submit Application", desc: "Complete the online application form with your personal and academic details." },
  { icon: FileCheck, title: "Upload Documents", desc: "Provide transcripts, certificates, ID and reference letters." },
  { icon: UserCheck, title: "Interview", desc: "Attend an online or in-person interview with the admissions panel." },
  { icon: GraduationCap, title: "Enrolment", desc: "Receive your offer letter and complete registration." },
];

const pathwaySteps = ["Certificate", "Diploma", "Degree", "Master's", "PhD"];

const Admissions = () => {
  return (
    <Layout>
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Admissions</h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Begin your journey at ACM Campus, London. Our admissions process is transparent, supportive and designed to recognise potential.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <h2 className="text-3xl font-display font-bold text-foreground mb-8">Entry Requirements</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {requirements.map((req, i) => (
            <motion.div
              key={req}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 bg-gradient-mint rounded-2xl p-5 border border-border"
            >
              <CheckCircle className="text-secondary shrink-0 mt-0.5" size={18} />
              <span className="font-body text-sm text-foreground">{req}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-mint">
        <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">Application Process</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="text-center h-full border-border shadow-soft">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="text-secondary" size={24} />
                  </div>
                  <div className="text-xs font-body font-semibold text-secondary mb-2">Step {i + 1}</div>
                  <h3 className="font-display font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Pathway */}
      <Section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Academic Pathway</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Progress through structured levels of academic achievement.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
          {pathwaySteps.map((step, i) => (
            <div key={step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center shadow-soft ${
                  i === pathwaySteps.length - 1 ? "bg-gradient-primary text-primary-foreground" : "bg-card border border-border"
                }`}
              >
                <span className={`text-xs font-body font-medium mb-1 ${i === pathwaySteps.length - 1 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Level {i + 1}</span>
                <span className={`font-display font-bold text-sm ${i === pathwaySteps.length - 1 ? "text-primary-foreground" : "text-foreground"}`}>{step}</span>
              </motion.div>
              {i < pathwaySteps.length - 1 && <ChevronRight className="text-secondary mx-2 hidden md:block" size={20} />}
            </div>
          ))}
        </div>
      </Section>

      {/* Application Form */}
      <Section className="bg-gradient-mint">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Start Your Application</h2>
            <p className="font-body text-muted-foreground">Complete the form below — our admissions team will respond within 5 working days.</p>
          </div>
          <Card className="shadow-card border-border">
            <CardContent className="p-6 md:p-8">
              <AdmissionForm />
            </CardContent>
          </Card>
        </div>
      </Section>
    </Layout>
  );
};

export default Admissions;
