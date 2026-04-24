import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { GraduationCap, Globe, HeartPulse, Microscope, Award, Users, ArrowRight, ChevronRight, Landmark } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const heroCampus = "/assets/hero-campus.png";

const programs = [
  { icon: HeartPulse, title: "Complementary Medicine", desc: "Ayurveda, acupuncture, naturopathy and traditional healing systems." },
  { icon: Microscope, title: "Para Medicine", desc: "Medical laboratory sciences, diagnostics, physiotherapy and allied health." },
  { icon: Globe, title: "Global Traditional Medicine", desc: "Unani, Siddha, Chinese medicine and indigenous practices." },
  { icon: GraduationCap, title: "Allied Health Sciences", desc: "Nutrition, public health and modern healthcare management." },
];

const pathwaySteps = ["Certificate", "Diploma", "Degree", "Master's", "PhD"];

const milestones = [
  { year: "2017", title: "Founded in London", desc: "ACM Campus is established in London with a mission to bridge traditional medicine and modern science." },
  { year: "2019", title: "First UK partnerships", desc: "Academic collaborations launched with leading UK universities and the College of Medicine." },
  { year: "2021", title: "International scholar programme", desc: "Scholarships introduced to welcome talented students from across Europe, Asia and Africa." },
  { year: "2023", title: "Research centre opens", desc: "ACM Research Centre established to advance evidence-based complementary medicine." },
  { year: "2025", title: "Global accreditation", desc: "Programmes recognised across multiple jurisdictions through international academic partnerships." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroCampus} alt="ACM Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-accent/20 text-accent backdrop-blur-sm px-4 py-1.5 rounded-full font-body text-sm font-medium mb-6"
            >
              Founded 2017 · United Kingdom
            </motion.span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.05] mb-6">
              A UK Knowledge Hub for Complementary & Integrative Medicine
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl leading-relaxed">
              Empowering future healthcare leaders through evidence-based complementary medicine education, research and clinical excellence — from London to the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/admissions" className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base hover:opacity-90 transition-opacity text-center">
                Apply for Admission
              </Link>
              <Link href="/programs" className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-body font-semibold text-base hover:bg-primary-foreground/10 transition-colors text-center">
                Explore Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campus History */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
              A campus built on heritage and evidence
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Since opening our doors in London in 2017, ACM Campus has been dedicated to elevating complementary and integrative medicine education to the highest academic standards. We honour traditional wisdom while embracing modern scientific inquiry.
            </p>
          </div>
          <div className="lg:col-span-2 relative">
            <div className="absolute left-4 md:left-6 top-2 bottom-2 w-px bg-border hidden sm:block" aria-hidden />
            <ol className="space-y-5">
              {milestones.map((m, i) => (
                <motion.li
                  key={m.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative pl-0 sm:pl-16"
                >
                  <div className="hidden sm:flex absolute left-0 top-2 w-12 h-12 rounded-full bg-background border border-border shadow-soft items-center justify-center">
                    <Landmark className="text-secondary" size={18} />
                  </div>
                  <Card className="border-border shadow-soft">
                    <CardContent className="p-5">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-display text-xl font-bold text-secondary">{m.year}</span>
                        <h3 className="font-display font-semibold text-foreground">{m.title}</h3>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Academic Pathway */}
      <Section className="bg-gradient-mint">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Academic Pathway</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">A structured academic journey from foundation to expertise.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {pathwaySteps.map((step, i) => (
            <div key={step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`w-36 h-36 rounded-2xl flex flex-col items-center justify-center shadow-soft transition-all hover:shadow-card-hover ${
                  i === pathwaySteps.length - 1 ? "bg-gradient-primary text-primary-foreground" : "bg-background border border-border"
                }`}
              >
                <span className={`text-xs font-body font-medium mb-1 ${i === pathwaySteps.length - 1 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Level {i + 1}</span>
                <span className={`font-display font-bold text-base ${i === pathwaySteps.length - 1 ? "text-primary-foreground" : "text-foreground"}`}>{step}</span>
              </motion.div>
              {i < pathwaySteps.length - 1 && <ChevronRight className="text-secondary mx-2 hidden md:block" size={24} />}
            </div>
          ))}
        </div>
      </Section>

      {/* Featured Programs */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Areas of Study</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Explore our four core academic schools — each bridging tradition and modern healthcare.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-border shadow-soft hover:shadow-card-hover transition-all hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-secondary/10 group-hover:bg-secondary/20 rounded-2xl flex items-center justify-center mb-5 transition-colors">
                    <prog.icon className="text-secondary" size={26} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{prog.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{prog.desc}</p>
                  <Link href="/programs" className="inline-flex items-center gap-1 text-secondary font-body text-sm font-semibold group-hover:gap-2 transition-all">
                    Browse programmes <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Conference & Scholarship */}
      <Section className="bg-gradient-mint">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-primary rounded-3xl p-8 md:p-10 text-primary-foreground">
            <Users className="mb-4" size={32} />
            <h3 className="text-2xl font-display font-bold mb-3">International Conferences</h3>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-6">
              Join our annual London conference on complementary and integrative medicine, featuring world-renowned speakers, research presentations and global networking.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-body font-semibold text-sm hover:opacity-90 transition-opacity">
              Learn More <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
            <Award className="text-accent mb-4" size={32} />
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">Scholarships Available</h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Merit-based, need-based, international and research scholarships are available to outstanding students worldwide.
            </p>
            <Link href="/scholarships" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-full font-body font-semibold text-sm hover:opacity-90 transition-opacity">
              View Scholarships <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </Section>
    </Layout>
  );
};

export default Index;
