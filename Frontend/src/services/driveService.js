import api from "./api";

// Get all approved drives - Student
export const getApprovedDrives = async () => {
  const response = await api.get("/drives/approved");
  return response.data;
};

// Get single drive
export const getDriveById = async (id) => {
  const response = await api.get(`/drives/${id}`);
  return response.data;
};

// Recruiter drives
export const getRecruiterDrives = async () => {
  const response = await api.get("/drives/recruiter");
  return response.data;
};

// Create drive
export const createDrive = async (driveData) => {
  const response = await api.post(
    "/drives",
    driveData
  );
  return response.data;
};

// Update drive
export const updateDrive = async (id, driveData) => {
  const response = await api.put(
    `/drives/${id}`,
    driveData
  );
  return response.data;
};