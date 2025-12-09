import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsService } from '../services/events.service';

function EditEventPage() {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const event = await eventsService.getEvent(id);

            // Format date for datetime-local input
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);

            setFormData({
                title: event.title || '',
                description: event.description || '',
                category: event.category || '',
                date: formattedDate,
                durationHours: event.durationHours || '',
                locationText: event.locationText || '',
                lat: event.lat || '',
                lng: event.lng || '',
                skillsRequired: event.skillsRequired || '',
                maxVolunteers: event.maxVolunteers || '',
                posterUrl: event.posterUrl || ''
            });
        } catch (error) {
            alert('Failed to fetch event: ' + (error.response?.data?.error || error.message));
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await eventsService.updateEvent(id, formData);
            alert('Event updated successfully!');
            navigate(`/events/${id}`);
        } catch (error) {
            alert('Failed to update event: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-xl text-[#616161]">Loading event...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#111]">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-[6vw] py-5 bg-white border-b-0">
                <Link to="/" className="text-2xl font-bold text-[#2362ef]">
                    Volunteer Connect
                </Link>
                <Link
                    to={`/events/${id}`}
                    className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                >
                    ← Back to Event
                </Link>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[800px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
                    Edit <span className="text-[#2362ef]">Event</span>
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
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Update Event'}
                        </button>
                        <Link
                            to={`/events/${id}`}
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

export default EditEventPage;
