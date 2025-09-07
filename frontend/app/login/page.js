"use client"
import React, { useState } from 'react';
import { Mail, Lock, Users, LogIn } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;
            setMessage({ type: 'success', text: 'Login successful!' });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed!';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // Dummy login handlers
    const loginDummyUser = () => {
        setEmail('devesh@gmail.com');
        setPassword('Test@1234');
       
    };

    const loginDummyAdmin = () => {
        setEmail('admin@gmail.com');
        setPassword('Test@1234');
    };

    const inputClasses =
        "w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-300 ease-in-out shadow-sm";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

    return (
        <div className="flex items-center justify-center min-h-screen font-sans p-4 bg-gray-50 text-gray-800">
            <div className="relative z-10 p-8 rounded-3xl w-full max-w-xl bg-white shadow-xl ring-1 ring-gray-200/50 animate-fadeInUp">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-sky-100 p-4 rounded-full mb-4 animate-float">
                        <LogIn size={48} className="text-sky-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-wide">Welcome Back!</h1>
                    <p className="text-gray-600 text-sm">Sign in to your account</p>
                </div>

                {message.text && (
                    <div
                        className={`p-4 mb-6 rounded-xl text-center font-medium transition-opacity duration-300 ${
                            message.type === 'success'
                                ? 'bg-green-200 text-green-800 ring-1 ring-green-500'
                                : 'bg-red-200 text-red-800 ring-1 ring-red-500'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div className="relative">
                        <Mail className={iconClasses} />
                        <input
                            type="email"
                            id="email"
                            className={inputClasses}
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className={iconClasses} />
                        <input
                            type="password"
                            id="password"
                            className={inputClasses}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                {/* Dummy Login Buttons */}
                <div className="mt-4 flex gap-4 justify-center">
                    <button
                        onClick={loginDummyUser}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                    >
                        Dummy User
                    </button>
                    <button
                        onClick={loginDummyAdmin}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                    >
                        Dummy Admin
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="font-semibold leading-6 text-sky-600 hover:text-sky-800 transition-colors"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default App;
