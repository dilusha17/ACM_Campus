import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { BookOpen, Award, Globe, Users, Handshake, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const partners = [
  "University of Westminster",
  "Middlesex University London",
  "College of Medicine UK",
  "WHO Collaborating Centre",
  "European Federation for Complementary & Alternative Medicine",
  "Royal Society of Medicine",
];

const About = () => {
  return (
    <Layout>
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground border-0 mb-5">London, United Kingdom</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About ACM Campus</h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Established in London in 2017, ACM Campus is dedicated to building the next generation of healthcare professionals through a unique blend of traditional medicine wisdom and modern scientific approaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <Card className="border-border shadow-soft">
            <CardContent className="p-8 md:p-10 space-y-5">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-secondary" size={24} />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Our Vision</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                To be the world's leading institution in complementary and integrative medicine education, producing graduates who are clinically competent, research-oriented and ethically grounded in holistic healthcare.
              </p>
              <ul className="space-y-3 font-body text-sm text-muted-foreground">
                {["Global recognition in complementary medicine", "Research-driven academic excellence", "Ethical holistic healthcare practices"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border shadow-soft">
            <CardContent className="p-8 md:p-10 space-y-5">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center">
                <Award className="text-accent" size={24} />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Our Mission</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                To provide accessible, high-quality education that integrates global traditional medicine systems with modern allied health sciences, fostering innovation and improving community health worldwide.
              </p>
              <ul className="space-y-3 font-body text-sm text-muted-foreground">
                {["Accessible quality education for all", "Integration of traditional and modern medicine", "Global community health impact"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* UK Partners */}
      <Section className="bg-gradient-mint">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Handshake className="text-secondary" size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">UK & International Partners</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            We collaborate with leading UK institutions and global bodies to deliver world-class education.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-border shadow-soft h-full">
                <CardContent className="p-5 flex items-center gap-3">
                  <Globe className="text-secondary shrink-0" size={20} />
                  <span className="font-body text-sm font-medium text-foreground">{partner}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Conference & Scholarships */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-10 text-primary-foreground">
            <Users className="mb-4" size={32} />
            <h3 className="text-2xl font-display font-bold mb-3">Annual Conference</h3>
            <p className="font-body text-primary-foreground/80 leading-relaxed">
              Our annual London conference brings together researchers, practitioners and academics from across the globe to share knowledge in complementary and integrative medicine.
            </p>
          </div>
          <Card className="shadow-card border-border">
            <CardContent className="p-8 md:p-10">
              <GraduationCap className="text-accent mb-4" size={32} />
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">Scholarship Programmes</h3>
              <p className="font-body text-muted-foreground leading-relaxed mb-5">
                Merit-based and need-based scholarships are available for UK and international students. Financial barriers should never prevent access to quality education.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/scholarships">Explore Scholarships <ArrowRight size={16} /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Verify a past student */}
      <Section>
        <Card className="max-w-3xl mx-auto shadow-card border-border">
          <CardContent className="p-8 md:p-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-secondary" size={26} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold text-foreground mb-1">Verify a past student</h3>
              <p className="font-body text-sm text-muted-foreground">
                Confirm the authenticity of qualifications awarded by ACM Campus through our official credential lookup.
              </p>
            </div>
            <Button asChild className="gap-2 shrink-0">
              <Link href="/verify">Open Verification <ArrowRight size={16} /></Link>
            </Button>
          </CardContent>
        </Card>
      </Section>
    </Layout>
  );
};

export default About;
