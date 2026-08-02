import api from './api';

export const registerCandidate = async (userData) => {
    // Appends to baseURL: http://127.0.0.1:8000/api/accounts/register/candidate/
    const response = await api.post('accounts/register/candidate/', userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    // Appends to baseURL: http://127.0.0.1:8000/api/accounts/login/
    const response = await api.post('accounts/login/', credentials);
    return response.data;
};