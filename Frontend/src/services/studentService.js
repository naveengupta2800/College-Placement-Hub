import api from "./api";

// Profile
export const getStudentProfile = async () => {
  const response = await api.get("/student/profile");
  return response.data;
};

export const updateStudentProfile = async (profileData) => {
  const response = await api.put(
    "/student/profile",
    profileData
  );
  return response.data;
};

// Resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post(
    "/student/resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Placement drives
export const getApprovedDrives = async () => {
  const response = await api.get("/drives/approved");
  return response.data;
};

// Applications
export const getMyApplications = async () => {
  const response = await api.get("/applications/my");
  return response.data;
};