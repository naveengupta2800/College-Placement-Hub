import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
  Mail,
  Phone,
  Clock3,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  getPendingCompanies,
  updateCompanyApproval,
} from "../../services/adminService";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // =====================================
  // FETCH COMPANIES
  // =====================================

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPendingCompanies();

      if (response.success) {
        setCompanies(response.companies || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // =====================================
  // COMPANY STATUS
  // =====================================

  const getCompanyStatus = (company) => {
    if (company.isApproved) {
      return "Approved";
    }

    return "Pending";
  };

  // =====================================
  // FILTER COMPANIES
  // =====================================

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        company.companyName
          ?.toLowerCase()
          .includes(searchText) ||
        company.companyEmail
          ?.toLowerCase()
          .includes(searchText) ||
        company.location
          ?.toLowerCase()
          .includes(searchText);

      const status = getCompanyStatus(company);

      const matchesFilter =
        filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [companies, search, filter]);

  // =====================================
  // APPROVE / REJECT COMPANY
  // =====================================

  const handleApproval = async (companyId, isApproved) => {
    try {
      setActionLoading(companyId);
      setError("");

      const response = await updateCompanyApproval(
        companyId,
        {
          status: isApproved
            ? "approved"
            : "rejected",
        }
      );

      if (response.success) {
        setCompanies((prev) =>
          prev.map((company) =>
            company._id === companyId
              ? {
                  ...company,
                  isApproved,
                }
              : company
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update company status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <DashboardLayout
        title="Manage Companies"
        description="Review and manage recruiter companies"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  // =====================================
  // STATS
  // =====================================

  const pendingCount = companies.filter(
    (company) => !company.isApproved
  ).length;

  const approvedCount = companies.filter(
    (company) => company.isApproved
  ).length;

  // =====================================
  // UI
  // =====================================

  return (
    <DashboardLayout
      title="Manage Companies"
      description="Review and manage recruiter companies"
    >
      <div className="space-y-6">

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Companies
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review recruiter company registrations.
              </p>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">

          <Card>
            <p className="text-sm text-gray-500">
              Total Companies
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {companies.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Pending Review
            </p>

            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {pendingCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Approved
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {approvedCount}
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
                placeholder="Search company, email or location..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex gap-2">

              {["All", "Pending", "Approved"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      filter === item
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

        {/* Companies */}
        {filteredCompanies.length === 0 ? (
          <EmptyState
            icon={<Building2 size={26} />}
            title="No companies found"
            description={
              companies.length === 0
                ? "There are no companies available for review."
                : "Try changing your search or filter."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-6">

            {filteredCompanies.map((company) => {
              const status = getCompanyStatus(company);

              return (
                <Card
                  key={company._id}
                  className="transition duration-200 hover:shadow-md"
                >

                  {/* Company Header */}
                  <div className="flex items-start justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.companyName}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <Building2 size={22} />
                        )}

                      </div>

                      <div>

                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.companyName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Recruiter Company
                        </p>

                      </div>

                    </div>

                    <Badge
                      variant={
                        status === "Approved"
                          ? "success"
                          : "warning"
                      }
                    >
                      {status}
                    </Badge>

                  </div>

                  {/* Company Info */}
                  <div className="mt-6 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-gray-600">

                      <Mail
                        size={16}
                        className="text-gray-400"
                      />

                      <span>
                        {company.companyEmail ||
                          "Email not provided"}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">

                      <Phone
                        size={16}
                        className="text-gray-400"
                      />

                      <span>
                        {company.companyPhone ||
                          "Phone not provided"}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">

                      <MapPin
                        size={16}
                        className="text-gray-400"
                      />

                      <span>
                        {company.location ||
                          "Location not provided"}
                      </span>

                    </div>

                    {company.website && (
                      <div className="flex items-center gap-3 text-sm text-blue-600">

                        <Globe size={16} />

                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate hover:underline"
                        >
                          {company.website}
                        </a>

                      </div>
                    )}

                  </div>

                  {/* Description */}
                  {company.description && (
                    <div className="mt-5 rounded-lg bg-gray-50 p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Description
                      </p>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                        {company.description}
                      </p>

                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">

                    {!company.isApproved ? (
                      <>
                        {/* Reject */}
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={
                            actionLoading === company._id
                          }
                          onClick={() =>
                            handleApproval(
                              company._id,
                              false
                            )
                          }
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>

                        {/* Approve */}
                        <Button
                          variant="success"
                          size="sm"
                          disabled={
                            actionLoading === company._id
                          }
                          onClick={() =>
                            handleApproval(
                              company._id,
                              true
                            )
                          }
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </Button>
                      </>
                    ) : (
                      /* Revoke Approval */
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          actionLoading === company._id
                        }
                        onClick={() =>
                          handleApproval(
                            company._id,
                            false
                          )
                        }
                      >
                        <XCircle size={16} />
                        Revoke Approval
                      </Button>
                    )}

                  </div>

                </Card>
              );
            })}

          </div>
        )}

        {/* Pending Notice */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">

            <Clock3
              size={20}
              className="text-amber-600"
            />

            <div>

              <p className="text-sm font-semibold text-amber-800">
                {pendingCount} company
                {pendingCount > 1 ? "ies" : ""} awaiting review
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Review company details before approving
                their placement activities.
              </p>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageCompanies;