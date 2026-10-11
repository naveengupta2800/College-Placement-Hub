import api from "./api";

// =====================================
// ADMIN DASHBOARD
// =====================================

export const getAdminDashboard = async () => {
  const response = await api.get(
    "/admin/dashboard"
  );

  return response.data;
};

// =====================================
// COMPANIES
// =====================================

export const getPendingCompanies = async () => {
  const response = await api.get(
    "/admin/companies/pending"
  );

  return response.data;
};

export const updateCompanyApproval = async (
  companyId,
  approvalData
) => {
  const response = await api.put(
    `/admin/companies/${companyId}/approval`,
    approvalData
  );

  return response.data;
};

// =====================================
// PLACEMENT DRIVES
// =====================================

export const getPendingDrives = async () => {
  const response = await api.get(
    "/admin/drives/pending"
  );

  return response.data;
};

export const updateDriveApproval = async (
  driveId,
  approvalData
) => {
  const response = await api.put(
    `/admin/drives/${driveId}/approval`,
    approvalData
  );

  return response.data;
};

// =====================================
// STUDENTS
// =====================================

export const getAdminStudents = async () => {
  const response = await api.get(
    "/admin/students"
  );

  return response.data;
};

export const getAdminStudentById = async (
  studentId
) => {
  const response = await api.get(
    `/admin/students/${studentId}`
  );

  return response.data;
};

// =====================================
// RECRUITERS
// =====================================

export const getAdminRecruiters = async () => {
  const response = await api.get(
    "/admin/recruiters"
  );

  return response.data;
};

// =====================================
// RECRUITER DETAILS
// =====================================

export const getAdminRecruiterById = async (
  recruiterId
) => {
  const response = await api.get(
    `/admin/recruiters/${recruiterId}`
  );

  return response.data;
};

// =====================================
// APPLICATIONS
// =====================================

export const getAdminApplications = async () => {
  const response = await api.get(
    "/admin/applications"
  );

  return response.data;
};

// =====================================
// ANNOUNCEMENTS
// =====================================

export const createAnnouncement = async (
  announcementData
) => {
  const response = await api.post(
    "/admin/announcements",
    announcementData
  );

  return response.data;
};