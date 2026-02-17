import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosClient';

export default function Login({ mode = 'light' }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const darkMode = mode === 'dark';
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect') || '/shop';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/users/login', formData);
            const { access_token } = response.data;

            localStorage.setItem('userToken', access_token);

            // Fetch user info to get name
            const userRes = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            localStorage.setItem('userName', userRes.data.name);
            localStorage.setItem('userEmail', userRes.data.email);

            navigate(redirectPath);
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-20 px-4 transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white'
                    }`}
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome Back<span className="text-blue-600">.</span>
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Login to access your dashboard and orders
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                    }`}
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <Link to="#" className="text-sm font-bold text-blue-600 hover:text-blue-500">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                    }`}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : (
                            <>
                                Sign In
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-200 border-white/10 text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                            Create one for free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
