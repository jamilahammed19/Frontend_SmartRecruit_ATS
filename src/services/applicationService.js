import api from "./api";

const BASE_URL = "applications/";

export const getMyApplications = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

// Removed the resumeFile parameter and switched back to a simple JSON object
export const applyForJob = async (jobId, coverLetter) => {
  const response = await api.post(BASE_URL, {
    job: jobId,
    cover_letter: coverLetter,
  });
  return response.data;
};

export const getAllApplications = async () => {
  // Because the backend checks the user's role, this same endpoint
  // automatically returns ALL applications for HR users!
  const response = await api.get(BASE_URL);
  return response.data;
};

export const updateApplicationStatus = async (id, newStatus) => {
  // PATCH request to only update the status field
  const response = await api.patch(`${BASE_URL}${id}/`, {
    status: newStatus,
  });
  return response.data;
};


export const deleteApplication = async (id) => {
    // We do NOT use response.data here because DELETE returns an empty response
    const response = await api.delete(`${BASE_URL}${id}/`);
    return response;
};