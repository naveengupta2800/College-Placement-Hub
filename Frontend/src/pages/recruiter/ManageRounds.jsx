import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Video,
  MapPin,
  Pencil,
  Trash2,
  Clock3,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

import {
  createRound,
  getDriveRounds,
  updateRound,
  deleteRound,
} from "../../services/roundService";

import { getDriveById } from "../../services/driveService";

const ManageRounds = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [drive, setDrive] = useState(null);
  const [rounds, setRounds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingRound, setEditingRound] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    mode: "Online",
    location: "",
    meetingLink: "",
    status: "Scheduled",
  });

  const formatDateTimeLocal = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [driveResponse, roundsResponse] =
        await Promise.all([
          getDriveById(id),
          getDriveRounds(id),
        ]);

      if (driveResponse.success) {
        setDrive(driveResponse.drive);
      }

      if (roundsResponse.success) {
        setRounds(roundsResponse.rounds || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load placement rounds."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      mode: "Online",
      location: "",
      meetingLink: "",
      status: "Scheduled",
    });

    setEditingRound(null);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (round) => {
    setEditingRound(round);

    setFormData({
      name: round.name || "",
      description: round.description || "",
      date: formatDateTimeLocal(round.date),
      mode: round.mode || "Online",
      location: round.location || "",
      meetingLink: round.meetingLink || "",
      status: round.status || "Scheduled",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !formData.name ||
        !formData.date
      ) {
        setError(
          "Round name and date are required."
        );
        setSaving(false);
        return;
      }

      if (
        formData.mode === "Online" &&
        !formData.meetingLink
      ) {
        setError(
          "Meeting link is required for online rounds."
        );
        setSaving(false);
        return;
      }

      if (
        formData.mode === "Offline" &&
        !formData.location
      ) {
        setError(
          "Location is required for offline rounds."
        );
        setSaving(false);
        return;
      }

      const payload = {
        drive: id,
        name: formData.name,
        description: formData.description,
        date: formData.date,
        mode: formData.mode,
        location:
          formData.mode === "Offline"
            ? formData.location
            : "",
        meetingLink:
          formData.mode === "Online"
            ? formData.meetingLink
            : "",
        status: formData.status,
      };

      let response;

      if (editingRound) {
        response = await updateRound(
          editingRound._id,
          payload
        );
      } else {
        response = await createRound(id,payload);
      }

      if (response.success) {
        setShowModal(false);

        resetForm();

        await fetchData();

        setSuccess(
          response.message ||
            (editingRound
              ? "Round updated successfully."
              : "Round created successfully.")
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save placement round."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roundId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this round?"
    );

    if (!confirmed) return;

    try {
      setDeleting(roundId);
      setError("");

      const response = await deleteRound(roundId);

      if (response.success) {
        setRounds((prev) =>
          prev.filter(
            (round) => round._id !== roundId
          )
        );

        setSuccess(
          response.message ||
            "Round deleted successfully."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete round."
      );
    } finally {
      setDeleting(null);
    }
  };

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
      <DashboardLayout
        title="Manage Rounds"
        description="Manage placement rounds"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Manage Rounds"
      description="Create and manage placement rounds"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/recruiter/drives")
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {drive?.jobTitle || "Placement Drive"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage interview and selection rounds.
              </p>
            </div>

          </div>

          <Button onClick={openCreateModal}>
            <Plus size={18} />
            Add Round
          </Button>

        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Drive Info */}
        <Card>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {drive?.jobTitle}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {drive?.package || "Package not specified"}
                {" • "}
                {drive?.openings || 0} openings
              </p>
            </div>

            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400">
                Total Rounds
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {rounds.length}
              </p>
            </div>

          </div>

        </Card>

        {/* Rounds */}
        {rounds.length === 0 ? (
          <Card>

            <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <CalendarDays size={26} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No rounds created
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                Add aptitude, technical, HR or interview
                rounds for this placement drive.
              </p>

              <div className="mt-5">
                <Button onClick={openCreateModal}>
                  <Plus size={17} />
                  Add First Round
                </Button>
              </div>

            </div>

          </Card>
        ) : (
          <div className="space-y-4">

            {rounds.map((round, index) => (

              <Card key={round._id}>

                <div className="flex items-start gap-5">

                  {/* Number */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {index + 1}
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between">

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {round.name}
                        </h3>

                        {round.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {round.description}
                          </p>
                        )}
                      </div>

                      <Badge
                        variant={getStatusVariant(
                          round.status
                        )}
                      >
                        {round.status}
                      </Badge>

                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-5">

                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={17}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Date
                          </p>

                          <p className="mt-0.5 text-sm font-medium text-gray-700">
                            {new Date(
                              round.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3
                          size={17}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs text-gray-400">
                            Time
                          </p>

                          <p className="mt-0.5 text-sm font-medium text-gray-700">
                            {new Date(
                              round.date
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {round.mode === "Online" ? (
                          <Video
                            size={17}
                            className="text-gray-400"
                          />
                        ) : (
                          <MapPin
                            size={17}
                            className="text-gray-400"
                          />
                        )}

                        <div>
                          <p className="text-xs text-gray-400">
                            Mode
                          </p>

                          <p className="mt-0.5 text-sm font-medium text-gray-700">
                            {round.mode}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Location / Meeting */}
                    {(round.location ||
                      round.meetingLink) && (
                      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">

                        {round.mode === "Online" &&
                        round.meetingLink ? (
                          <a
                            href={round.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {round.meetingLink}
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} />
                            {round.location}
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openEditModal(round)
                      }
                    >
                      <Pencil size={15} />
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      disabled={
                        deleting === round._id
                      }
                      onClick={() =>
                        handleDelete(round._id)
                      }
                    >
                      <Trash2 size={15} />
                      Delete
                    </Button>

                  </div>

                </div>

              </Card>

            ))}

          </div>
        )}

      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          editingRound
            ? "Edit Placement Round"
            : "Add Placement Round"
        }
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <Input
            label="Round Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Technical Interview"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what will happen in this round..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <Input
            label="Round Date & Time"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mode
            </label>

            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Online">
                Online
              </option>

              <option value="Offline">
                Offline
              </option>
            </select>
          </div>

          {formData.mode === "Online" ? (
            <Input
              label="Meeting Link"
              name="meetingLink"
              type="url"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
              required
            />
          ) : (
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="College Auditorium / Company Office"
              required
            />
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
            >
              {editingRound ? (
                <>
                  <Pencil size={16} />
                  Update Round
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Round
                </>
              )}
            </Button>

          </div>

        </form>

      </Modal>

    </DashboardLayout>
  );
};

export default ManageRounds;