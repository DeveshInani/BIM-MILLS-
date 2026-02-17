import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Truck,
    Clock,
    AlertCircle,
    CheckCircle,
    X,
    ChevronDown,
    Filter,
    Search,
    Loader,
    MapPin,
    ExternalLink,
    Download,
    ShoppingBag,
    Box,
    CreditCard
} from 'lucide-react';
import api from '../api/axiosClient';

const trackingSteps = [
    { label: 'Order Placed', icon: Clock, id: 'placed' },
    { label: 'Processing', icon: Package, id: 'processing' },
    { label: 'Shipped', icon: Truck, id: 'shipped' },
    { label: 'In Transit', icon: Box, id: 'transit' },
    { label: 'Delivered', icon: CheckCircle, id: 'delivered' },
];

export default function MyOrders({ mode = 'light' }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, reason: '' });
    const darkMode = mode === 'dark';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            const res = await api.get('/api/orders');
            const userOrders = res.data.filter(o => o.user_email === email);
            setOrders(userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCancellation = async () => {
        if (!cancelModal.reason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        const { orderId, reason } = cancelModal;
        setCancellingId(orderId);
        setCancelModal({ ...cancelModal, open: false });

        try {
            await api.post(`/api/orders/${orderId}/request-cancellation`, {
                email: localStorage.getItem('userEmail'),
                reason: reason
            });
            alert('Cancellation request submitted successfully! Admin will review it.');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to request cancellation.');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusStep = (status) => {
        if (status === 'Cancelled') return -1;
        if (status === 'Delivered') return 4;
        if (status === 'Shipped') return 2;
        if (status === 'Active') return 1;
        return 0;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Pending Cancellation': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Active': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.product_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin text-blue-600 mb-4 mx-auto" size={48} />
                    <p className="font-bold tracking-widest uppercase text-xs opacity-50">Loading Orders</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-24 px-4 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-4"
                        >
                            <ShoppingBag size={14} />
                            Customer Portal
                        </motion.div>
                        <h1 className="text-5xl font-black tracking-tight mb-3">Your Orders<span className="text-blue-600">.</span></h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your purchases and track shipments in real-time</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className={`relative flex-1 sm:w-64 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl border border-blue-500/10 overflow-hidden`}>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none font-medium text-sm"
                            />
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border border-blue-500/10 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent text-sm font-black outline-none cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Pending Cancellation">Pending Cancellation</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </header>

                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-24 text-center rounded-[3rem] ${darkMode ? 'bg-gray-900 border border-white/5 shadow-2xl shadow-blue-900/10' : 'bg-white shadow-2xl shadow-gray-200'}`}
                    >
                        <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Package size={48} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-black mb-3">No orders found</h2>
                        <p className={`max-w-md mx-auto mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We couldn't find any orders matching your search or criteria. Ready to start your next project?</p>
                        <button
                            onClick={() => window.location.href = '/shop'}
                            className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20 flex items-center gap-3 mx-auto"
                        >
                            Explore Shop
                            <ChevronDown size={20} className="-rotate-90" />
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`overflow-hidden rounded-[2.5rem] transition-all duration-500 ${expandedOrder === order.id
                                    ? (darkMode ? 'bg-gray-900 border-blue-500/30' : 'bg-white shadow-2xl shadow-blue-500/10 scale-[1.02]')
                                    : (darkMode ? 'bg-gray-900/50 border-white/5' : 'bg-white shadow-sm hover:shadow-xl hover:scale-[1.005]')
                                    } border-2`}
                            >
                                {/* Header Card */}
                                <div
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    className="p-8 cursor-pointer relative"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                                                <Package size={28} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Order #ID</p>
                                                <div className="flex items-center gap-4">
                                                    <h3 className="text-2xl font-black tracking-tight">{order.id}</h3>
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Placed On</p>
                                                <p className="font-bold text-sm">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Amount</p>
                                                <p className="font-black text-lg">₹{order.amount?.toLocaleString()}</p>
                                            </div>
                                            <div className="hidden lg:block text-right">
                                                <motion.div
                                                    animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                                                    className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-gray-500/10"
                                                >
                                                    <ChevronDown size={20} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedOrder === order.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="border-t border-white/5"
                                        >
                                            <div className="p-8 lg:p-12 space-y-12">
                                                {/* Tracking Timeline */}
                                                <div className="relative pt-8 pb-4">
                                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-500/10 -translate-y-1/2"></div>
                                                    <div
                                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-1000"
                                                        style={{ width: `${(getStatusStep(order.status) / 4) * 100}%` }}
                                                    ></div>

                                                    <div className="relative flex justify-between">
                                                        {trackingSteps.map((step, idx) => {
                                                            const isCompleted = idx <= getStatusStep(order.status);
                                                            const isCurrent = idx === getStatusStep(order.status);
                                                            return (
                                                                <div key={idx} className="flex flex-col items-center text-center">
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${isCompleted ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : (darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400')
                                                                        } ${isCurrent ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}>
                                                                        <step.icon size={20} />
                                                                    </div>
                                                                    <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-blue-500' : 'text-gray-500'}`}>
                                                                        {step.label}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                    {/* Left: Product & Shipping */}
                                                    <div className="space-y-8">
                                                        <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50/50'}`}>
                                                            <div className="flex items-center gap-4 mb-6 text-blue-500">
                                                                <ShoppingBag size={18} />
                                                                <h4 className="text-xs font-black uppercase tracking-widest">Order Summary</h4>
                                                            </div>
                                                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                                                <span className="font-bold">{order.product_name}</span>
                                                                <span className="text-sm opacity-60">Qty: {order.quantity}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center pt-3">
                                                                <span className="font-bold">Total Paid</span>
                                                                <span className="text-lg font-black tracking-tight">₹{order.amount?.toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50/50'}`}>
                                                            <div className="flex items-center gap-4 mb-6 text-blue-500">
                                                                <MapPin size={18} />
                                                                <h4 className="text-xs font-black uppercase tracking-widest">Shipping Address</h4>
                                                            </div>
                                                            <p className="text-sm font-medium leading-relaxed opacity-80 max-w-xs uppercase">
                                                                {order.user_address || "Address not provided"}
                                                            </p>
                                                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
                                                                <Truck size={18} className="text-gray-400" />
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Carrier</p>
                                                                    <p className="text-xs font-bold uppercase tracking-widest italic">{order.status === 'Shipped' || order.status === 'Delivered' ? 'Delhivery Logistics' : 'Preparing for shipment'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Info & Actions */}
                                                    <div className="space-y-8">
                                                        <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50/50'}`}>
                                                            <div className="flex items-center gap-4 mb-6 text-blue-500">
                                                                <CreditCard size={18} />
                                                                <h4 className="text-xs font-black uppercase tracking-widest">Payment Info</h4>
                                                            </div>
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className="w-12 h-8 rounded bg-gray-500/20 flex items-center justify-center text-[10px] font-black italic">VISA</div>
                                                                <p className="text-sm font-bold opacity-60">•••• 4892</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500 italic">Paid on {new Date(order.created_at).toLocaleDateString()}</p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                                                                <Download size={16} />
                                                                Invoice
                                                            </button>
                                                            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition">
                                                                <ExternalLink size={16} />
                                                                Support
                                                            </button>
                                                        </div>

                                                        {order.status === 'Active' && order.cancellation_requested === 0 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCancelModal({ open: true, orderId: order.id, reason: '' });
                                                                }}
                                                                disabled={cancellingId === order.id}
                                                                className={`w-full py-4 rounded-2xl border-2 border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 ${cancellingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {cancellingId === order.id ? <Loader className="animate-spin" size={16} /> : <X size={16} />}
                                                                Cancel & Request Refund
                                                            </button>
                                                        )}

                                                        {order.cancellation_requested === 1 && (
                                                            <div className="flex flex-col gap-4 p-6 rounded-3xl bg-orange-500/10 border border-orange-500/30">
                                                                <div className="flex items-center gap-3 text-orange-500">
                                                                    <Clock size={20} className="animate-pulse" />
                                                                    <span className="text-xs font-black uppercase tracking-widest">Cancellation Pending Review</span>
                                                                </div>
                                                                {order.cancellation_reason && (
                                                                    <p className="text-[10px] opacity-60 italic">Your Reason: "{order.cancellation_reason}"</p>
                                                                )}
                                                                <p className="text-xs opacity-60 leading-relaxed italic">Our administrative team is currently reviewing your cancellation and refund request. You will be notified via email.</p>
                                                            </div>
                                                        )}

                                                        {order.cancellation_note && (
                                                            <div className="p-6 rounded-3xl bg-gray-500/10 border border-gray-500/30">
                                                                <div className="flex items-center gap-3 text-gray-500 mb-2">
                                                                    <AlertCircle size={20} />
                                                                    <span className="text-xs font-black uppercase tracking-widest text-blue-500">Important Update</span>
                                                                </div>
                                                                <p className="text-xs font-medium italic opacity-80 leading-relaxed">"{order.cancellation_note}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancellation Modal */}
            <AnimatePresence>
                {cancelModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCancelModal({ ...cancelModal, open: false })}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-lg p-8 rounded-[2.5rem] border shadow-2xl ${darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'}`}
                        >
                            <h2 className="text-2xl font-black mb-2">Request Cancellation</h2>
                            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please tell us why you would like to cancel your order. This helps us improve our service.</p>

                            <textarea
                                value={cancelModal.reason}
                                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                                placeholder="Example: Changed my mind, found a better price elsewhere, accidentally ordered wrong quantity..."
                                rows={4}
                                className={`w-full p-6 rounded-3xl border-2 outline-none transition-all ${darkMode ? 'bg-gray-800 border-white/5 focus:border-blue-500 text-white' : 'bg-gray-50 border-gray-100 focus:border-blue-500'
                                    }`}
                            ></textarea>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => setCancelModal({ ...cancelModal, open: false })}
                                    className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 ${darkMode ? 'border-white/10' : 'border-gray-100'}`}
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleRequestCancellation}
                                    className="py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
