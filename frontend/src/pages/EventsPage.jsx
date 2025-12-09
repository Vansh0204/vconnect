import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsService } from '../services/events.service';
import { getUser } from '../hooks/auth';

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventsService.getEvents(filters);
            if (Array.isArray(data)) {
                setEvents(data);
            } else if (data && Array.isArray(data.events)) {
                setEvents(data.events);
            } else {
                console.error('Events data is not an array:', data);
                setEvents([]);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        fetchEvents();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#111]">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-[6vw] py-5 bg-white border-b-0">
                <Link to="/" className="text-2xl font-bold text-[#2362ef]">
                    Volunteer Connect
                </Link>
                <div className="flex items-center space-x-3">
                    <Link
                        to="/"
                        className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                    >
                        ← Back
                    </Link>
                    {getUser()?.role === 'ORGANISER' && (
                        <Link
                            to="/events/create"
                            className="px-7 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                        >
                            Create Event
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[1400px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
                    Browse <span className="text-[#2362ef]">Opportunities</span>
                </h1>

                {/* Filters */}
                <div className="mb-8 p-6 bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search events..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 border-[3px] border-[#111] shadow-[4px_4px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#111]"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="text-center py-20 text-xl text-[#616161]">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-[#616161] mb-4">No events found</p>
                        <Link
                            to="/events/create"
                            className="inline-block px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                        >
                            Create First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                to={`/events/${event.id}`}
                                className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#111]"
                            >
                                {event.posterUrl && (
                                    <img
                                        src={event.posterUrl}
                                        alt={event.title}
                                        className="w-full h-48 object-cover border-b-[3px] border-[#111]"
                                    />
                                )}
                                <div className="p-5">
                                    <div className="inline-block px-3 py-1 mb-3 text-sm font-bold bg-[#2362ef] text-white border-[2px] border-[#111] rounded">
                                        {event.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#222] mb-2">{event.title}</h3>
                                    <p className="text-[#616161] mb-3 line-clamp-2">{event.description}</p>
                                    <div className="space-y-1 text-sm text-[#616161]">
                                        <p>📅 {formatDate(event.date)}</p>
                                        <p>📍 {event.locationText}</p>
                                        <p>👥 {event.currentVolCount}/{event.maxVolunteers} volunteers</p>
                                    </div>
                                    {event.organisation && (
                                        <p className="mt-3 text-sm font-medium text-[#2362ef]">
                                            by {event.organisation.name}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="text-center py-6 text-[#999] text-base mt-8">
                © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
            </footer>
        </div>
    );
}

export default EventsPage;
