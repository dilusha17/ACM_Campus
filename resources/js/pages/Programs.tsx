import { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import Section from "@/components/Section";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicProgram, ProgramLevel } from "@/types/program";

type Filter = "All" | ProgramLevel;

const Programs = () => {
  const { props } = usePage<{ programs: PublicProgram[] }>();
  const programs = props.programs ?? [];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      const matchLevel = filter === "All" || p.level === filter;
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.short.toLowerCase().includes(q);
      return matchLevel && matchQuery;
    });
  }, [query, filter]);

  return (
    <Layout>
      <section className="bg-gradient-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Programs</h1>
            <p className="font-body text-lg text-primary-foreground/80 leading-relaxed">
              Search and explore our full catalogue of degrees, diplomas and certificates in complementary, traditional and allied health sciences.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programmes (e.g. ayurveda, physiotherapy)…"
              className="pl-10 h-12 rounded-full"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="rounded-full h-12 p-1">
              {["All", "Degree", "Diploma", "Certificate"].map((t) => (
                <TabsTrigger key={t} value={t} className="rounded-full px-5">{t}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center font-body text-muted-foreground">
              No programmes match your search. Try a different keyword or filter.
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="overflow-hidden h-full flex flex-col border-border shadow-soft hover:shadow-card-hover transition-all group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        width={1280}
                        height={720}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-mint" />
                    )}
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border-0 shadow-soft">{p.level}</Badge>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 font-body">
                      <Clock size={13} /> {p.duration}
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-snug">{p.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.short}</p>
                    <Button asChild variant="ghost" className="justify-start px-0 text-secondary hover:text-secondary hover:bg-transparent">
                      <Link href={`/programs/${p.slug}`}>
                        View details <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </Layout>
  );
};

export default Programs;
