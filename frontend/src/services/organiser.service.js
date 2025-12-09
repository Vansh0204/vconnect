import api from './api';

export const organiserService = {
    // Get dashboard stats
    getDashboardStats: async () => {
        const response = await api.get('/organiser/stats');
        return response.data;
    },

    // Create organisation profile
    createProfile: async (profileData) => {
        const response = await api.post('/organiser/profile', profileData);
        return response.data;
    },

    // Update signup status
    updateSignupStatus: async (signupId, status) => {
        const response = await api.patch(`/organiser/signups/${signupId}/status`, { status });
        return response.data;
    },

    // Get signups for an event (reusing events service endpoint but wrapping it here for convenience)
    getEventSignups: async (eventId) => {
        const response = await api.get(`/events/${eventId}/signups`);
        return response.data;
    }
};
