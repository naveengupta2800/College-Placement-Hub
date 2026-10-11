import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import api from "../../services/api";

const RecruiterRounds = () => {
  const navigate = useNavigate();

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchRounds = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rounds/recruiter");

      if (response.data.success) {
        setRounds(response.data.rounds || []);
      } else {
        setError(response.data.message || "Failed to load rounds");
      }
    } catch (err) {
      console.error("Fetch recruiter rounds error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load placement rounds"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const filteredRounds = useMemo(() => {
    return rounds.filter((round) => {
      const jobTitle =
        round.drive?.jobTitle?.toLowerCase() || "";

      const companyName =
        round.company?.companyName?.toLowerCase() || "";

      const roundName =
        round.name?.toLowerCase() || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        jobTitle.includes(searchText) ||
        companyName.includes(searchText) ||
        roundName.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        round.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rounds, search, statusFilter]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Scheduled":
        return "info";

      case "Completed":
        return "success";

      case "Cancelled":
        return "danger";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Placement Rounds
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all placement rounds for your drives.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <input
              type="text"
              placeholder="Search by company, job role or round..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 md:w-96"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

          </div>
        </Card>

        {/* Rounds */}
        {filteredRounds.length === 0 ? (
          <EmptyState
            title="No placement rounds found"
            description="Create rounds from your placement drive."
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                    <th className="px-4 py-3 font-medium">
                      Round
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Job Role
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Date
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Mode
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRounds.map((round) => (
                    <tr
                      key={round._id}
                      className="border-b border-gray-100 last:border-0"
                    >

                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {round.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {round.company?.companyName ||
                              "Company"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {round.drive?.jobTitle || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {round.date
                          ? new Date(
                              round.date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {round.mode || "-"}
                      </td>

                      <td className="px-4 py-4">
                        <Badge
                          variant={getStatusVariant(
                            round.status
                          )}
                        >
                          {round.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            round.drive?._id &&
                            navigate(
                              `/recruiter/drives/${round.drive._id}/rounds`
                            )
                          }
                        >
                          Manage
                        </Button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default RecruiterRounds;