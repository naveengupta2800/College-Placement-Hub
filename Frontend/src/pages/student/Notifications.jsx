import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  BriefcaseBusiness,
  CalendarDays,
  Info,
  Megaphone,
  XCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setError(
          data.message || "Unable to load notifications"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const diff =
      now.getTime() - notificationDate.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return notificationDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter(
        (notification) => !notification.isRead
      );
    }

    if (filter === "Read") {
      return notifications.filter(
        (notification) => notification.isRead
      );
    }

    return notifications;
  }, [notifications, filter]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update notification"
      );
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      setActionLoading(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark notifications as read"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete notification"
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <BriefcaseBusiness size={19} />
        );

      case "shortlisted":
        return <Clock3 size={19} />;

      case "rejected":
        return <XCircle size={19} />;

      case "selected":
        return <CheckCircle2 size={19} />;

      case "round":
        return <CalendarDays size={19} />;

      case "announcement":
        return <Megaphone size={19} />;

      default:
        return <Info size={19} />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "selected":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
        };

      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
        };

      case "shortlisted":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
        };

      case "round":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
        };

      case "announcement":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
        };
    }
  };

  return (
    <DashboardLayout
      title="Notifications"
      description="Stay updated with your placement activities"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-end justify-between">

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <Badge variant="info">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Application updates, interview rounds and
              placement announcements.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            disabled={
              unreadCount === 0 || actionLoading
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={17} />
            {actionLoading
              ? "Updating..."
              : "Mark all as read"}
          </button>

        </div>

        {/* Filters */}
        <Card padding="p-4">
          <div className="flex items-center gap-2">

            {["All", "Unread", "Read"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              )
            )}

          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchNotifications}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={28} />}
            title={
              filter === "Unread"
                ? "No unread notifications"
                : "No notifications"
            }
            description={
              filter === "Unread"
                ? "You're all caught up."
                : "Placement updates and announcements will appear here."
            }
          />
        ) : (
          <Card padding="p-0">

            <div className="divide-y divide-gray-100">

              {filteredNotifications.map(
                (notification) => {
                  const style =
                    getNotificationStyle(
                      notification.type
                    );

                  return (
                    <div
                      key={notification._id}
                      className={`group flex items-start gap-4 px-6 py-5 transition hover:bg-gray-50 ${
                        !notification.isRead
                          ? "bg-blue-50/30"
                          : "bg-white"
                      }`}
                    >

                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-5">

                          <div>
                            <div className="flex items-center gap-2">

                              <h3
                                className={`text-sm ${
                                  notification.isRead
                                    ? "font-medium text-gray-800"
                                    : "font-semibold text-gray-900"
                                }`}
                              >
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                              )}

                            </div>

                            <p className="mt-1 text-sm leading-6 text-gray-500">
                              {notification.message}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-gray-400">
                            {formatDate(
                              notification.createdAt
                            )}
                          </span>

                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-4">

                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                handleMarkRead(
                                  notification._id
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                              <Check size={14} />
                              Mark as read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                notification._id
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                }
              )}

            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Notifications;