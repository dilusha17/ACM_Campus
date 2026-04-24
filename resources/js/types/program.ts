export type ProgramLevel = "Degree" | "Diploma" | "Certificate";

export interface ProgramOption {
  slug: string;
  title: string;
  level: ProgramLevel;
}

export interface PublicProgram extends ProgramOption {
  duration: string;
  short: string;
  overview: string;
  image: string | null;
  modules: string[];
  careers: string[];
  entry: string[];
}