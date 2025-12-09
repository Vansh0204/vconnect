import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { organiserService } from '../services/organiser.service';
import { eventsService } from '../services/events.service';

function EventSignupsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [signups, setSignups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventData, signupsData] = await Promise.all([
                eventsService.getEvent(id),
                organiserService.getEventSignups(id)
            ]);
            setEvent(eventData);
            setSignups(signupsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (signupId, newStatus) => {
        try {
            await organiserService.updateSignupStatus(signupId, newStatus);
            // Refresh signups
            const updatedSignups = await organiserService.getEventSignups(id);
            setSignups(updatedSignups);
        } catch (error) {
            alert('Failed to update status: ' + (error.response?.data?.error || error.message));
        }
    };

    const filteredSignups = signups.filter(signup => {
        if (filter === 'ALL') return true;
        return signup.status === filter;
    });

    const getStatusBadge = (status) => {
        const colors = {
            REGISTERED: 'bg-[#2362ef]',
            WAITLIST: 'bg-[#ff9800]',
            ATTENDED: 'bg-[#4caf50]',
            REJECTED: 'bg-[#f44336]'
        };
        return colors[status] || 'bg-[#616161]';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-xl text-[#616161]">Loading volunteers...</p>
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
                <div className="flex items-center space-x-3">
                    <Link
                        to={`/events/${id}`}
                        className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                    >
                        ← Back to Event
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#222] mb-2">Manage Volunteers</h1>
                        <p className="text-xl text-[#616161]">for {event?.title}</p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border-[2px] border-[#111] rounded font-bold focus:outline-none focus:border-[#2362ef]"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="REGISTERED">Registered</option>
                            <option value="ATTENDED">Attended</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f0f0f0] border-b-[2px] border-[#111]">
                                    <th className="p-4 font-bold text-[#222]">Volunteer</th>
                                    <th className="p-4 font-bold text-[#222]">Email</th>
                                    <th className="p-4 font-bold text-[#222]">Skills</th>
                                    <th className="p-4 font-bold text-[#222]">Status</th>
                                    <th className="p-4 font-bold text-[#222]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSignups.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-[#616161]">
                                            No volunteers found with this status.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSignups.map((signup) => (
                                        <tr key={signup.id} className="border-b border-[#eee] hover:bg-[#fafafa]">
                                            <td className="p-4 font-medium text-[#222]">{signup.volunteer.name}</td>
                                            <td className="p-4 text-[#616161]">{signup.volunteer.email}</td>
                                            <td className="p-4 text-[#616161]">{signup.volunteer.skills || '-'}</td>
                                            <td className="p-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded ${getStatusBadge(signup.status)}`}>
                                                    {signup.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {signup.status === 'REGISTERED' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(signup.id, 'ATTENDED')}
                                                                className="px-3 py-1 border-[2px] border-[#111] text-xs font-bold bg-[#4caf50] text-white hover:opacity-90"
                                                            >
                                                                Mark Attended
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(signup.id, 'REJECTED')}
                                                                className="px-3 py-1 border-[2px] border-[#111] text-xs font-bold bg-[#f44336] text-white hover:opacity-90"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {signup.status === 'ATTENDED' && (
                                                        <span className="text-[#4caf50] font-bold text-sm">✓ Completed</span>
                                                    )}
                                                    {signup.status === 'REJECTED' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(signup.id, 'REGISTERED')}
                                                            className="px-3 py-1 border-[2px] border-[#111] text-xs font-bold bg-white text-[#111] hover:bg-gray-100"
                                                        >
                                                            Restore
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EventSignupsPage;
