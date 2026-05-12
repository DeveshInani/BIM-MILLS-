import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = ({ mode = 'light' }) => {
    const darkMode = mode === 'dark';
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`transition-all duration-500 border-t ${darkMode ? 'bg-slate-950 border-blue-900/50 text-blue-100' : 'bg-white border-blue-100 text-gray-700'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

                    {/* Brand and About */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/images/logo.jpg" alt="BIM Mills Logo" className="h-12 w-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-blue-900'}`}>BIM MILLS</span>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}></span>
                            </div>
                        </Link>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-blue-300/80' : 'text-gray-600'}`}>
                            Premium textile manufacturer specializing in high-quality fabrics, corporate uniforms, and industrial workwear since 1995.
                        </p>
                        <div className="flex gap-4">
                            <a href="#!" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'}`}>
                                <Facebook size={18} />
                            </a>
                            <a href="#!" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'}`}>
                                <Instagram size={18} />
                            </a>
                            <a href="#!" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'}`}>
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className={`text-lg font-black mb-6 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'About Us', to: '/about' },
                                { label: 'Fabric Catalogue', to: '/products' },
                                { label: 'Ready-made Shop', to: '/shop' },
                                { label: 'Contact Us', to: '/contact' }
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className={`text-sm font-medium transition-all hover:translate-x-2 inline-block ${darkMode ? 'text-blue-400/80 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'}`}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Official Address */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                            <h4 className={`text-lg font-black mb-6 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Contact Us</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className={`w-6 h-6 mt-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <p className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                                        18/471, INDUSTRIAL ESTATE,<br />
                                        BEHIND SONYA MARUTI MANDIR,<br />
                                        ICHALKARANJI – 416115
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div className={`text-sm font-semibold ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                                        0230-2424470 / 9890915839
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div className={`text-sm font-semibold ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                                        vijayinani839@gmail.com
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-2xl p-6 ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50/50 border border-blue-100'}`}>
                            <Building2 className={`w-10 h-10 mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>BIM Mills Pvt. Ltd.</h5>
                            <p className={`text-xs leading-relaxed ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
                                Quality textile manufacturing partner for corporate, school and industrial solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className={`py-6 border-t ${darkMode ? 'border-blue-900/30' : 'border-blue-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
                    <p className={`text-xs font-medium ${darkMode ? 'text-blue-400/60' : 'text-gray-500'}`}>
                        &copy; {currentYear} BIM Mills Pvt. Ltd. All rights reserved.
                    </p>
                    <div className="flex flex-wrap gap-4 md:gap-8">
                        <Link to="/privacy" className={`text-xs font-medium ${darkMode ? 'text-blue-400/60 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'}`}>Privacy Policy</Link>
                        <Link to="/terms" className={`text-xs font-medium ${darkMode ? 'text-blue-400/60 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'}`}>Terms factor</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
