import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteersService } from '../services/volunteers.service';

function MyEventsPage() {
    const [signups, setSignups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const data = await volunteersService.getMyEvents();
            setSignups(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSignup = async (signupId, eventTitle) => {
        if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
            return;
        }

        try {
            await volunteersService.cancelSignup(signupId);
            alert('Registration cancelled successfully');
            fetchMyEvents();
        } catch (error) {
            alert('Failed to cancel: ' + (error.response?.data?.error || error.message));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            REGISTERED: 'bg-[#2362ef]',
            WAITLIST: 'bg-[#ff9800]',
            ATTENDED: 'bg-[#4caf50]',
            REJECTED: 'bg-[#f44336]'
        };
        return colors[status] || 'bg-[#616161]';
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
                        to="/volunteer"
                        className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[1200px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
                    My <span className="text-[#2362ef]">Events</span>
                </h1>

                {loading ? (
                    <div className="text-center py-20 text-xl text-[#616161]">Loading your events...</div>
                ) : signups.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-[#616161] mb-4">You haven't signed up for any events yet</p>
                        <Link
                            to="/events"
                            className="inline-block px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                        >
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {signups.map((signup) => (
                            <div
                                key={signup.id}
                                className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#111]"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Event Image */}
                                    {signup.event.posterUrl && (
                                        <img
                                            src={signup.event.posterUrl}
                                            alt={signup.event.title}
                                            className="w-full md:w-64 h-48 object-cover border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#111]"
                                        />
                                    )}

                                    {/* Event Details */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`inline-block px-3 py-1 text-sm font-bold text-white border-[2px] border-[#111] rounded ${getStatusBadge(signup.status)}`}>
                                                        {signup.status}
                                                    </span>
                                                    <span className="inline-block px-3 py-1 text-sm font-bold bg-white text-[#111] border-[2px] border-[#111] rounded">
                                                        {signup.event.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-[#222] mb-2">{signup.event.title}</h3>
                                                {signup.event.organisation && (
                                                    <p className="text-sm text-[#2362ef] font-medium">
                                                        by {signup.event.organisation.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <p className="text-[#616161]">
                                                <span className="text-xl mr-2">📅</span>
                                                {formatDate(signup.event.date)}
                                            </p>
                                            <p className="text-[#616161]">
                                                <span className="text-xl mr-2">📍</span>
                                                {signup.event.locationText}
                                            </p>
                                            <p className="text-[#616161]">
                                                <span className="text-xl mr-2">⏱️</span>
                                                {signup.event.durationHours} hours
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                to={`/events/${signup.event.id}`}
                                                className="px-6 py-2 border-[3px] border-[#111] shadow-[4px_4px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#111]"
                                            >
                                                View Details
                                            </Link>
                                            {signup.status === 'REGISTERED' && (
                                                <button
                                                    onClick={() => handleCancelSignup(signup.id, signup.event.title)}
                                                    className="px-6 py-2 border-[3px] border-[#111] shadow-[4px_4px_0_#111] font-bold bg-[#ff4444] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#111]"
                                                >
                                                    Cancel Registration
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default MyEventsPage;
