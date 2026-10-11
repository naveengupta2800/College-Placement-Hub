import api from "./api";

// Get notifications
export const getNotifications = async () => {
  const response = await api.get(
    "/notifications"
  );

  return response.data;
};

// Mark one as read
export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

// Mark all as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.put(
    "/notifications/read-all"
  );

  return response.data;
};

// Delete notification
export const deleteNotification = async (
  notificationId
) => {
  const response = await api.delete(
    `/notifications/${notificationId}`
  );

  return response.data;
};