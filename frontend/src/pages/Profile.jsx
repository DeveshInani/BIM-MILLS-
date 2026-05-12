import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Building, Loader, Save, CheckCircle } from 'lucide-react';
import api from '../api/axiosClient';

export default function Profile({ mode = 'light' }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const darkMode = mode === 'dark';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setUser(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/users/me', user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            localStorage.setItem('userName', user.name);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-12 sm:py-20 px-1 sm:px-4 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'
            }`}>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black mb-2">Account Settings<span className="text-blue-600">.</span></h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your profile and business details</p>
                </header>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}
                    >
                        {message.type === 'success' && <CheckCircle size={20} />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className={`p-6 rounded-3xl text-center ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white shadow-sm'}`}>
                            <div className="w-24 h-24 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center mx-auto mb-4 border-4 border-blue-500/20">
                                <span className="text-3xl font-black">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                            <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                                }`}>
                                User
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <motion.form
                            onSubmit={handleSave}
                            className={`p-5 sm:p-8 rounded-[1.75rem] sm:rounded-3xl ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white shadow-sm'}`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="name" value={user.name || ''} onChange={handleChange} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="phone" value={user.phone || ''} onChange={handleChange} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Age</label>
                                    <input name="age" type="number" value={user.age || ''} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">DOB</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="dob" type="date" value={user.dob || ''} onChange={handleChange} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Company Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input name="company_name" value={user.company_name || ''} onChange={handleChange} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Business Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                        <textarea name="address" rows={3} value={user.address || ''} onChange={handleChange} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-stretch sm:justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
}
