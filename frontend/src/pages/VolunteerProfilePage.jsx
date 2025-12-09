import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteersService } from '../services/volunteers.service';

function VolunteerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        skills: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await volunteersService.getProfile();
            setProfile(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                city: data.city || '',
                state: data.state || '',
                country: data.country || '',
                skills: data.skills || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await volunteersService.updateProfile(formData);
            setProfile(updated);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-xl text-[#616161]">Loading profile...</p>
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
                        to="/volunteer"
                        className="px-6 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-[6vw] py-10 max-w-[900px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8">
                    My <span className="text-[#2362ef]">Profile</span>
                </h1>

                <div className="bg-white border-[3px] border-[#111] shadow-[8px_8px_0_#111] rounded-lg p-8">
                    {!editing ? (
                        <>
                            {/* View Mode */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-[#616161] mb-1">Name</h3>
                                    <p className="text-lg text-[#222]">{profile?.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#616161] mb-1">Email</h3>
                                    <p className="text-lg text-[#222]">{profile?.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#616161] mb-1">Phone</h3>
                                    <p className="text-lg text-[#222]">{profile?.phone || 'Not provided'}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-[#616161] mb-1">City</h3>
                                        <p className="text-lg text-[#222]">{profile?.city || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#616161] mb-1">State</h3>
                                        <p className="text-lg text-[#222]">{profile?.state || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#616161] mb-1">Country</h3>
                                        <p className="text-lg text-[#222]">{profile?.country || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#616161] mb-1">Skills</h3>
                                    <p className="text-lg text-[#222]">{profile?.skills || 'Not provided'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#616161] mb-1">Total Volunteer Hours</h3>
                                    <p className="text-2xl font-bold text-[#2362ef]">{profile?.totalHours || 0} hours</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Edit Mode */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#222] mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#222] mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#222] mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#222] mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#222] mb-2">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#222] mb-2">Skills</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g., Teaching, Communication, First Aid"
                                        className="w-full px-4 py-2 border-[2px] border-[#111] rounded focus:outline-none focus:border-[#2362ef]"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="px-8 py-3 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <footer className="text-center py-6 text-[#999] text-base mt-8">
                © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
            </footer>
        </div>
    );
}

export default VolunteerProfilePage;
