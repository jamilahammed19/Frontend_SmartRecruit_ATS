import api from './api';

const DOCS_URL = 'candidate/documents/'; // Adjust to match your Django URL
const AI_PROCESS_URL = 'candidate/ai-process-documents/'; // Adjust to match your Django URL

export const getDocuments = async () => {
    const response = await api.get(DOCS_URL);
    return response.data;
};

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We use multipart/form-data for files
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
    // Triggers the backend AI agent to read all uploaded documents
    const response = await api.post(AI_PROCESS_URL);
    return response.data; // Expected to return the parsed JSON object!
};