import { Link } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { ChevronLeft } from "lucide-react";
import VerifiedStudentForm, {
  AvailableCertificate,
  VerifiedStudentNationality,
  VerifiedStudentProgram,
} from "@/components/admin/VerifiedStudentForm";

const Create = ({
  nationalities,
  programs,
  next_student_id,
  available_certificates,
}: {
  nationalities: VerifiedStudentNationality[];
  programs: VerifiedStudentProgram[];
  next_student_id: string;
  available_certificates: Record<string, AvailableCertificate[]>;
}) => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Verified Student</h1>
            <p className="text-gray-400 text-sm mt-0.5">Enter the student's details below</p>
          </div>
        </div>

        <VerifiedStudentForm
          nationalities={nationalities}
          programs={programs}
          nextStudentId={next_student_id}
          availableCertificates={available_certificates}
          submitUrl="/admin/students"
          submitLabel="Add Student"
          submittingLabel="Saving..."
          cancelHref="/admin/students"
        />
      </div>
    </AdminLayout>
  );
};

export default Create;
