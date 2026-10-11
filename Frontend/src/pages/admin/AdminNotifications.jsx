import { useState } from "react";
import {
  Megaphone,
  Users,
  UserRound,
  Building2,
  Send,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import {
  createAnnouncement,
} from "../../services/adminService";

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !form.title.trim() ||
      !form.message.trim()
    ) {
      setError(
        "Please enter title and message."
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await createAnnouncement(form);

      if (data.success) {
        setSuccess(
          `Announcement sent successfully to ${data.count} users.`
        );

        setForm({
          title: "",
          message: "",
          audience: "all",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send announcement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Notifications"
      description="Send announcements to students and recruiters"
    >
      <div className="grid grid-cols-3 gap-6">

        {/* ================= FORM ================= */}

        <div className="col-span-2">
          <Card>

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Megaphone size={23} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Announcement
                </h2>

                <p className="text-sm text-gray-500">
                  Send an important announcement to users.
                </p>
              </div>

            </div>

            {success && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Title */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Announcement Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. TCS Placement Drive"
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Audience */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Send To
                </label>

                <select
                  name="audience"
                  value={form.audience}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
                >
                  <option value="all">
                    All Students & Recruiters
                  </option>

                  <option value="student">
                    Students Only
                  </option>

                  <option value="recruiter">
                    Recruiters Only
                  </option>
                </select>
              </div>

              {/* Message */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Write your announcement here..."
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Submit */}

              <div className="flex justify-end">

                <Button
                  type="submit"
                  disabled={loading}
                >
                  <Send size={17} />

                  {loading
                    ? "Sending..."
                    : "Send Announcement"}
                </Button>

              </div>

            </form>

          </Card>
        </div>

        {/* ================= INFO ================= */}

        <div className="space-y-6">

          <Card>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Users size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Audience
                </h3>

                <p className="text-xs text-gray-500">
                  Choose who receives it
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Users
                  size={17}
                  className="text-blue-500"
                />

                <span className="text-sm text-gray-700">
                  All Users
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <UserRound
                  size={17}
                  className="text-green-500"
                />

                <span className="text-sm text-gray-700">
                  Students
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Building2
                  size={17}
                  className="text-purple-500"
                />

                <span className="text-sm text-gray-700">
                  Recruiters
                </span>
              </div>

            </div>

          </Card>

          <Card>

            <div className="rounded-xl bg-blue-50 p-5">

              <Megaphone
                size={24}
                className="text-blue-600"
              />

              <h3 className="mt-3 font-semibold text-blue-900">
                Important
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                Announcements will appear in the
                notification section of the selected
                users.
              </p>

            </div>

          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminNotifications;