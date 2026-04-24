import { motion } from "framer-motion";
import { Award, HandCoins, Globe2, FlaskConical, CalendarCheck, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ScholarshipForm from "@/components/forms/ScholarshipForm";

const schemes = [
  { icon: Award, name: "Merit Scholarship", desc: "Awarded to applicants with outstanding academic results.", value: "Up to 50% tuition", deadline: "31 May" },
  { icon: HandCoins, name: "Need-based Bursary", desc: "Financial support for applicants from lower-income households.", value: "Up to 40% tuition", deadline: "30 June" },
  { icon: Globe2, name: "International Scholar Award", desc: "Supporting talented international students joining ACM in the UK.", value: "Up to 30% tuition", deadline: "15 July" },
  { icon: FlaskConical, name: "Research Excellence Grant", desc: "For postgraduate research applicants in complementary medicine.", value: "Stipend + fee waiver", deadline: "30 April" },
];

const eligibility = [
  "Conditional or unconditional offer from ACM Campus",
  "Demonstrated academic, personal or professional achievement",
  "For need-based: verified household income below national threshold",
  "Two academic or professional references",
];

const Scholarships = () => {
  return (
    <Layout>
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground border-0 mb-5">Funding your future</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Scholarships at ACM Campus</h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Talent should never be limited by circumstance. Our scholarship and bursary programmes support outstanding learners from across the UK and around the world.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid sm:grid-cols-2 gap-6">
          {schemes.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-border shadow-soft hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <s.icon className="text-secondary" size={22} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">{s.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <Separator />
                  <div className="flex items-center justify-between text-xs font-body">
                    <span className="text-secondary font-semibold">{s.value}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><CalendarCheck size={14} /> {s.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-mint">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Eligibility</h2>
            <p className="font-body text-muted-foreground mb-6">A transparent, fair process. All applications are reviewed by our scholarships committee.</p>
            <ul className="space-y-3">
              {eligibility.map((e) => (
                <li key={e} className="flex items-start gap-3 font-body text-sm text-foreground">
                  <ShieldCheck className="text-secondary mt-0.5 shrink-0" size={18} />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="shadow-card border-border">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">Scholarship Application</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Complete the dedicated scholarship application below.
              </p>
              <ScholarshipForm />
            </CardContent>
          </Card>
        </div>
      </Section>
    </Layout>
  );
};

export default Scholarships;
