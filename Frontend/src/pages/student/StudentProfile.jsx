import { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Save,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} from "../../services/studentService";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    enrollmentNumber: "",
    college: "",
    branch: "",
    semester: "",
    passingYear: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    skills: "",
  });

  const [resume, setResume] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentProfile();

      if (data.success) {
        const p = data.profile || {};

        setProfile({
          enrollmentNumber: p.enrollmentNumber || "",
          college: p.college || "",
          branch: p.branch || "",
          semester: p.semester ?? "",
          passingYear: p.passingYear ?? "",
          cgpa: p.cgpa ?? "",
          tenthPercentage: p.tenthPercentage ?? "",
          twelfthPercentage: p.twelfthPercentage ?? "",
          skills: Array.isArray(p.skills)
            ? p.skills.join(", ")
            : "",
        });

        setResume(p.resume || "");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...profile,
        semester: profile.semester
          ? Number(profile.semester)
          : null,
        passingYear: profile.passingYear
          ? Number(profile.passingYear)
          : null,
        cgpa: profile.cgpa
          ? Number(profile.cgpa)
          : null,
        tenthPercentage: profile.tenthPercentage
          ? Number(profile.tenthPercentage)
          : null,
        twelfthPercentage: profile.twelfthPercentage
          ? Number(profile.twelfthPercentage)
          : null,
        skills: profile.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const data = await updateStudentProfile(payload);

      if (data.success) {
        setSuccess("Profile updated successfully.");
      } else {
        setError(data.message || "Unable to update profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadResume(selectedFile);

      if (data.success) {
        setResume(data.resume || "");
        setSelectedFile(null);
        setSuccess("Resume uploaded successfully.");
      } else {
        setError(data.message || "Resume upload failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Profile"
        description="Manage your academic and personal information"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Profile"
      description="Manage your academic and personal information"
    >
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Messages */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* Personal / Academic Profile */}
        <form onSubmit={handleSave}>
          <Card>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Academic Profile
                </h2>

                <p className="text-sm text-gray-500">
                  Keep your information updated for placement eligibility.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5">

              <Input
                label="Enrollment Number"
                name="enrollmentNumber"
                value={profile.enrollmentNumber}
                onChange={handleChange}
                placeholder="Enter enrollment number"
              />

              <Input
                label="College"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />

              <Input
                label="Branch"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />

              <Input
                label="Semester"
                name="semester"
                type="number"
                value={profile.semester}
                onChange={handleChange}
                placeholder="e.g. 6"
              />

              <Input
                label="Passing Year"
                name="passingYear"
                type="number"
                value={profile.passingYear}
                onChange={handleChange}
                placeholder="e.g. 2027"
              />

              <Input
                label="CGPA"
                name="cgpa"
                type="number"
                step="0.01"
                value={profile.cgpa}
                onChange={handleChange}
                placeholder="e.g. 7.50"
              />

              <Input
                label="10th Percentage"
                name="tenthPercentage"
                type="number"
                step="0.01"
                value={profile.tenthPercentage}
                onChange={handleChange}
                placeholder="e.g. 80.50"
              />

              <Input
                label="12th Percentage"
                name="twelfthPercentage"
                type="number"
                step="0.01"
                value={profile.twelfthPercentage}
                onChange={handleChange}
                placeholder="e.g. 82.00"
              />

              <div className="col-span-2">
                <Input
                  label="Skills"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, C++, DSA"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Separate multiple skills using commas.
                </p>
              </div>

            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
              <Button
                type="submit"
                loading={saving}
              >
                <Save size={17} />
                Save Profile
              </Button>
            </div>

          </Card>
        </form>

        {/* Resume */}
        <Card>

          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Resume
              </h2>

              <p className="text-sm text-gray-500">
                Upload your latest resume for recruiters.
              </p>
            </div>
          </div>

          <div className="mt-6">

            {resume && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600">
                    <FileText size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Resume uploaded
                    </p>

                    <p className="text-xs text-gray-500">
                      Your resume is available to recruiters.
                    </p>
                  </div>
                </div>

                <a
                  href={
                    resume.startsWith("http")
                      ? resume
                      : `http://localhost:5000${resume}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            )}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-blue-400 hover:bg-blue-50/30">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Upload size={22} />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                Choose your resume
              </p>

              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC or DOCX · Maximum 5MB
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] || null)
                }
              />
            </label>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <Button
                  size="sm"
                  loading={uploading}
                  onClick={handleResumeUpload}
                >
                  <Upload size={15} />
                  Upload Resume
                </Button>

              </div>
            )}

          </div>
        </Card>

        {/* Placement reminder */}
        <Card className="border-blue-100 bg-blue-50/50">

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <GraduationCap size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Keep your profile updated
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Your CGPA, academic details, branch, passing year
                and resume are used when checking placement-drive
                eligibility.
              </p>
            </div>
          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;