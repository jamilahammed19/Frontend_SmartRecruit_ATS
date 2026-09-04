import api from "./api";

const PROFILE_URL = "candidate/profile/";

const DOCS_URL = "candidate/documents/";
const AI_PROCESS_URL = "candidate/ai-process-documents/";

export const getDocuments = async () => {
  const response = await api.get(DOCS_URL);
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(DOCS_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`${DOCS_URL}${id}/`);
  return response.data;
};

export const processDocumentsWithAi = async () => {
  const response = await api.post(AI_PROCESS_URL);
  return response.data;
};

export const updatePersonalInfo = async (data) => {
  const response = await api.patch(`${PROFILE_URL}personal_info/`, data);
  return response.data;
};

export const updatePresentAddress = async (data) => {
  const response = await api.patch(`${PROFILE_URL}present_address/`, data);
  return response.data;
};

export const addEducation = async (data) => {
  const response = await api.post(`${PROFILE_URL}educations/`, data);
  return response.data;
};

export const addEmployment = async (data) => {
  const response = await api.post(`${PROFILE_URL}employments/`, data);
  return response.data;
};

export const addSkill = async (data) => {
  const response = await api.post(`${PROFILE_URL}skills/`, data);
  return response.data;
};
