import api from "./api";

// Company
export const getRecruiterCompany = async () => {
  const response = await api.get("/recruiter/company");
  return response.data;
};

export const updateRecruiterCompany = async (companyData) => {
  const response = await api.put(
    "/recruiter/company",
    companyData
  );
  return response.data;
};

// Recruiter's drives
export const getRecruiterDrives = async () => {
  const response = await api.get("/drives/recruiter");
  return response.data;
};

// Recruiter applicants
export const getRecruiterApplicants = async () => {
  const response = await api.get(
    "/applications/recruiter"
  );
  return response.data;
};