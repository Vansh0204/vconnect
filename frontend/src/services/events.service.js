import api from './api';

export const eventsService = {
    // Get all events with optional filters
    getEvents: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.location) params.append('location', filters.location);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get(`/events?${params.toString()}`);
        return response.data;
    },

    // Get a single event by ID
    getEvent: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    // Create a new event
    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    // Update an event
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    // Delete an event
    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    // Get my events (organiser)
    getMyEvents: async () => {
        const response = await api.get('/events/mine');
        return response.data;
    },

    // Apply to an event (volunteer)
    applyToEvent: async (id) => {
        const response = await api.post(`/events/${id}/apply`);
        return response.data;
    }
};
