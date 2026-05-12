import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Building, Loader, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosClient';

export default function Signup({ mode = 'light' }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        company_name: '',
        address: '',
        age: '',
        dob: ''
    });
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
            await api.post('/users/register', formData);
            // Auto-login after signup
            const loginRes = await api.post('/users/login', {
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('userToken', loginRes.data.access_token);
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userEmail', formData.email);

            navigate("/");
            window.scrollTo(0, 0);
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen py-10 sm:py-16 px-1 sm:px-4 transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-2xl mx-auto p-5 sm:p-8 rounded-[1.75rem] sm:rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white'
                    }`}
            >
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 mb-4">
                        <LayoutGrid size={32} />
                    </div>
                    <h1 className={`text-2xl sm:text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Join BIM Mills<span className="text-blue-600">.</span>
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Create an account to manage your textile orders
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Account Details
                            </h3>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Full Name*</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Email Address*</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Password*</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="password"
                                        min={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-6">
                            <h3 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Profile Information
                            </h3>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Phone Number*</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Business Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                                    }`}
                                placeholder="Full delivery/billing address"
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
                                Create Account
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-200 border-white/10 text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
