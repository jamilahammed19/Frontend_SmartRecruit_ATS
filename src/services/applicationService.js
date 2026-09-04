import api from "./api";

const BASE_URL = "applications/";

export const getMyApplications = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const applyForJob = async (jobId, coverLetter) => {
  const response = await api.post(BASE_URL, {
    job: jobId,
    cover_letter: coverLetter,
  });
  return response.data;
};

export const getAllApplications = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const updateApplicationStatus = async (id, newStatus) => {
  const response = await api.patch(`${BASE_URL}${id}/`, {
    status: newStatus,
  });
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`${BASE_URL}${id}/`);
  return response;
};

export const runAiScoring = async (applicationId) => {
  const response = await api.post(
    `applications/${applicationId}/run_ai_scoring/`,
  );
  return response.data;
};
