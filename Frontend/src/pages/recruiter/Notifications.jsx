import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  BriefcaseBusiness,
  UserCheck,
  UserX,
  Trophy,
  CalendarDays,
  Info,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
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
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const handleMarkRead = async (notificationId) => {
    try {
      setActionLoading(notificationId);

      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
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
          err.message ||
          "Failed to update notification."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading("all");

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
          err.message ||
          "Failed to mark notifications as read."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      setActionLoading(notificationId);

      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete notification."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return <BriefcaseBusiness size={20} />;

      case "shortlisted":
        return <UserCheck size={20} />;

      case "rejected":
        return <UserX size={20} />;

      case "selected":
        return <Trophy size={20} />;

      case "round":
        return <CalendarDays size={20} />;

      case "announcement":
        return <Bell size={20} />;

      default:
        return <Info size={20} />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "shortlisted":
      case "selected":
        return "bg-emerald-50 text-emerald-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "round":
        return "bg-purple-50 text-purple-600";

      case "application":
        return "bg-blue-50 text-blue-600";

      case "announcement":
        return "bg-amber-50 text-amber-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Notifications"
        description="Stay updated with placement activities"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Notifications"
      description="Stay updated with placement activities"
    >
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Application, round and placement updates.
              </p>
            </div>

          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={actionLoading === "all"}
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={16} />
              Mark All as Read
            </Button>
          )}

        </div>

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="grid grid-cols-3 gap-5">

          <Card>
            <p className="text-sm text-gray-500">
              Total Notifications
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {notifications.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Unread
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {unreadCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Read
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {notifications.length - unreadCount}
            </h3>
          </Card>

        </div>

        {/* Filters */}

        <Card padding="p-4">

          <div className="flex gap-2">

            {["All", "Unread", "Read"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item}

                  {item === "Unread" &&
                    unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        {unreadCount}
                      </span>
                    )}
                </button>
              )
            )}

          </div>

        </Card>

        {/* Notifications */}

        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={26} />}
            title="No notifications"
            description={
              filter === "Unread"
                ? "You don't have any unread notifications."
                : "You're all caught up. New updates will appear here."
            }
          />
        ) : (
          <div className="space-y-3">

            {filteredNotifications.map(
              (notification) => (

                <Card
                  key={notification._id}
                  className={`transition duration-200 hover:shadow-md ${
                    !notification.isRead
                      ? "border-blue-200 bg-blue-50/30"
                      : ""
                  }`}
                >

                  <div className="flex items-start gap-4">

                    {/* Icon */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getNotificationStyle(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="flex items-center gap-2">

                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>

                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-blue-600" />
                            )}

                          </div>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            {notification.message}
                          </p>

                        </div>

                        <Badge
                          variant={
                            notification.isRead
                              ? "default"
                              : "info"
                          }
                        >
                          {notification.isRead
                            ? "Read"
                            : "New"}
                        </Badge>

                      </div>

                      {/* Footer */}

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

                        <p className="text-xs text-gray-400">
                          {formatDate(
                            notification.createdAt
                          )}
                        </p>

                        <div className="flex gap-2">

                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                actionLoading ===
                                notification._id
                              }
                              onClick={() =>
                                handleMarkRead(
                                  notification._id
                                )
                              }
                            >
                              <CheckCheck size={15} />
                              Mark Read
                            </Button>
                          )}

                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={
                              actionLoading ===
                              notification._id
                            }
                            onClick={() =>
                              handleDelete(
                                notification._id
                              )
                            }
                          >
                            <Trash2 size={15} />
                            Delete
                          </Button>

                        </div>

                      </div>

                    </div>

                  </div>

                </Card>

              )
            )}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Notifications;
