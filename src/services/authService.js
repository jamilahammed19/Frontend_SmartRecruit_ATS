import api from "./api";

export const registerCandidate = async (userData) => {
  const response = await api.post("accounts/register/candidate/", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("accounts/login/", credentials);
  return response.data;
};
