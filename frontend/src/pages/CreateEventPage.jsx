import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventsService } from '../services/events.service';

function CreateEventPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
        durationHours: '',
        locationText: '',
        lat: '',
        lng: '',
        skillsRequired: '',
        maxVolunteers: '',
        posterUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const event = await eventsService.createEvent(formData);
            alert('Event created successfully!');
            navigate(`/events/${event.id}`);
        } catch (error) {
            alert('Failed to create event: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#111]">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-[6vw] py-5 bg-white border-b-0">
                <Link to="/" className="text-2xl font-bold text-[#2362ef]">
                    Volunteer Connect
                </Link>
                <Link
                    to="/events"
                    className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                >
                    ← Back to Events
                </Link>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[800px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
                    Create <span className="text-[#2362ef]">New Event</span>
                </h1>

                <form onSubmit={handleSubmit} className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="e.g., Beach Cleanup Drive"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="Describe the event, goals, and what volunteers will do..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Category *
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="e.g., Environment, Education, Health"
                            />
                        </div>

                        {/* Date and Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[#222] mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#222] mb-2">
                                    Duration (hours) *
                                </label>
                                <input
                                    type="number"
                                    name="durationHours"
                                    value={formData.durationHours}
                                    onChange={handleChange}
                                    required
                                    step="0.5"
                                    className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    placeholder="e.g., 3"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="locationText"
                                value={formData.locationText}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="e.g., Marina Beach, Chennai"
                            />
                        </div>

                        {/* Coordinates (Optional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[#222] mb-2">
                                    Latitude (optional)
                                </label>
                                <input
                                    type="number"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    step="any"
                                    className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    placeholder="e.g., 13.0827"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#222] mb-2">
                                    Longitude (optional)
                                </label>
                                <input
                                    type="number"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    step="any"
                                    className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    placeholder="e.g., 80.2707"
                                />
                            </div>
                        </div>

                        {/* Skills Required */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Skills Required (optional)
                            </label>
                            <input
                                type="text"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="e.g., Communication, Physical fitness"
                            />
                        </div>

                        {/* Max Volunteers */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Max Volunteers *
                            </label>
                            <input
                                type="number"
                                name="maxVolunteers"
                                value={formData.maxVolunteers}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="e.g., 50"
                            />
                        </div>

                        {/* Poster URL */}
                        <div>
                            <label className="block text-sm font-bold text-[#222] mb-2">
                                Poster URL (optional)
                            </label>
                            <input
                                type="url"
                                name="posterUrl"
                                value={formData.posterUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                placeholder="https://example.com/poster.jpg"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                        <Link
                            to="/events"
                            className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>

            <footer className="text-center py-6 text-[#999] text-base mt-8">
                © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
            </footer>
        </div>
    );
}

export default CreateEventPage;
