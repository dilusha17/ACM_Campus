import { Link } from "@inertiajs/react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 pt-16 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">ACM Campus</h3>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Ashuvedya Complementary Medicine Campus — A UK-based knowledge hub for complementary, integrative & allied health education. Founded 2017.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/about", label: "About" },
                { href: "/programs", label: "Programs" },
                { href: "/admissions", label: "Admissions" },
                { href: "/scholarships", label: "Scholarships" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-3 font-body text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>ACM Campus, 42 Wellington Road, London NW8 9SP, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>+44 20 7946 0123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <span>info@acmcampus.ac.uk</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center font-body text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Ashuvedya Complementary Medicine Campus. 
          Design &amp; Developed by{" "}
          <a
            href="https://www.decreations.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            DE Creations
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
