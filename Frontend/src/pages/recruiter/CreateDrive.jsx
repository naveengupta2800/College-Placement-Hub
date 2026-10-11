import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { createDrive } from "../../services/driveService";

const CreateDrive = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    skillsRequired: "",
    package: "",
    openings: "",
    location: "",
    employmentType: "Full Time",

    branches: "",
    minimumCGPA: "",
    minimumTenthPercentage: "",
    minimumTwelfthPercentage: "",
    passingYear: "",
    backlogsAllowed: "false",

    applicationDeadline: "",
    driveDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (
        !formData.jobTitle ||
        !formData.jobDescription ||
        !formData.package ||
        !formData.openings ||
        !formData.applicationDeadline ||
        !formData.driveDate
      ) {
        setError("Please fill all required fields.");
        setLoading(false);
        return;
      }

      const payload = {
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        package: formData.package,
        openings: Number(formData.openings),
        location: formData.location,
        employmentType: formData.employmentType,

        eligibility: {
          branches: formData.branches
            .split(",")
            .map((branch) => branch.trim())
            .filter(Boolean),

          minimumCGPA: formData.minimumCGPA
            ? Number(formData.minimumCGPA)
            : 0,

          minimumTenthPercentage: formData.minimumTenthPercentage
            ? Number(formData.minimumTenthPercentage)
            : 0,

          minimumTwelfthPercentage: formData.minimumTwelfthPercentage
            ? Number(formData.minimumTwelfthPercentage)
            : 0,

          passingYear: formData.passingYear
            ? Number(formData.passingYear)
            : null,

          backlogsAllowed: formData.backlogsAllowed === "true",
        },

        applicationDeadline: formData.applicationDeadline,
        driveDate: formData.driveDate,
      };

      const response = await createDrive(id,payload);

      if (response.success) {
        setSuccess(
          response.message ||
            "Placement drive created successfully."
        );

        setTimeout(() => {
          navigate("/recruiter/drives");
        }, 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create placement drive."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Placement Drive"
      description="Create a new job opportunity for eligible students"
    >
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/recruiter/drives")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create Placement Drive
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add job details, eligibility criteria and drive schedule.
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BriefcaseBusiness size={22} />
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= JOB INFORMATION ================= */}

          <Card>
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Job Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Provide the basic details of the job opportunity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

              <Input
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Software Developer"
                required
              />

              <Input
                label="Package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="6 LPA"
                required
              />

              <Input
                label="Number of Openings"
                name="openings"
                type="number"
                value={formData.openings}
                onChange={handleChange}
                placeholder="10"
                required
              />

              <Input
                label="Job Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Indore / Remote"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Internship + Full Time">
                    Internship + Full Time
                  </option>
                </select>
              </div>

              <Input
                label="Required Skills"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, JavaScript"
              />

              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Job Description
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the role, responsibilities and expectations..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </Card>

          {/* ================= ELIGIBILITY ================= */}

          <Card>
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Eligibility Criteria
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Define which students can apply for this drive.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

              <Input
                label="Eligible Branches"
                name="branches"
                value={formData.branches}
                onChange={handleChange}
                placeholder="CSE, IT, ECE"
              />

              <Input
                label="Passing Year"
                name="passingYear"
                type="number"
                value={formData.passingYear}
                onChange={handleChange}
                placeholder="2027"
              />

              <Input
                label="Minimum CGPA"
                name="minimumCGPA"
                type="number"
                value={formData.minimumCGPA}
                onChange={handleChange}
                placeholder="7.0"
              />

              <Input
                label="Minimum 10th Percentage"
                name="minimumTenthPercentage"
                type="number"
                value={formData.minimumTenthPercentage}
                onChange={handleChange}
                placeholder="60"
              />

              <Input
                label="Minimum 12th Percentage"
                name="minimumTwelfthPercentage"
                type="number"
                value={formData.minimumTwelfthPercentage}
                onChange={handleChange}
                placeholder="60"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Backlogs Allowed
                </label>

                <select
                  name="backlogsAllowed"
                  value={formData.backlogsAllowed}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

            </div>
          </Card>

          {/* ================= SCHEDULE ================= */}

          <Card>
            <div className="mb-6 border-b border-gray-100 pb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Drive Schedule
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Set the application deadline and placement drive date.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

              <Input
                label="Application Deadline"
                name="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
              />

              <Input
                label="Drive Date"
                name="driveDate"
                type="datetime-local"
                value={formData.driveDate}
                onChange={handleChange}
                required
              />

            </div>
          </Card>

          {/* ================= ACTIONS ================= */}

          <Card padding="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Ready to submit?
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Your drive will be submitted for admin approval.
                </p>
              </div>

              <div className="flex gap-3">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/recruiter/drives")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                >
                  <Save size={17} />
                  Create Drive
                </Button>

              </div>

            </div>
          </Card>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateDrive;