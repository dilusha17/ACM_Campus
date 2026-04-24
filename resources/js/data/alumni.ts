export type Alumnus = {
  studentId: string;
  fullName: string;
  programme: string;
  level: "Certificate" | "Diploma" | "Degree" | "Master" | "PhD";
  graduationYear: number;
  certificateId: string;
  status: "Verified" | "Revoked";
};

export const alumni: Alumnus[] = [
  {
    studentId: "ACM-2019-0087",
    fullName: "Aisha Khan",
    programme: "BSc (Hons) Complementary Medicine",
    level: "Degree",
    graduationYear: 2022,
    certificateId: "ACM-CERT-2022-A087",
    status: "Verified",
  },
  {
    studentId: "ACM-2020-0143",
    fullName: "James O'Connor",
    programme: "Diploma in Traditional Chinese Medicine",
    level: "Diploma",
    graduationYear: 2022,
    certificateId: "ACM-CERT-2022-D143",
    status: "Verified",
  },
  {
    studentId: "ACM-2018-0042",
    fullName: "Priya Raman",
    programme: "MSc Integrative Healthcare",
    level: "Master",
    graduationYear: 2021,
    certificateId: "ACM-CERT-2021-M042",
    status: "Verified",
  },
  {
    studentId: "ACM-2021-0211",
    fullName: "Daniel Müller",
    programme: "Certificate in Medical Herbalism",
    level: "Certificate",
    graduationYear: 2022,
    certificateId: "ACM-CERT-2022-C211",
    status: "Verified",
  },
  {
    studentId: "ACM-2017-0019",
    fullName: "Sofia Bianchi",
    programme: "PhD Complementary Medicine Research",
    level: "PhD",
    graduationYear: 2023,
    certificateId: "ACM-CERT-2023-P019",
    status: "Verified",
  },
  {
    studentId: "ACM-2020-0188",
    fullName: "Mohammed Al-Hassan",
    programme: "BSc (Hons) Allied Health Sciences",
    level: "Degree",
    graduationYear: 2023,
    certificateId: "ACM-CERT-2023-A188",
    status: "Verified",
  },
  {
    studentId: "ACM-2019-0102",
    fullName: "Emily Thompson",
    programme: "Diploma in Ayurvedic Studies",
    level: "Diploma",
    graduationYear: 2021,
    certificateId: "ACM-CERT-2021-D102",
    status: "Verified",
  },
  {
    studentId: "ACM-2021-0142",
    fullName: "Liam Chen",
    programme: "Certificate in Clinical Nutrition",
    level: "Certificate",
    graduationYear: 2022,
    certificateId: "ACM-CERT-2022-C142",
    status: "Revoked",
  },
];

export function findAlumnus(studentId: string, fullName?: string): Alumnus | null {
  const id = studentId.trim().toUpperCase();
  if (!id) return null;
  const match = alumni.find((a) => a.studentId.toUpperCase() === id);
  if (!match) return null;
  if (fullName && fullName.trim().length > 0) {
    if (match.fullName.toLowerCase() !== fullName.trim().toLowerCase()) {
      return null;
    }
  }
  return match;
}
