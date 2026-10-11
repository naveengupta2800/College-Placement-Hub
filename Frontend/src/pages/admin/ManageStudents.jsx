import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  UserCheck,
  UserX,
  FileText,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

const ManageStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Admin student endpoint.
       * If your backend route is different,
       * only this URL needs to be changed.
       */
      const response = await api.get("/admin/students");

      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const branches = useMemo(() => {
    const values = students
      .map((student) => student.profile?.branch)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [students]);

  const passingYears = useMemo(() => {
    const values = students
      .map((student) => student.profile?.passingYear)
      .filter(Boolean)
      .sort();

    return ["All", ...new Set(values)];
  }, [students]);

  const getStudentStatus = (student) => {
    return student.isActive === false
      ? "Inactive"
      : "Active";
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        student.name
          ?.toLowerCase()
          .includes(searchText) ||
        student.email
          ?.toLowerCase()
          .includes(searchText) ||
        student.profile?.enrollmentNumber
          ?.toLowerCase()
          .includes(searchText);

      const matchesBranch =
        branchFilter === "All" ||
        student.profile?.branch === branchFilter;

      const matchesYear =
        yearFilter === "All" ||
        String(student.profile?.passingYear) ===
          String(yearFilter);

      const matchesStatus =
        statusFilter === "All" ||
        getStudentStatus(student) === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesYear &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    branchFilter,
    yearFilter,
    statusFilter,
  ]);

  const activeCount = students.filter(
    (student) => student.isActive !== false
  ).length;

  const inactiveCount = students.filter(
    (student) => student.isActive === false
  ).length;

  const resumeCount = students.filter(
    (student) =>
      student.resume ||
      student.profile?.resume
  ).length;

  const formatCgpa = (cgpa) => {
    if (cgpa === null || cgpa === undefined) {
      return "N/A";
    }

    return Number(cgpa).toFixed(2);
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Manage Students"
        description="View and manage registered students"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Manage Students"
      description="View and manage registered students"
    >
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monitor student profiles and placement readiness.
            </p>
          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="grid grid-cols-4 gap-5">

          <Card>
            <p className="text-sm text-gray-500">
              Total Students
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {students.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Active Students
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {activeCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Inactive Students
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-600">
              {inactiveCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Resumes Uploaded
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {resumeCount}
            </h3>
          </Card>

        </div>

        {/* Filters */}

        <Card padding="p-4">

          <div className="grid grid-cols-4 gap-4">

            {/* Search */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Branch */}

            <select
              value={branchFilter}
              onChange={(e) =>
                setBranchFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {branches.map((branch) => (
                <option
                  key={branch}
                  value={branch}
                >
                  {branch === "All"
                    ? "All Branches"
                    : branch}
                </option>
              ))}
            </select>

            {/* Passing Year */}

            <select
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {passingYears.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year === "All"
                    ? "All Passing Years"
                    : year}
                </option>
              ))}
            </select>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

        </Card>

        {/* Student List */}

        {filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Users size={26} />}
            title="No students found"
            description={
              students.length === 0
                ? "No students are registered yet."
                : "Try changing your search or filters."
            }
          />
        ) : (
          <Card padding="p-0">

            {/* Table Header */}

            <div className="border-b border-gray-100 px-6 py-4">

              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_120px] items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-400">

                <span>Student</span>
                <span>Academic</span>
                <span>CGPA</span>
                <span>Passing Year</span>
                <span>Resume</span>
                <span>Status</span>
                <span className="text-right">
                  Action
                </span>

              </div>

            </div>

            {/* Rows */}

            <div className="divide-y divide-gray-100">

              {filteredStudents.map((student) => {

                const profile =
                  student.profile || {};

                const status =
                  getStudentStatus(student);

                const resume =
                  student.resume ||
                  profile.resume;

                return (
                  <div
                    key={student._id}
                    className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_120px] items-center gap-4 px-6 py-5 transition hover:bg-gray-50"
                  >

                    {/* Student */}

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                        {student.name
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {student.name ||
                            "Student"}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                          <Mail size={12} />

                          <span className="truncate">
                            {student.email}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Academic */}

                    <div>

                      <p className="text-sm font-medium text-gray-800">
                        {profile.branch ||
                          "Branch not set"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {profile.enrollmentNumber ||
                          "Enrollment not set"}
                      </p>

                    </div>

                    {/* CGPA */}

                    <div className="flex items-center gap-2">

                      <GraduationCap
                        size={15}
                        className="text-gray-400"
                      />

                      <span className="text-sm font-semibold text-gray-800">
                        {formatCgpa(
                          profile.cgpa
                        )}
                      </span>

                    </div>

                    {/* Passing Year */}

                    <div className="flex items-center gap-2 text-sm text-gray-600">

                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />

                      {profile.passingYear ||
                        "N/A"}

                    </div>

                    {/* Resume */}

                    <div>

                      {resume ? (
                        <Badge variant="success">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            Uploaded
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          Not Uploaded
                        </Badge>
                      )}

                    </div>

                    {/* Status */}

                    <div>

                      <Badge
                        variant={
                          status === "Active"
                            ? "success"
                            : "danger"
                        }
                      >
                        <span className="flex items-center gap-1">

                          {status === "Active" ? (
                            <UserCheck size={12} />
                          ) : (
                            <UserX size={12} />
                          )}

                          {status}

                        </span>
                      </Badge>

                    </div>

                    {/* Action */}

                    <div className="flex justify-end">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/admin/students/${student._id}`
                          )
                        }
                      >
                        <Eye size={15} />
                        View
                      </Button>

                    </div>

                  </div>
                );
              })}

            </div>

          </Card>
        )}

        {/* Result Count */}

        {filteredStudents.length > 0 && (
          <p className="text-right text-xs text-gray-400">
            Showing {filteredStudents.length} of{" "}
            {students.length} students
          </p>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageStudents;