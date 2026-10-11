import api from "./api";

export const createRound = async (driveId, roundData) => {
  const response = await api.post(
    `/rounds/drive/${driveId}`,
    roundData
  );

  return response.data;
};

export const getDriveRounds = async (driveId) => {
  const response = await api.get(
    `/rounds/drive/${driveId}`
  );

  return response.data;
};

export const getStudentRounds = async () => {
  const response = await api.get(
    "/rounds/student"
  );

  return response.data;
};

export const updateRound = async (roundId, roundData) => {
  const response = await api.put(
    `/rounds/${roundId}`,
    roundData
  );

  return response.data;
};

export const deleteRound = async (roundId) => {
  const response = await api.delete(
    `/rounds/${roundId}`
  );

  return response.data;
};