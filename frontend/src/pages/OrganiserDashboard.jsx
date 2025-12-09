import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser, clearAuth } from '../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { organiserService } from '../services/organiser.service';

function OrganiserDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalVolunteers: 0,
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    website: '',
    logoUrl: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await organiserService.getDashboardStats();
      setStats(data);
      setNeedsProfile(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      if (error.response && error.response.status === 404) {
        setNeedsProfile(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await organiserService.createProfile(profileData);
      setNeedsProfile(false);
      fetchStats();
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-xl font-bold text-[#2362ef]">Loading...</div>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-[#fafafa] font-sans text-[#111] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-[8px_8px_0_#111] border-[3px] border-[#111] max-w-md w-full">
          <h1 className="text-3xl font-extrabold text-[#222] mb-6 text-center">
            Setup <span className="text-[#2362ef]">Organisation</span>
          </h1>
          <p className="text-[#616161] mb-6 text-center">
            Please create your organisation profile to continue.
          </p>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Organisation Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                rows="3"
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Website (Optional)</label>
              <input
                type="url"
                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Logo URL (Optional)</label>
              <input
                type="url"
                className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                value={profileData.logoUrl}
                onChange={(e) => setProfileData({ ...profileData, logoUrl: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2362ef] text-white font-bold rounded border-[3px] border-[#111] shadow-[4px_4px_0_#111] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_#111] transition-all"
            >
              Create Profile
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2 text-[#616161] font-bold hover:text-[#111]"
          >
            Logout
          </button>
        </div>
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
          <span className="text-[#616161]">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-[6vw] py-10 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#222]">
            Organiser <span className="text-[#2362ef]">Dashboard</span>
          </h1>
          <Link
            to="/events/create"
            className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
          >
            + Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6">
            <div className="text-4xl font-extrabold text-[#2362ef] mb-2">{stats.totalEvents}</div>
            <div className="text-[#616161] font-bold">Total Events</div>
          </div>
          <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6">
            <div className="text-4xl font-extrabold text-[#2362ef] mb-2">{stats.activeEvents}</div>
            <div className="text-[#616161] font-bold">Active Events</div>
          </div>
          <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6">
            <div className="text-4xl font-extrabold text-[#2362ef] mb-2">{stats.totalVolunteers}</div>
            <div className="text-[#616161] font-bold">Total Volunteers</div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#222]">Recent Events</h2>
            <Link to="/events" className="text-[#2362ef] font-bold hover:underline">
              View All Events →
            </Link>
          </div>

          {stats.recentEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#616161] mb-4">No events created yet.</p>
              <Link
                to="/events/create"
                className="text-[#2362ef] font-bold hover:underline"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border-[2px] border-[#eee] rounded hover:bg-[#fafafa]">
                  <div>
                    <h3 className="font-bold text-lg text-[#222]">{event.title}</h3>
                    <p className="text-sm text-[#616161]">
                      {new Date(event.date).toLocaleDateString()} • {event.locationText}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#616161]">
                      {event._count?.signups || 0} Volunteers
                    </span>
                    <Link
                      to={`/events/${event.id}/signups`}
                      className="px-4 py-2 border-[2px] border-[#111] text-sm font-bold bg-white text-[#111] hover:bg-gray-100"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/events/${event.id}/edit`}
                      className="px-4 py-2 border-[2px] border-[#111] text-sm font-bold bg-white text-[#111] hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-[#999] text-base mt-8">
        © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
      </footer>
    </div>
  );
}

export default OrganiserDashboard;
