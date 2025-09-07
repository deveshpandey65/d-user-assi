'use client'
import withAuth from '@/hoc/withAuth';
import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Code, Briefcase, Link as LinkIcon, LogOut } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

function UserProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        education: '',
        skills: '',
        work: '',
        links: '',
        projects: [{ title: '', desc: '', links: '' }],
    });

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user');
                const data = res.data.user;

                setUserData({
                    name: data.name || '',
                    email: data.email || '',
                    education: data.education || '',
                    skills: data.skills ? data.skills.join(', ') : '',
                    work: data.work ? data.work.join(', ') : '',
                    links: data.links ? data.links.join(', ') : '',
                    projects: data.projects.length
                        ? data.projects
                        : [{ title: '', desc: '', links: '' }],
                });
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProjectChange = (index, field, value) => {
        const updated = [...userData.projects];
        updated[index][field] = value;
        setUserData(prev => ({ ...prev, projects: updated }));
    };

    const addProject = () => {
        setUserData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', desc: '', links: '' }],
        }));
    };

    const handleChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...userData,
                skills: userData.skills.split(',').map(s => s.trim()),
                work: userData.work.split(',').map(w => w.trim()),
                links: userData.links.split(',').map(l => l.trim()),
                projects: userData.projects.filter(p => p.title),
            };

            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            await api.patch(`/user/${userId}`, payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Update failed';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
            <svg className="animate-spin h-8 w-8 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    const inputClasses = "w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-300 ease-in-out shadow-sm";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";
    const projectInputClasses = "w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-sky-500 transition-colors duration-200";

    return (
        <div className="flex justify-center p-4 min-h-screen bg-gray-50 text-gray-800">
            <div className="relative z-10 p-8 rounded-3xl w-full max-w-2xl bg-white shadow-xl ring-1 ring-gray-200/50 animate-fadeInUp">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex justify-between w-full items-center mb-4">
                        <div className="flex flex-col items-center w-full">
                            <div className="bg-sky-100 p-4 rounded-full mb-2 animate-float">
                                <User size={48} className="text-sky-600" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-wide text-center">Your Profile</h1>
                            <p className="text-gray-600 text-sm text-center">Edit your professional details and save your changes.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                            title="Logout"
                        >
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-xl text-center font-medium transition-opacity duration-300 ${message.type === 'success'
                        ? 'bg-green-200 text-green-800 ring-1 ring-green-500'
                        : 'bg-red-200 text-red-800 ring-1 ring-red-500'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                        <User className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className={inputClasses}
                            value={userData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className={iconClasses} />
                        <input
                            type="email"
                            placeholder="Email"
                            className={inputClasses}
                            value={userData.email}
                            onChange={e => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    {/* Education */}
                    <div className="relative">
                        <BookOpen className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Education"
                            className={inputClasses}
                            value={userData.education}
                            onChange={e => handleChange('education', e.target.value)}
                        />
                    </div>

                    {/* Skills */}
                    <div className="relative">
                        <Code className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Skills (comma separated)"
                            className={inputClasses}
                            value={userData.skills}
                            onChange={e => handleChange('skills', e.target.value)}
                        />
                    </div>

                    {/* Projects */}
                    <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">Projects</p>
                        {userData.projects.map((proj, idx) => (
                            <div key={idx} className="space-y-3 mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={proj.title}
                                    onChange={e => handleProjectChange(idx, 'title', e.target.value)}
                                    className={projectInputClasses}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={proj.desc}
                                    onChange={e => handleProjectChange(idx, 'desc', e.target.value)}
                                    className={projectInputClasses}
                                />
                                <input
                                    type="text"
                                    placeholder="Link"
                                    value={proj.links}
                                    onChange={e => handleProjectChange(idx, 'links', e.target.value)}
                                    className={projectInputClasses}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addProject}
                            className="text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200"
                        >
                            + Add Project
                        </button>
                    </div>

                    {/* Work */}
                    <div className="relative">
                        <Briefcase className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Work (comma separated)"
                            className={inputClasses}
                            value={userData.work}
                            onChange={e => handleChange('work', e.target.value)}
                        />
                    </div>

                    {/* Links */}
                    <div className="relative">
                        <LinkIcon className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Links (comma separated)"
                            className={inputClasses}
                            value={userData.links}
                            onChange={e => handleChange('links', e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}

export default withAuth(UserProfilePage,'user');
