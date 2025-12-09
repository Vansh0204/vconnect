import api from './api';

export const volunteersService = {
    // Get volunteer profile
    getProfile: async () => {
        const response = await api.get('/volunteers/me');
        return response.data;
    },

    // Update volunteer profile
    updateProfile: async (profileData) => {
        const response = await api.put('/volunteers/me', profileData);
        return response.data;
    },

    // Get my signed-up events
    getMyEvents: async () => {
        const response = await api.get('/volunteers/my-events');
        return response.data;
    },

    // Cancel event signup
    cancelSignup: async (signupId) => {
        const response = await api.delete(`/volunteers/signups/${signupId}`);
        return response.data;
    }
};
