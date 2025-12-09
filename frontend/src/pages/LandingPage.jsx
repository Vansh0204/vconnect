import React, { useState, useEffect } from "react";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";
import LoadingScreen from "../components/LoadingScreen";
import { setAuth, getUser, clearAuth } from "../hooks/auth";
import { useNavigate, Link } from "react-router-dom";

function LandingPage() {
  const [openVolunteer, setOpenVolunteer] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = getUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setVisible(true), 100);
    }
  }, [loading]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    window.location.reload(); // Reload to reset all state
  };

  if (loading) {
    return <LoadingScreen onLoadingComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] font-sans text-[#111] flex flex-col transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-[6vw] py-5 bg-white/80 backdrop-blur-sm border-b-0 sticky top-0 z-40">
        <div className="text-xl md:text-2xl font-bold text-[#2362ef]">Volunteer Connect</div>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {user && (
            <Link
              to="/events"
              className="inline-block px-3 lg:px-4 py-2 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111] font-medium text-[#222] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] text-sm lg:text-base"
            >
              Events
            </Link>
          )}
          {[
            { name: "How It Works", href: "#how-it-works" },
            { name: "Impact", href: "#impact" }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="inline-block px-3 lg:px-4 py-2 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111] font-medium text-[#222] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] text-sm lg:text-base"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <button
                className="px-4 md:px-7 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] text-sm md:text-base"
                onClick={() => navigate(user.role === 'VOLUNTEER' ? '/volunteer' : '/organiser')}
              >
                Dashboard
              </button>
              <button
                className="px-4 md:px-7 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] text-sm md:text-base"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="px-4 md:px-7 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] text-sm md:text-base animate-pulse"
              onClick={() => setOpenVolunteer(true)}
            >
              Register
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-[4vw] md:px-[5vw] lg:px-[8vw] gap-8 lg:gap-12">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/hero-bg.png)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-[#fafafa]/90 to-[#f0f0f0]/95"></div>
        </div>

        <div className="flex-1 max-w-[650px] w-full text-center lg:text-left animate-fade-in-up relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#222] mb-4 md:mb-6 leading-tight">
            Connecting Volunteers <span className="text-[#2362ef]">with</span>
            <br />
            <span className="text-[#2362ef]">Opportunities</span>
          </h1>
          <p className="text-[#616161] text-base md:text-xl mb-6 md:mb-9">
            Join volunteers making an impact. Discover events, connect with NGOs, and contribute to meaningful change.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <button
                className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-base md:text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] hover:scale-105"
                onClick={() => setOpenVolunteer(true)}
              >
                Register as Volunteer
              </button>
              <button
                className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-base md:text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] hover:scale-105"
                onClick={() => setOpenOrg(true)}
              >
                Register as Organisation
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-center lg:justify-end w-full animate-fade-in-right relative z-10">
          <img
            src="/hero-side.png"
            alt="Volunteers making a difference"
            className="w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[600px] lg:h-[600px] object-contain transition-transform hover:scale-110 duration-500 drop-shadow-2xl animate-float"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(35, 98, 239, 0.3))' }}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="min-h-screen bg-white flex items-center justify-center py-16 md:py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-[4vw] md:px-[5vw] lg:px-[8vw] w-full relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-6 text-[#222]">
            How It <span className="text-[#2362ef] relative">
              Works
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#2362ef] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-center text-[#616161] text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
            Getting started is simple. Follow these easy steps to make a real difference in your community today.
          </p>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-[#2362ef] via-[#e83e8c] to-[#2362ef] opacity-20 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <div className="text-center group relative">
                <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-[#2362ef] rounded-full shadow-[0_10px_20px_rgba(35,98,239,0.3)] flex items-center justify-center text-4xl font-bold text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_15px_30px_rgba(35,98,239,0.4)] border-4 border-white ring-4 ring-[#2362ef]/20">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#222]">Create Account</h3>
                <p className="text-[#616161] leading-relaxed px-4 text-sm md:text-base">
                  Sign up as a volunteer or organization in just a few clicks. It's quick, easy, and free!
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group relative">
                <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-[#ef4444] rounded-full shadow-[0_10px_20px_rgba(239,68,68,0.3)] flex items-center justify-center text-4xl font-bold text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_15px_30px_rgba(239,68,68,0.4)] border-4 border-white ring-4 ring-[#ef4444]/20">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#222]">Find Events</h3>
                <p className="text-[#616161] leading-relaxed px-4 text-sm md:text-base">
                  Browse through hundreds of volunteer opportunities. Filter by location, category, and date.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group relative">
                <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-[#22c55e] rounded-full shadow-[0_10px_20px_rgba(34,197,94,0.3)] flex items-center justify-center text-4xl font-bold text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_15px_30px_rgba(34,197,94,0.4)] border-4 border-white ring-4 ring-[#22c55e]/20">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#222]">Make Impact</h3>
                <p className="text-[#616161] leading-relaxed px-4 text-sm md:text-base">
                  Attend events, contribute your time, and track your volunteer hours. Change lives!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="events" className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] flex items-center justify-center py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-[4vw] md:px-[5vw] lg:px-[8vw] w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#222]">
            Why Choose <span className="text-[#2362ef]">Us?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0_#111] card-shadow hover:card-shadow-hover animate-scale-in">
              <div className="text-4xl mb-4 transition-transform hover:scale-125 duration-300">🔍</div>
              <h3 className="text-lg font-bold mb-2 text-[#222]">Easy Discovery</h3>
              <p className="text-[#616161] text-sm">
                Find volunteer opportunities that match your interests and schedule.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#111]">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold mb-2 text-[#222]">Track Progress</h3>
              <p className="text-[#616161] text-sm">
                Monitor your volunteer hours and see the impact you're making.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#111]">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold mb-2 text-[#222]">Connect</h3>
              <p className="text-[#616161] text-sm">
                Join a community of like-minded individuals making a difference.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#111]">
              <div className="text-4xl mb-4">🎖️</div>
              <h3 className="text-lg font-bold mb-2 text-[#222]">Get Recognized</h3>
              <p className="text-[#616161] text-sm">
                Earn certificates and recognition for your volunteer work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="min-h-screen bg-white border-t-[3px] border-[#111] flex items-center justify-center py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-[4vw] md:px-[5vw] lg:px-[8vw] w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#222]">
            Our <span className="text-[#2362ef]">Impact</span>
          </h2>
          <p className="text-center text-[#616161] text-lg mb-12 max-w-2xl mx-auto">
            Together, we're creating positive change in communities around the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-[#2362ef] to-[#1a4bc7] border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8 text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-[14px_14px_0_#111] hover:scale-105 animate-slide-in-left card-shadow-hover">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 animate-pulse">1,234</div>
              <div className="text-white/90 text-lg font-semibold">Active Volunteers</div>
            </div>

            <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ee5a52] border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8 text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-[14px_14px_0_#111] hover:scale-105 animate-scale-in animate-delay-200 card-shadow-hover">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 animate-pulse">567</div>
              <div className="text-white/90 text-lg font-semibold">Events Completed</div>
            </div>

            <div className="bg-gradient-to-br from-[#51cf66] to-[#37b24d] border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8 text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-[14px_14px_0_#111] hover:scale-105 animate-slide-in-right card-shadow-hover">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 animate-pulse">12,890</div>
              <div className="text-white/90 text-lg font-semibold">Hours Contributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#2362ef] to-[#1a4bc7] flex items-center justify-center py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-[4vw] md:px-[5vw] text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers and organizations creating positive change in communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setOpenVolunteer(true)}
              className="px-8 py-3 rounded-lg text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#2362ef] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] hover:scale-105"
            >
              Get Started Now
            </button>
            <button
              onClick={() => setOpenOrg(true)}
              className="px-8 py-3 rounded-lg text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-transparent text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] hover:scale-105"
            >
              List Your Event
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#999] text-base bg-white border-t-[3px] border-[#111]">
        <div className="max-w-[1600px] mx-auto px-[4vw]">
          <p className="mb-2">© 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span></p>
          <p className="text-sm">Making the world a better place, one volunteer at a time.</p>
        </div>
      </footer>

      <SignupModal role="volunteer" open={openVolunteer} onClose={() => setOpenVolunteer(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate('/volunteer'); }} onSwitchToLogin={() => { setOpenVolunteer(false); setOpenLogin(true); }} />
      <SignupModal role="organisation" open={openOrg} onClose={() => setOpenOrg(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate('/organiser'); }} onSwitchToLogin={() => { setOpenOrg(false); setOpenLogin(true); }} />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate(data.user.role === 'VOLUNTEER' ? '/volunteer' : '/organiser'); }} />
      {user && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, background: '#fff', border: '2px solid #111', boxShadow: '6px 6px 0 #111', borderRadius: 10, padding: '10px 14px', zIndex: 50 }}>
          Signed in as {user.name} ({user.role})
        </div>
      )}
    </div>
  );
}

export default LandingPage;
