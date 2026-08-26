import api from './api';

const BASE_URL = 'applications/';

export const getMyApplications = async () => {
    const response = await api.get(BASE_URL);
    return response.data;
};

// Removed the resumeFile parameter and switched back to a simple JSON object
export const applyForJob = async (jobId, coverLetter) => {
    const response = await api.post(BASE_URL, {
        job: jobId,
        cover_letter: coverLetter
    });
    return response.data;
};