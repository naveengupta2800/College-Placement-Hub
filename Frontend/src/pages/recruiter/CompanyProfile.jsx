import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CheckCircle2,
  Clock3,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";

import {
  getRecruiterCompany,
  updateRecruiterCompany,
} from "../../services/recruiterService";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    location: "",
    description: "",
  });

  const [companyId, setCompanyId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecruiterCompany();

      if (response.success && response.company) {
        const company = response.company;

        setCompanyId(company._id);
        setIsApproved(company.isApproved);

        setFormData({
          companyName: company.companyName || "",
          companyEmail: company.companyEmail || "",
          companyPhone: company.companyPhone || "",
          website: company.website || "",
          location: company.location || "",
          description: company.description || "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load company profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateRecruiterCompany(formData);

      if (response.success) {
        setSuccess(
          response.message || "Company profile updated successfully"
        );

        if (response.company) {
          setCompanyId(response.company._id);
          setIsApproved(response.company.isApproved);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update company profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Company Profile"
        description="Manage your company information"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Company Profile"
      description="Manage your company information and approval status"
    >
      <div className="space-y-6">

        {/* Header Card */}
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Building2 size={32} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formData.companyName || "Your Company"}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    Recruiter company profile
                  </p>
                </div>
              </div>

              <div>
                {isApproved ? (
                  <Badge variant="success">
                    <CheckCircle2 size={14} className="mr-1" />
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <Clock3 size={14} className="mr-1" />
                    Pending Approval
                  </Badge>
                )}
              </div>

            </div>
          </div>

          <div className="grid grid-cols-3 divide-x border-t border-gray-100">
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Company Email
              </p>
              <p className="mt-1 truncate text-sm font-medium text-gray-800">
                {formData.companyEmail || "Not provided"}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Location
              </p>
              <p className="mt-1 truncate text-sm font-medium text-gray-800">
                {formData.location || "Not provided"}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Profile Status
              </p>

              <div className="mt-1">
                {isApproved ? (
                  <span className="text-sm font-semibold text-emerald-600">
                    Verified by Admin
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-amber-600">
                    Waiting for Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

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

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <Card>

            <div className="mb-7 border-b border-gray-100 pb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Company Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Keep your company information accurate for students and
                placement administrators.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* Company Name */}
              <Input
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />

              {/* Company Email */}
              <Input
                label="Company Email"
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="hr@company.com"
                required
              />

              {/* Phone */}
              <Input
                label="Company Phone"
                name="companyPhone"
                type="tel"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />

              {/* Website */}
              <Input
                label="Company Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
              />

              {/* Location */}
              <div className="col-span-2">
                <Input
                  label="Company Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Indore, Madhya Pradesh"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Company Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell students about your company, culture, products and opportunities..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  This information may be visible to students when they view
                  your placement drives.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">

              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isApproved ? (
                  <>
                    <CheckCircle2
                      size={17}
                      className="text-emerald-500"
                    />
                    Company profile is approved
                  </>
                ) : (
                  <>
                    <Clock3
                      size={17}
                      className="text-amber-500"
                    />
                    Profile is awaiting admin approval
                  </>
                )}
              </div>

              <Button
                type="submit"
                loading={saving}
              >
                <Save size={17} />
                Save Changes
              </Button>

            </div>

          </Card>
        </form>

        {/* Company Information Tips */}
        <Card>
          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Profile Information
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Make sure your company name, email, website and location are
                correct before creating placement drives. Students will use
                this information to understand the recruiting organization.
              </p>
            </div>

          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;