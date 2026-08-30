import api from './api';

const SCHEDULES_URL = 'interviews/schedules/';
const RESCHEDULE_URL = 'interviews/reschedule-requests/';

export const getMyInterviews = async () => {
    const response = await api.get(SCHEDULES_URL);
    return response.data;
};

export const requestReschedule = async (interviewId, requestedTime, reason) => {
    const response = await api.post(RESCHEDULE_URL, {
        interview: interviewId,
        requested_time: requestedTime,
        reason: reason
    });
    return response.data;
};

export const createInterview = async (interviewData) => {
    const response = await api.post(SCHEDULES_URL, interviewData);
    return response.data;
};

export const deleteInterview = async (id) => {
    const response = await api.delete(`${SCHEDULES_URL}${id}/`);
    return response.data;
};