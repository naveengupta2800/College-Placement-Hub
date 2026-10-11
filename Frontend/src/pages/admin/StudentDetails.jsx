import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import api from "../../services/api";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/students/${id}`
      );

      if (response.data.success) {
        setStudent(response.data.student);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load student details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getResumeUrl = (resume) => {
    if (!resume) return "";

    if (resume.startsWith("http")) {
      return resume;
    }

    return `http://localhost:5000${resume}`;
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Student Details"
        description="View student profile"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout
        title="Student Details"
        description="View student profile"
      >
        <div className="space-y-5">

          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/students")
            }
          >
            <ArrowLeft size={17} />
            Back to Students
          </Button>

          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error || "Student not found."}
          </div>

        </div>
      </DashboardLayout>
    );
  }

  const profile = student.profile || {};

  const resume =
    student.resume || profile.resume;

  const isActive =
    student.isActive !== false;

  return (
    <DashboardLayout
      title="Student Details"
      description="View complete student profile"
    >
      <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between">

          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/students")
            }
          >
            <ArrowLeft size={17} />
            Back to Students
          </Button>

          <Badge
            variant={
              isActive
                ? "success"
                : "danger"
            }
          >
            {isActive ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircle size={13} />
                Inactive
              </span>
            )}
          </Badge>

        </div>

        {/* ================= PROFILE HEADER ================= */}

        <Card>

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
              {student.name
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-bold text-gray-900">
                {student.name || "Student"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {profile.enrollmentNumber ||
                  "Enrollment number not available"}
              </p>

              <div className="mt-3 flex items-center gap-5">

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail
                    size={15}
                    className="text-gray-400"
                  />
                  {student.email}
                </div>

                {student.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone
                      size={15}
                      className="text-gray-400"
                    />
                    {student.phone}
                  </div>
                )}

              </div>

            </div>

            {resume && (
              <Button
                onClick={() =>
                  window.open(
                    getResumeUrl(resume),
                    "_blank"
                  )
                }
              >
                <Download size={17} />
                View Resume
              </Button>
            )}

          </div>

        </Card>

        {/* ================= ACADEMIC OVERVIEW ================= */}

        <div className="grid grid-cols-4 gap-5">

          <Card>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Award size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  CGPA
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {profile.cgpa !== null &&
                  profile.cgpa !== undefined
                    ? Number(profile.cgpa).toFixed(2)
                    : "N/A"}
                </p>
              </div>

            </div>

          </Card>

          <Card>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <GraduationCap size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  10th Percentage
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {profile.tenthPercentage !==
                    null &&
                  profile.tenthPercentage !==
                    undefined
                    ? `${profile.tenthPercentage}%`
                    : "N/A"}
                </p>
              </div>

            </div>

          </Card>

          <Card>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <BookOpen size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  12th Percentage
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {profile.twelfthPercentage !==
                    null &&
                  profile.twelfthPercentage !==
                    undefined
                    ? `${profile.twelfthPercentage}%`
                    : "N/A"}
                </p>
              </div>

            </div>

          </Card>

          <Card>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Passing Year
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {profile.passingYear ||
                    "N/A"}
                </p>
              </div>

            </div>

          </Card>

        </div>

        {/* ================= PERSONAL + ACADEMIC ================= */}

        <div className="grid grid-cols-2 gap-6">

          {/* Personal */}

          <Card>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Personal Information
                </h3>

                <p className="text-xs text-gray-500">
                  Student contact details
                </p>
              </div>

            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {student.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {student.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {student.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Account Created
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDate(
                    student.createdAt
                  )}
                </p>
              </div>

            </div>

          </Card>

          {/* Academic */}

          <Card>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <GraduationCap size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Academic Information
                </h3>

                <p className="text-xs text-gray-500">
                  Student academic profile
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="text-xs text-gray-400">
                  Enrollment Number
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile.enrollmentNumber ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Branch
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile.branch || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  College
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Building2
                    size={14}
                    className="text-gray-400"
                  />
                  {profile.college || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Semester
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile.semester
                    ? `Semester ${profile.semester}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Passing Year
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile.passingYear ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  CGPA
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile.cgpa ??
                    "N/A"}
                </p>
              </div>

            </div>

          </Card>

        </div>

        {/* ================= SCHOOL ACADEMICS ================= */}

        <Card>

          <div className="mb-5">

            <h3 className="font-semibold text-gray-900">
              Academic Performance
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              School and college academic information
            </p>

          </div>

          <div className="grid grid-cols-3 gap-5">

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

              <p className="text-xs text-gray-400">
                10th Percentage
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {profile.tenthPercentage ??
                  "N/A"}
                {profile.tenthPercentage !==
                  null &&
                  profile.tenthPercentage !==
                    undefined &&
                  "%"}
              </p>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

              <p className="text-xs text-gray-400">
                12th Percentage
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {profile.twelfthPercentage ??
                  "N/A"}
                {profile.twelfthPercentage !==
                  null &&
                  profile.twelfthPercentage !==
                    undefined &&
                  "%"}
              </p>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

              <p className="text-xs text-gray-400">
                Current CGPA
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {profile.cgpa ?? "N/A"}
              </p>

            </div>

          </div>

        </Card>

        {/* ================= SKILLS ================= */}

        <Card>

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Award size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Skills
              </h3>

              <p className="text-xs text-gray-500">
                Technical skills listed by the student
              </p>
            </div>

          </div>

          {profile.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">

              {profile.skills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No skills added yet.
            </p>
          )}

        </Card>

        {/* ================= RESUME ================= */}

        <Card>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <FileText size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Resume
                </h3>

                <p className="text-xs text-gray-500">
                  Student uploaded resume
                </p>

              </div>

            </div>

            {resume ? (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    getResumeUrl(resume),
                    "_blank"
                  )
                }
              >
                <FileText size={17} />
                Open Resume
              </Button>
            ) : (
              <Badge variant="default">
                Resume Not Uploaded
              </Badge>
            )}

          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;