import api from './api';

const PROFILE_URL = 'candidate/profile/';

// These URLs match exactly what we set up in ai_engine/urls.py
const DOCS_URL = 'candidate/documents/'; 
const AI_PROCESS_URL = 'candidate/ai-process-documents/';

export const getDocuments = async () => {
    const response = await api.get(DOCS_URL);
    return response.data;
};

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use multipart/form-data for uploading files
    const response = await api.post(DOCS_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteDocument = async (id) => {
    const response = await api.delete(`${DOCS_URL}${id}/`);
    return response.data;
};

export const processDocumentsWithAi = async () => {
    // Triggers the Django backend, which in turn calls the FastAPI server
    const response = await api.post(AI_PROCESS_URL);
    return response.data; // Returns the pure JSON formatted by Gemini
};

export const updatePersonalInfo = async (data) => {
    const response = await api.patch(`${PROFILE_URL}personal_info/`, data);
    return response.data;
};

export const updatePresentAddress = async (data) => {
    const response = await api.patch(`${PROFILE_URL}present_address/`, data);
    return response.data;
};

// Functions to add list items
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