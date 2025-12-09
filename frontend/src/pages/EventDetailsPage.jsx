import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/events.service';
import { getUser } from '../hooks/auth';

function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const user = getUser();

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const data = await eventsService.getEvent(id);
            setEvent(data);
            // Set hasApplied from backend response
            if (data.hasApplied !== undefined) {
                setHasApplied(data.hasApplied);
            }
        } catch (error) {
            console.error('Failed to fetch event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            await eventsService.applyToEvent(id);
            setHasApplied(true);
            alert('Successfully applied to event!');
            fetchEvent();
        } catch (error) {
            if (error.response?.data?.error === 'You have already applied to this event') {
                setHasApplied(true);
            } else {
                alert('Failed to apply: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventsService.deleteEvent(id);
            alert('Event deleted successfully');
            navigate('/events');
        } catch (error) {
            alert('Failed to delete: ' + (error.response?.data?.error || error.message));
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-xl text-[#616161]">Loading event...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-xl text-[#616161]">Event not found</p>
            </div>
        );
    }

    const isOrganiser = user?.role === 'ORGANISER';
    const isOwner = user?.id === event.postedById;

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
            <main className="px-[6vw] py-10 max-w-[1000px] mx-auto">
                {event.posterUrl && (
                    <img
                        src={event.posterUrl}
                        alt={event.title}
                        className="w-full h-[400px] object-cover border-[3px] border-[#111] shadow-[10px_10px_0_#111] rounded-lg mb-8"
                    />
                )}

                <div className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="inline-block px-4 py-2 mb-3 text-sm font-bold bg-[#2362ef] text-white border-[2px] border-[#111] rounded">
                                {event.category}
                            </div>
                            <h1 className="text-4xl font-extrabold text-[#222] mb-2">{event.title}</h1>
                            {event.organisation && (
                                <p className="text-lg text-[#2362ef] font-medium">
                                    by {event.organisation.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-lg">
                            <span className="text-2xl mr-3">📅</span>
                            <span className="text-[#616161]">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="text-2xl mr-3">📍</span>
                            <span className="text-[#616161]">{event.locationText}</span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="text-2xl mr-3">⏱️</span>
                            <span className="text-[#616161]">{event.durationHours} hours</span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="text-2xl mr-3">👥</span>
                            <span className="text-[#616161]">
                                {event.currentVolCount}/{event.maxVolunteers} volunteers signed up
                            </span>
                        </div>
                        {event.skillsRequired && (
                            <div className="flex items-center text-lg">
                                <span className="text-2xl mr-3">🛠️</span>
                                <span className="text-[#616161]">{event.skillsRequired}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#222] mb-3">About this Event</h2>
                        <p className="text-[#616161] text-lg leading-relaxed">{event.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {!isOrganiser && (
                            <button
                                onClick={handleApply}
                                disabled={hasApplied}
                                className={`px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold transition-all ${hasApplied
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-[#2362ef] text-white hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]'
                                    }`}
                            >
                                {hasApplied ? '✓ Already Applied' : 'Apply to Volunteer'}
                            </button>
                        )}
                        {isOwner && (
                            <>
                                <Link
                                    to={`/events/${event.id}/signups`}
                                    className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                >
                                    Manage Volunteers
                                </Link>
                                <Link
                                    to={`/events/${event.id}/edit`}
                                    className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                >
                                    Edit Event
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#ff4444] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                >
                                    Delete Event
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <footer className="text-center py-6 text-[#999] text-base mt-8">
                © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
            </footer>
        </div>
    );
}

export default EventDetailsPage;
