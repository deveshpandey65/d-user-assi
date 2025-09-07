'use client'
import withAuth from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { User, Search, BookOpen, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [topSkills, setTopSkills] = useState([]);
    const [querySkill, setQuerySkill] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10); // items per page

    useEffect(() => {
        fetchUsers(page);
        fetchTopSkills();
    }, [page]);

    const fetchUsers = async (currentPage = 1) => {
        setLoading(true);
        try {
            let url = `/user/getall?page=${currentPage}&limit=${limit}`;

            if (querySkill) {
                url = `/user/projects?skills=${encodeURIComponent(querySkill)}&page=${currentPage}&limit=${limit}`;
            } else if (searchTerm) {
                url = `/user/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`;
            }

            const res = await api.get(url);
            const data = res.data;

            setUsers(data.users || []);
            setPage(data.page || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch users' });
        } finally {
            setLoading(false);
        }
    };

    const fetchTopSkills = async () => {
        try {
            const res = await api.get('/user/skills/top');
            setTopSkills(res.data.skills || []);
        } catch (err) {
            console.error('Failed to fetch top skills');
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchUsers(1);
    };

    const handleFilterBySkill = () => {
        setPage(1);
        fetchUsers(1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Logout functionality
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-300 ease-in-out shadow-sm";
    const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

    return (
        <div className="p-8 min-h-screen bg-gray-50 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                {/* Header with Logout */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-wide">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage users and view skill trends at a glance.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        title="Logout"
                    >
                        <LogOut className="mr-2" /> Logout
                    </button>
                </div>

                {message.text && (
                    <div className={`p-4 mb-6 rounded-xl text-center font-medium transition-opacity duration-300 ${message.type === 'success'
                        ? 'bg-green-200 text-green-800 ring-1 ring-green-500'
                        : 'bg-red-200 text-red-800 ring-1 ring-red-500'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Search and Skill Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-xl shadow-md">
                    <div className="relative flex-grow">
                        <Search className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className={inputClasses}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="flex-shrink-0 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-lg"
                    >
                        Search
                    </button>
                    <div className="relative flex-grow">
                        <BookOpen className={iconClasses} />
                        <input
                            type="text"
                            placeholder="Filter by skill..."
                            className={inputClasses}
                            value={querySkill}
                            onChange={e => setQuerySkill(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleFilterBySkill}
                        className="flex-shrink-0 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-lg"
                    >
                        Filter
                    </button>
                </div>

                {/* Top Skills */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {topSkills.length === 0 ? (
                            <span className="text-gray-500">No skills available</span>
                        ) : (
                            topSkills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                                >
                                    {skill._id} ({skill.count})
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 uppercase text-sm text-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Name</th>
                                    <th className="px-6 py-3 font-semibold">Email</th>
                                    <th className="px-6 py-3 font-semibold">Skills</th>
                                    <th className="px-6 py-3 font-semibold">Education</th>
                                    <th className="px-6 py-3 font-semibold">Work</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8">
                                            <div className="flex justify-center items-center">
                                                <svg className="animate-spin h-6 w-6 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="ml-3 text-gray-600">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {Array.isArray(user.skills)
                                                    ? user.skills.map(s => (typeof s === 'string' ? s : s._id || '')).join(', ')
                                                    : ''}
                                            </td>
                                            <td className="px-6 py-4">{user.education || ''}</td>
                                            <td className="px-6 py-4">
                                                {Array.isArray(user.work) ? user.work.join(', ') : ''}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || loading}
                        className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="mr-1 h-5 w-5" /> Previous
                    </button>
                    <span className="text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages || loading}
                        className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight className="ml-1 h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default withAuth(AdminDashboard, 'admin');
