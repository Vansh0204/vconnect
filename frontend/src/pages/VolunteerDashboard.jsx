import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, clearAuth } from '../hooks/auth';
import { useNavigate } from 'react-router-dom';

function VolunteerDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

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
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
          Volunteer <span className="text-[#2362ef]">Dashboard</span>
        </h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link
            to="/events"
            className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#111]"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-[#222] mb-2">Browse Events</h3>
            <p className="text-[#616161]">Find volunteer opportunities near you</p>
          </Link>

          <Link
            to="/volunteer/my-events"
            className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#111]"
          >
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-[#222] mb-2">My Events</h3>
            <p className="text-[#616161]">View your signed-up events</p>
          </Link>

          <Link
            to="/volunteer/profile"
            className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#111]"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="text-xl font-bold text-[#222] mb-2">My Profile</h3>
            <p className="text-[#616161]">Update your information</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#222] mb-6">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2362ef] mb-2">{user?.totalHours || 0}</div>
              <div className="text-[#616161]">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2362ef] mb-2">0</div>
              <div className="text-[#616161]">Events Attended</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2362ef] mb-2">0</div>
              <div className="text-[#616161]">Certificates Earned</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-[#999] text-base mt-8">
        © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
      </footer>
    </div>
  );
}

export default VolunteerDashboard;
