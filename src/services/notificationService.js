import api from './api';

const NOTIFY_URL = 'notifications/messages/';

export const getMyNotifications = async () => {
    const response = await api.get(NOTIFY_URL);
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.patch(`${NOTIFY_URL}${id}/mark_read/`);
    return response.data;
};

// HR Only Function (Used by the HR Job Dashboard)
export const sendNotification = async (data) => {
    const response = await api.post(NOTIFY_URL, data);
    return response.data;
};