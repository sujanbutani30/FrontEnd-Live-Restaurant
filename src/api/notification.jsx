
import axiosInstance, { endpoints } from '../axios';

export const fetchNotifications = async () => {
    try {
        const response = await axiosInstance.get(endpoints.Notifications.getNotifications);
        return response.data;
    } catch (error) {
        throw error;
}
}