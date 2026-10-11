import api from "./api";

export const applyForDrive = async (driveId) => {
  const response = await api.post("/applications/apply", {
    driveId,
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my");
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const getRecruiterApplicants = async () => {
  const response = await api.get("/applications/recruiter");
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId,
  data
) => {
  const response = await api.put(
    `/applications/${applicationId}/status`,
    data
  );
  return response.data;
};

export const getDriveApplicants = async (driveId) => {
  const response = await api.get(
    `/applications/drive/${driveId}`
  );
  return response.data;
};