import api from "./api";

export const getProfile = async () => {
  const response = await api.get("candidates/profile/");
  return response.data;
};

export const updatePersonalInfo = async (data) => {
  const response = await api.put("candidates/personal_info/", data);
  return response.data;
};

export const updatePresentAddress = async (data) => {
  const response = await api.put("candidates/present_address/", data);
  return response.data;
};

export const updatePermanentAddress = async (data) => {
  const response = await api.put("candidates/permanent_address/", data);
  return response.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.put("candidates/profile_picture/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const addEducation = async (data) => {
  return (await api.post("candidates/education/", data)).data;
};
export const addTraining = async (data) => {
  return (await api.post("candidates/trainings/", data)).data;
};
export const addEmployment = async (data) => {
  return (await api.post("candidates/employments/", data)).data;
};
export const addSkill = async (data) => {
  return (await api.post("candidates/skills/", data)).data;
};
export const addExtracurricularActivity = async (data) => {
  return (await api.post("candidates/extracurriculars/", data)).data;
};
export const addReference = async (data) => {
  return (await api.post("candidates/references/", data)).data;
};
export const addPortfolio = async (data) => {
  return (await api.post("candidates/portfolios/", data)).data;
};

export const deleteEducation = async (id) => {
  await api.delete(`candidates/education/${id}/`);
};
export const deleteTraining = async (id) => {
  await api.delete(`candidates/trainings/${id}/`);
};
export const deleteEmployment = async (id) => {
  await api.delete(`candidates/employments/${id}/`);
};
export const deleteSkill = async (id) => {
  await api.delete(`candidates/skills/${id}/`);
};
export const deleteExtracurricularActivity = async (id) => {
  await api.delete(`candidates/extracurriculars/${id}/`);
};
export const deleteReference = async (id) => {
  await api.delete(`candidates/references/${id}/`);
};
export const deletePortfolio = async (id) => {
  await api.delete(`candidates/portfolios/${id}/`);
};

export const updateEducation = async (id, data) => {
  const response = await api.patch(`candidates/education/${id}/`, data);
  return response.data;
};

export const updateEmployment = async (id, data) => {
  const response = await api.patch(`candidates/employments/${id}/`, data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.patch(`candidates/skills/${id}/`, data);
  return response.data;
};

export const updateTraining = async (id, data) => {
  const response = await api.patch(`candidates/trainings/${id}/`, data);
  return response.data;
};

export const updateExtracurricularActivity = async (id, data) => {
  const response = await api.patch(`candidates/extracurriculars/${id}/`, data);
  return response.data;
};

export const updateReference = async (id, data) => {
  const response = await api.patch(`candidates/references/${id}/`, data);
  return response.data;
};

export const updatePortfolio = async (id, data) => {
  const response = await api.patch(`candidates/portfolios/${id}/`, data);
  return response.data;
};
