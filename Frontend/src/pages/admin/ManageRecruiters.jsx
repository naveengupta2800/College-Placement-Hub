import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getAdminRecruiters } from "../../services/adminService";

const ManageRecruiters = () => {
  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminRecruiters();

      if (response.success) {
        setRecruiters(response.recruiters || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load recruiters."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const getStatus = (recruiter) => {
    return recruiter.isActive === false
      ? "Inactive"
      : "Active";
  };

  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((recruiter) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        recruiter.name
          ?.toLowerCase()
          .includes(searchText) ||
        recruiter.email
          ?.toLowerCase()
          .includes(searchText) ||
        recruiter.company?.companyName
          ?.toLowerCase()
          .includes(searchText);

      const status = getStatus(recruiter);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recruiters, search, statusFilter]);

  const activeCount = recruiters.filter(
    (recruiter) =>
      recruiter.isActive !== false
  ).length;

  const inactiveCount = recruiters.filter(
    (recruiter) =>
      recruiter.isActive === false
  ).length;

  const approvedCompanies = recruiters.filter(
    (recruiter) =>
      recruiter.company?.isApproved === true
  ).length;

  if (loading) {
    return (
      <DashboardLayout
        title="Manage Recruiters"
        description="View and manage recruiter accounts"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Manage Recruiters"
      description="View and manage recruiter accounts"
    >
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recruiters
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monitor recruiter accounts and their companies.
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
              Total Recruiters
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {recruiters.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Active
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {activeCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Inactive
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-600">
              {inactiveCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Approved Companies
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {approvedCompanies}
            </h3>
          </Card>

        </div>

        {/* Search + Filter */}

        <Card padding="p-4">

          <div className="flex items-center gap-4">

            <div className="relative flex-1">

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
                placeholder="Search recruiter, email or company..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex gap-2">

              {["All", "Active", "Inactive"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setStatusFilter(item)
                    }
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      statusFilter === item
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

          </div>

        </Card>

        {/* Recruiters */}

        {filteredRecruiters.length === 0 ? (
          <EmptyState
            icon={<Users size={26} />}
            title="No recruiters found"
            description={
              recruiters.length === 0
                ? "No recruiter accounts are registered yet."
                : "Try changing your search or filter."
            }
          />
        ) : (
          <Card padding="p-0">

            {/* Table Header */}

            <div className="border-b border-gray-100 px-6 py-4">

              <div className="grid grid-cols-[2fr_1.7fr_1.5fr_1fr_1fr_100px] items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-400">

                <span>Recruiter</span>
                <span>Contact</span>
                <span>Company</span>
                <span>Approval</span>
                <span>Status</span>
                <span className="text-right">
                  Action
                </span>

              </div>

            </div>

            {/* Rows */}

            <div className="divide-y divide-gray-100">

              {filteredRecruiters.map(
                (recruiter) => {

                  const status =
                    getStatus(recruiter);

                  const company =
                    recruiter.company;

                  return (
                    <div
                      key={recruiter._id}
                      className="grid grid-cols-[2fr_1.7fr_1.5fr_1fr_1fr_100px] items-center gap-4 px-6 py-5 transition hover:bg-gray-50"
                    >

                      {/* Recruiter */}

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 font-semibold text-purple-600">
                          {recruiter.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "R"}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-gray-900">
                            {recruiter.name ||
                              "Recruiter"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Recruiter Account
                          </p>

                        </div>

                      </div>

                      {/* Contact */}

                      <div className="space-y-1">

                        <div className="flex items-center gap-2 text-xs text-gray-600">

                          <Mail
                            size={13}
                            className="text-gray-400"
                          />

                          <span className="truncate">
                            {recruiter.email}
                          </span>

                        </div>

                        {recruiter.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">

                            <Phone
                              size={13}
                              className="text-gray-400"
                            />

                            {recruiter.phone}

                          </div>
                        )}

                      </div>

                      {/* Company */}

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 size={15} />
                        </div>

                        <span className="truncate text-sm font-medium text-gray-700">
                          {company?.companyName ||
                            "Company not created"}
                        </span>

                      </div>

                      {/* Approval */}

                      <div>

                        {company ? (
                          <Badge
                            variant={
                              company.isApproved
                                ? "success"
                                : "warning"
                            }
                          >
                            {company.isApproved
                              ? "Approved"
                              : "Pending"}
                          </Badge>
                        ) : (
                          <Badge variant="default">
                            Not Available
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
                              <CheckCircle2
                                size={12}
                              />
                            ) : (
                              <XCircle
                                size={12}
                              />
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
                              `/admin/recruiters/${recruiter._id}`
                            )
                          }
                        >
                          <Eye size={15} />
                          View
                        </Button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </Card>
        )}

        {filteredRecruiters.length > 0 && (
          <p className="text-right text-xs text-gray-400">
            Showing {filteredRecruiters.length} of{" "}
            {recruiters.length} recruiters
          </p>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageRecruiters;