import { motion } from "framer-motion";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "", email: "", subject: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/contact", {
      onSuccess: () => {
        toast.success("Message sent", { description: "Thank you — our team will reply within 2–3 working days." });
        reset();
      },
      onError: () => toast.error("Something went wrong. Please try again."),
    });
  };

  return (
    <Layout>
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Contact Us</h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Questions about admissions, scholarships or the campus? Our team in London is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Send us a Message</h2>
            <Card className="border-border shadow-soft">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="ct-name">Full Name</Label>
                      <Input id="ct-name" required value={data.name} onChange={(e) => setData("name", e.target.value)} placeholder="Your name" />
                      {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ct-email">Email</Label>
                      <Input id="ct-email" type="email" required value={data.email} onChange={(e) => setData("email", e.target.value)} placeholder="you@email.com" />
                      {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ct-subject">Subject</Label>
                    <Input id="ct-subject" required value={data.subject} onChange={(e) => setData("subject", e.target.value)} placeholder="How can we help?" />
                    {errors.subject && <p className="text-destructive text-xs">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ct-message">Message</Label>
                    <Textarea id="ct-message" required rows={5} value={data.message} onChange={(e) => setData("message", e.target.value)} placeholder="Tell us more…" />
                    {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                  </div>
                  <Button type="submit" disabled={processing} className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2">
                    {processing ? "Sending…" : <><span>Send Message</span><Send size={16} /></>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Get in Touch</h2>
            {[
              { icon: MapPin, label: "Address", value: "ACM Campus, 42 Wellington Road, London NW8 9SP, United Kingdom" },
              { icon: Phone, label: "Phone", value: "+44 20 7946 0123" },
              { icon: Mail, label: "Email", value: "info@acmcampus.ac.uk" },
            ].map((item) => (
              <Card key={item.label} className="border-border shadow-soft">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="text-secondary" size={18} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground font-medium mb-1">{item.label}</p>
                    <p className="font-body text-sm text-foreground font-medium leading-relaxed">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-2">
              <p className="font-body text-sm font-medium text-foreground mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social link" className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-secondary/10 hover:border-secondary/30 transition-colors">
                    <Icon className="text-foreground" size={18} />
                  </a>
                ))}
              </div>
            </div>

            <Card className="border-border shadow-soft">
              <CardContent className="p-0 h-48 flex items-center justify-center bg-gradient-mint rounded-lg">
                <div className="text-center">
                  <MapPin className="text-secondary mx-auto mb-2" size={32} />
                  <p className="font-body text-sm text-foreground font-medium">London, United Kingdom</p>
                  <p className="font-body text-xs text-muted-foreground">Map preview</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Contact;
