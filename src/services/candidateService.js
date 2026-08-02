import api from './api';

// --- READ FULL PROFILE ---
export const getProfile = async () => {
    const response = await api.get('candidates/profile/');
    return response.data;
};

// --- 1-TO-1 UPDATES (PUT) ---
export const updatePersonalInfo = async (data) => {
    const response = await api.put('candidates/personal_info/', data);
    return response.data;
};

// --- UPLOAD PROFILE PICTURE ---
export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.put('candidates/profile_picture/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updatePresentAddress = async (data) => {
    const response = await api.put('candidates/present_address/', data);
    return response.data;
};

export const updatePermanentAddress = async (data) => {
    const response = await api.put('candidates/permanent_address/', data);
    return response.data;
};

// --- 1-TO-MANY ADDITIONS (POST) ---
export const addEducation = async (data) => { return (await api.post('candidates/education/', data)).data; };
export const addTraining = async (data) => { return (await api.post('candidates/trainings/', data)).data; };
export const addEmployment = async (data) => { return (await api.post('candidates/employments/', data)).data; };
export const addSkill = async (data) => { return (await api.post('candidates/skills/', data)).data; };
export const addExtracurricular = async (data) => { return (await api.post('candidates/extracurriculars/', data)).data; };
export const addReference = async (data) => { return (await api.post('candidates/references/', data)).data; };
export const addPortfolio = async (data) => { return (await api.post('candidates/portfolios/', data)).data; };

// --- 1-TO-MANY DELETIONS (DELETE) ---
export const deleteEducation = async (id) => { await api.delete(`candidates/education/${id}/`); };
export const deleteTraining = async (id) => { await api.delete(`candidates/trainings/${id}/`); };
export const deleteEmployment = async (id) => { await api.delete(`candidates/employments/${id}/`); };
export const deleteSkill = async (id) => { await api.delete(`candidates/skills/${id}/`); };
export const deleteExtracurricular = async (id) => { await api.delete(`candidates/extracurriculars/${id}/`); };
export const deleteReference = async (id) => { await api.delete(`candidates/references/${id}/`); };
export const deletePortfolio = async (id) => { await api.delete(`candidates/portfolios/${id}/`); };