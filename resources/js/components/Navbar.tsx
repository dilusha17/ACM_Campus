import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const logo = "/assets/logo-landscape.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { url } = usePage();
  const pathname = url.split("?")[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between h-20 md:h-24 px-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="ACM Campus"
            className="h-12 md:h-[5rem] w-auto transition-all"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-secondary ${
                pathname === link.href ? "text-secondary" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admissions"
            className="bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-sm font-semibold hover:opacity-90 transition-opacity shadow-soft"
          >
            Apply Now
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-body text-base py-2 transition-colors ${
                    pathname === link.href ? "text-secondary font-semibold" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admissions"
                onClick={() => setOpen(false)}
                className="bg-gradient-primary text-primary-foreground px-5 py-3 rounded-full font-body text-sm font-semibold text-center mt-2"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
