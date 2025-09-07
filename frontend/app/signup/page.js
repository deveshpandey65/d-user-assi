"use client"
import React, { useState } from 'react';
import { User, Mail, Lock, Users, UserPlus, BookOpen, Briefcase, Link as LinkIcon, Code } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

const App = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');
    const [projects, setProjects] = useState([{ title: '', desc: '', links: '' }]);
    const [work, setWork] = useState('');
    const [links, setLinks] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    // Add Project dynamically
    const handleProjectChange = (index, field, value) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    const addProject = () => {
        setProjects([...projects, { title: '', desc: '', links: '' }]);
    };

    // Signup
    const onFinish = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (!name || !email || !password) {
                setMessage({ type: 'error', text: 'Name, email and password are required' });
                setLoading(false);
                return;
            }

            // prepare request body
            let payload = { name, email, password, role };

            if (role === "user") {
                payload.education = education;
                payload.skills = skills.split(',').map(s => s.trim()); // convert to array
                payload.projects = projects.filter(p => p.title); // only non-empty
                payload.work = work ? work.split(',').map(w => w.trim()) : [];
                payload.links = links ? links.split(',').map(l => l.trim()) : [];
            }

            await api.post("/auth/signup", payload);

            setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });
            router.push('/login');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Signup failed';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-300 ease-in-out shadow-sm";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";
    const projectInputClasses = "w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-sky-500 transition-colors duration-200";

    return (
        <div className="flex items-center justify-center min-h-screen font-sans p-4 bg-gray-50 text-gray-800">
            <div className="relative z-10 p-8 rounded-3xl w-full max-w-xl bg-white shadow-xl ring-1 ring-gray-200/50 animate-fadeInUp">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-sky-100 p-4 rounded-full mb-4 animate-float">
                        <UserPlus size={48} className="text-sky-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-wide">Create Account</h1>
                    <p className="text-gray-600 text-sm">Join our network and build your profile.</p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-xl text-center font-medium transition-opacity duration-300 ${message.type === 'success'
                        ? 'bg-green-200 text-green-800 ring-1 ring-green-500'
                        : 'bg-red-200 text-red-800 ring-1 ring-red-500'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={onFinish} className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                        <User className={iconClasses} />
                        <input type="text" placeholder="Full Name"
                            className={inputClasses}
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className={iconClasses} />
                        <input type="email" placeholder="Email"
                            className={inputClasses}
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className={iconClasses} />
                        <input type="password" placeholder="Password"
                            className={inputClasses}
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {/* Role */}
                    <div className="relative">
                        <Users className={iconClasses} />
                        <select value={role} onChange={(e) => setRole(e.target.value)}
                            className={inputClasses}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Extra fields only for User */}
                    {role === "user" && (
                        <div className="space-y-6 animate-fadeIn transition-opacity duration-500">
                            {/* Education */}
                            <div className="relative">
                                <BookOpen className={iconClasses} />
                                <input type="text" placeholder="Education"
                                    className={inputClasses}
                                    value={education} onChange={(e) => setEducation(e.target.value)} />
                            </div>

                            {/* Skills */}
                            <div className="relative">
                                <Code className={iconClasses} />
                                <input type="text" placeholder="Skills (comma separated)"
                                    className={inputClasses}
                                    value={skills} onChange={(e) => setSkills(e.target.value)} />
                            </div>

                            {/* Projects */}
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-2">Projects</p>
                                {projects.map((proj, idx) => (
                                    <div key={idx} className="space-y-3 mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                                        <input type="text" placeholder="Title"
                                            value={proj.title} onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                                            className={projectInputClasses} />
                                        <input type="text" placeholder="Description"
                                            value={proj.desc} onChange={(e) => handleProjectChange(idx, 'desc', e.target.value)}
                                            className={projectInputClasses} />
                                        <input type="text" placeholder="Link"
                                            value={proj.links} onChange={(e) => handleProjectChange(idx, 'links', e.target.value)}
                                            className={projectInputClasses} />
                                    </div>
                                ))}
                                <button type="button" onClick={addProject}
                                    className="text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200">+ Add Project</button>
                            </div>

                            {/* Work */}
                            <div className="relative">
                                <Briefcase className={iconClasses} />
                                <input type="text" placeholder="Work (comma separated)"
                                    className={inputClasses}
                                    value={work} onChange={(e) => setWork(e.target.value)} />
                            </div>

                            {/* Links */}
                            <div className="relative">
                                <LinkIcon className={iconClasses} />
                                <input type="text" placeholder="Links (comma separated)"
                                    className={inputClasses}
                                    value={links} onChange={(e) => setLinks(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105">
                        {loading ? 'Signing Up...' : 'Signup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
