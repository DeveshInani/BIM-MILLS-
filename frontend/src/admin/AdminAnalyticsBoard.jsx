import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Mail,
  CreditCard,
  LogOut,
  Plus,
  Search,
  Bell,
  MoreVertical,
  CheckCircle,
  X,
  Trash2,
  Edit2,
  Send,
  Loader,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Users,
  Layers,
  FileText,
  Receipt,
  HandCoins,
  Download,
  Printer,
  Building2
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import api from '../api/axiosClient';

export default function AdminBoard({ mode = 'light' }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const darkMode = mode === 'dark';
  // Shared refresh key for cross-view updates
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler to trigger refresh across views
  const triggerGlobalRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-8 border-b z-10 relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardView darkMode={darkMode} />}
          {activeTab === 'products' && <ProductsView darkMode={darkMode} />}
          {activeTab === 'email' && <EmailView darkMode={darkMode} />}
          {activeTab === 'billing' && <BillingView darkMode={darkMode} />}
          {activeTab === 'employees' && <EmployeesView darkMode={darkMode} />}
          {activeTab === 'fabrics' && <FabricsView darkMode={darkMode} />}
          {activeTab === 'payments' && <PaymentManagementView darkMode={darkMode} />}
          {activeTab === 'vendor-payments' && <VendorPaymentsView darkMode={darkMode} refreshKey={refreshKey} triggerGlobalRefresh={triggerGlobalRefresh} />}
        </main>
      </div>
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ activeTab, setActiveTab, darkMode }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', icon: ShoppingBag, label: 'Products' },
    { id: 'email', icon: Mail, label: 'Email Center' },
    { id: 'fabrics', icon: Layers, label: 'Fabrics Catalogue' },
    { id: 'payments', icon: Receipt, label: 'Customer Invoices' },
    { id: 'vendor-payments', icon: HandCoins, label: 'Vendor Payments' },
    { id: 'billing', icon: CreditCard, label: 'Billing & Plan' },
    { id: 'employees', icon: Users, label: 'Employees' },
  ];

  return (
    <aside className={`w-64 flex flex-col ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
      <div className="h-16 flex items-center px-8 border-b border-gray-700/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          BIM Mills
        </h1>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : darkMode
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700/10">
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
          }`}>
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// --- Dashboard View (Adapted from original AdminAnalytics) ---
function DashboardView({ darkMode }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete/Cancel states
  const [deleteConfirm, setDeleteConfirm] = useState(null); // {id, name, isRequest}
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch function
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [salesRes, ordersRes] = await Promise.all([
        api.get('/api/sales/analytics'),
        api.get('/api/orders/')
      ]);
      setAnalyticsData(salesRes.data);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      await api.delete(`/api/orders/${deleteConfirm.id}`);

      // Update local state
      setOrders(orders.filter(o => o.id !== deleteConfirm.id));

      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteConfirm(null);
        setDeleteSuccess(false);
      }, 3000);

      // Refresh filtered data
      fetchData();

    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to cancel order');
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  // Get active cancellation requests
  const cancellationRequests = orders.filter(o => o.cancellation_requested === 1);

  const chartData = (analyticsData?.sales_by_day || []).map(item => ({
    name: item.day,
    sales: item.amount
  }));

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="animate-spin w-8 h-8 text-blue-500" /></div>;

  return (
    <div className="space-y-6">

      {/* Cancellation Requests Notification */}
      {cancellationRequests.length > 0 && (
        <div className={`rounded-xl p-6 border-l-4 shadow-sm animate-pulse ${darkMode
          ? 'bg-yellow-900/30 border-yellow-500 text-yellow-200'
          : 'bg-yellow-50 border-yellow-400 text-yellow-900'
          }`}>
          <div className="flex items-center gap-4">
            <Bell className="w-8 h-8 flex-shrink-0 text-yellow-500" />
            <div className="flex-1">
              <h3 className="font-bold text-xl">⚠️ Cancellation Requests Pending</h3>
              <p className="mt-1 font-medium">{cancellationRequests.length} order(s) requested cancellation and need your approval.</p>
            </div>
            <button
              onClick={() => document.getElementById('recent-orders-table').scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              View Orders
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${analyticsData?.total_revenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          trend="+12.5%"
          positive
          darkMode={darkMode}
        />
        <StatCard
          title="Total Orders"
          value={analyticsData?.total_orders || 0}
          icon={ShoppingCart}
          trend="+8.2%"
          positive
          darkMode={darkMode}
        />
        <StatCard
          title="Avg. Order Value"
          value={`₹${analyticsData?.total_orders ? Math.round(analyticsData.total_revenue / analyticsData.total_orders) : 0}`}
          icon={TrendingUp}
          trend="-2.1%"
          positive={false}
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className={`col-span-2 p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-6">Revenue Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length ? chartData : [{ name: 'No Data', sales: 0 }]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#fff' : '#000'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders - Small List */}
        <div className={`col-span-1 p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{order.user_name || 'Guest User'}</p>
                  <p className="text-xs text-gray-500 truncate">{order.product_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{order.amount}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-500">No recent orders</p>}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div id="recent-orders-table" className={`rounded-2xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <button onClick={fetchData} className="text-sm text-blue-500 hover:underline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {orders.sort((a, b) => {
                // Sort requests to top
                if (a.cancellation_requested === 1 && b.cancellation_requested !== 1) return -1;
                if (a.cancellation_requested !== 1 && b.cancellation_requested === 1) return 1;
                return b.id - a.id;
              }).slice(0, 20).map((order) => (
                <tr key={order.id} className={`${order.cancellation_requested === 1
                  ? darkMode ? 'bg-yellow-900/20 hover:bg-yellow-900/30' : 'bg-yellow-50 hover:bg-yellow-100'
                  : darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                  }`}>
                  <td className="px-6 py-4 font-medium text-blue-500">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{order.user_name || 'Guest'}</span>
                      <span className="text-xs text-gray-500">{order.user_phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.product_name || 'Item'}</td>
                  <td className="px-6 py-4 font-bold">₹{order.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {order.cancellation_requested === 1 ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold animate-pulse">
                        Requested ⚠️
                      </span>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Completed' || !order.status
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status || 'Active'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.cancellation_requested === 1 && (
                      <button
                        onClick={() => setDeleteConfirm({ id: order.id, name: order.user_name, isRequest: true })}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        Approve Cancel
                      </button>
                    )}
                    {order.cancellation_requested !== 1 && (
                      <button onClick={() => setDeleteConfirm({ id: order.id, name: order.user_name, isRequest: false })} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 mt-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

            {deleteSuccess ? (
              // Success State
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                  <CheckCircle className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✅ Order Cancelled
                </h3>
                <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Order <strong>#{deleteConfirm.id}</strong> has been cancelled.
                </p>
              </div>
            ) : (
              // Confirmation State
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {deleteConfirm.isRequest ? '⚠️ Approve Cancellation?' : 'Cancel Order?'}
                  </h3>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Are you sure you want to cancel Order <strong>#{deleteConfirm.id}</strong>{deleteConfirm.name ? ` from ${deleteConfirm.name}` : ''}?
                </p>

                {deleteConfirm.isRequest && (
                  <p className={`mb-6 p-3 rounded-lg text-sm ${darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                    📧 This will approve the user's request and delete the order.
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={deleting}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? 'Processing...' : 'Yes, Cancel Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// --- Products View ---
function ProductsView({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '', quality: '', collection: '' });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', price: '', quantity: '', quality: '', collection: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Product Management</h3>
        <button
          onClick={() => { setEditingId(null); setFormData({ name: '', price: '', quantity: '', quality: '', collection: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className={`overflow-hidden rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Quality</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {products.map((p) => (
              <tr key={p.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">₹{p.price?.toLocaleString()}</td>
                <td className="px-6 py-4">{p.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.quality}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl mt-16 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 500 units"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quality/Grade</label>
                <input
                  required
                  value={formData.quality}
                  onChange={e => setFormData({ ...formData, quality: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Email View ---
function EmailView({ darkMode }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/admin/send-email', { to_email: to, subject, body });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setTo('');
      setSubject('');
      setBody('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`p-8 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-500" />
          Compose Email
        </h3>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            Email sent successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 dark:bg-red-900/30 dark:text-red-400">
            <CheckCircle className="w-5 h-5" />
            Failed to send email. Check console.
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">To Recipient</label>
            <input
              required
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="client@example.com"
              className={`w-full p-4 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className={`w-full p-4 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message Body (HTML Supported)</label>
            <textarea
              required
              rows={8}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="<p>Hello,</p><br/>Write your message here..."
              className={`w-full p-4 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === 'sending' ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              {status === 'sending' ? 'Sending...' : 'Send Custom Email'}
            </button>
          </div>
        </form>
      </div>

      <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-900/10 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
        <h4 className="font-bold text-blue-500 mb-2">💡 Pro Tip</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You can use standard HTML tags like &lt;b&gt;, &lt;h1&gt;, and &lt;img&gt; in the message body to create rich, beautifully formatted emails.
        </p>
      </div>
    </div>
  );
}

// --- Billing View ---
function BillingView({ darkMode }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/billing').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500">Loading billing info...</div>;

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-2xl shadow-sm ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 mb-1">Current Plan</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {data.subscription_plan}
            </h2>
            <p className="text-sm text-gray-400 mt-2">Next billing date: <b>{data.next_billing_date}</b></p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
            Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            Payment Method
          </h3>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-700/50">
            <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div>
              <p className="font-semibold">{data.payment_method}</p>
              <p className="text-xs text-gray-500">Default method</p>
            </div>
            <button className="ml-auto text-sm text-blue-500 font-medium">Edit</button>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="font-bold mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Orders Processed</span>
              <span className="font-semibold">{data.usage_stats.total_orders_processed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Revenue Handled</span>
              <span className="font-semibold">₹{data.usage_stats.total_revenue_processed?.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="font-bold">Invoice History</h3>
        </div>
        <table className="w-full text-sm">
          <thead className={darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Invoice ID</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {data.invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                <td className="px-6 py-4 font-medium">{inv.id}</td>
                <td className="px-6 py-4">₹{inv.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Employees View ---
function EmployeesView({ darkMode }) {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: '', salary: '' });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/employees/${editingId}`, formData);
      } else {
        await api.post('/admin/employees', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', position: '', salary: '' });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Employee Management</h3>
        <button
          onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', position: '', salary: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      <div className={`overflow-hidden rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Position</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Salary</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {employees.map((emp) => (
              <tr key={emp.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 font-medium">{emp.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {emp.position || 'Employee'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>{emp.email}</span>
                    <span className="text-xs">{emp.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">₹{emp.salary?.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData(emp);
                        setEditingId(emp.id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Employee' : 'New Employee'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <input
                    required
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Manager"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Fabrics View ---
function FabricsView({ darkMode }) {
  const [fabrics, setFabrics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    quality: '',
    image: '',
    file: '',
    category: '',
    features: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchFabrics = async () => {
    try {
      const res = await api.get('/admin/fabrics');
      setFabrics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/fabrics/${editingId}`, formData);
      } else {
        await api.post('/admin/fabrics', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', price: '', quantity: '', quality: '', image: '', file: '', category: '', features: '' });
      setEditingId(null);
      fetchFabrics();
    } catch (err) {
      console.error(err);
      alert('Failed to save fabric');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fabric) => {
    setFormData(fabric);
    setEditingId(fabric.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/fabrics/${id}`);
      fetchFabrics();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', quantity: '', quality: '', image: '', file: '', category: '', features: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Fabric Catalogue</h3>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Fabric
        </button>
      </div>

      <div className={`overflow-hidden rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Quality</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {fabrics.map((f) => (
              <tr key={f.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {f.image ? (
                      <img src={f.image} alt={f.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm">{f.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                          {f.category || 'Fabric'}
                        </span>
                        {f.file && (
                          <a href={f.file} target="_blank" rel="noreferrer" className="text-[10px] flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline">
                            <FileText className="w-3 h-3" />
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">₹{f.price?.toLocaleString()}</td>
                <td className="px-6 py-4">{f.quantity || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">{f.quality}</div>
                  {f.features && (
                    <div className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={f.features}>
                      {f.features}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(f)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {fabrics.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Layers className="w-12 h-12 text-gray-300" />
                  <p>No fabrics in catalogue yet</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Fabric' : 'New Fabric'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Fabric Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Shirting, Suiting"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">PDF Catalog Link</label>
                  <input
                    value={formData.file}
                    onChange={e => setFormData({ ...formData, file: e.target.value })}
                    placeholder="bimmills_catalogue/file.pdf"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock/Quantity</label>
                  <input
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 1000 meters"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quality/Grade</label>
                  <input
                    value={formData.quality}
                    onChange={e => setFormData({ ...formData, quality: e.target.value })}
                    placeholder="e.g. Premium Cotton"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                  <input
                    value={formData.features}
                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                    placeholder="e.g. Wrinkle-Free, Anti-pilling, Breathable"
                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                {loading ? 'Saving...' : 'Save Fabric'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Payment Management View (Customer Invoices) ---
function PaymentManagementView({ darkMode }) {
    // Send Invoice Email Handler
    const handleSendInvoiceEmail = async (invoice) => {
      let subject = `Invoice #${invoice.invoice_number} from BIM Mills`;
      let body = `<p>Dear ${invoice.customer_name},</p>`;
      if (invoice.payment_status === 'Pending') {
        body += `<p>Please find your invoice attached. Kindly pay the amount of <b>₹${invoice.total_amount?.toLocaleString()}</b> at your earliest convenience.</p>`;
      } else if (invoice.payment_status === 'Overdue') {
        body += `<p><b>Overdue Notice:</b> Your payment for invoice <b>#${invoice.invoice_number}</b> is overdue. Please pay <b>₹${invoice.total_amount?.toLocaleString()}</b> immediately to avoid service interruption.</p>`;
      } else {
        body += `<p>Your invoice is attached for your records.</p>`;
      }
      body += `<p>Thank you,<br/>BIM Mills Team</p>`;
      try {
        await api.post('/admin/send-email', {
          to_email: invoice.customer_email,
          subject,
          body
        });
        alert('Invoice email sent successfully!');
      } catch (err) {
        alert('Failed to send invoice email.');
        console.error(err);
      }
    };
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [taxRate, setTaxRate] = useState(18); // Default GST
  const [invoiceStatus, setInvoiceStatus] = useState('Pending'); // Admin sets status

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/api/invoices/');
      setInvoices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedOrderId) return;
    try {
      await api.post('/api/invoices/generate', {
        order_id: selectedOrderId,
        tax_rate: taxRate,
        payment_method: 'Online Payment',
        payment_status: invoiceStatus // Admin sets status
      });
      setGenerateModalOpen(false);
      setSelectedOrderId(null);
      setInvoiceStatus('Pending'); // Reset to default
      fetchInvoices();
      alert('Invoice generated successfully!');
    } catch (err) {
      console.error('Failed to generate invoice', err);
      alert('Failed to generate invoice');
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await api.put(`/api/invoices/${invoiceId}/status`, { status: newStatus });
      fetchInvoices(); // Refresh list
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="animate-spin w-8 h-8 text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="w-6 h-6 text-blue-500" />
          Customer Invoices & Payments
        </h3>
        <button
          onClick={() => setGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Invoices"
          value={invoices.length}
          icon={FileText}
          trend=""
          positive={true}
          darkMode={darkMode}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toLocaleString()}`}
          icon={DollarSign}
          trend=""
          positive={true}
          darkMode={darkMode}
        />
        <StatCard
          title="Paid Invoices"
          value={invoices.filter(inv => inv.payment_status === 'Paid').length}
          icon={CheckCircle}
          trend=""
          positive={true}
          darkMode={darkMode}
        />
      </div>

      {/* Invoices Table */}
      <div className={`rounded-2xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-bold">All Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Invoice #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-blue-500">{invoice.invoice_number}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{invoice.customer_name}</div>
                      <div className="text-xs text-gray-500">{invoice.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">#{invoice.order_id}</td>
                  <td className="px-6 py-4 font-bold">₹{invoice.total_amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={invoice.payment_status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer ${
                        invoice.payment_status === 'Paid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : invoice.payment_status === 'Overdue'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handlePrintInvoice(invoice)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20"
                      title="View/Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendInvoiceEmail(invoice)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg dark:hover:bg-green-900/20"
                      title="Send Invoice Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">No invoices found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {generateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl mt-16 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10">
              <h3 className="text-xl font-bold">Generate Invoice</h3>
              <button onClick={() => setGenerateModalOpen(false)} className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Order</label>
                <select
                  value={selectedOrderId || ''}
                  onChange={(e) => setSelectedOrderId(parseInt(e.target.value))}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <option value="">-- Select Order --</option>
                  {orders.filter(o => o.amount && !invoices.find(inv => inv.order_id === o.id)).map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.user_name} - ₹{order.amount}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status *</label>
                <select
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <button
                onClick={handleGenerateInvoice}
                disabled={!selectedOrderId}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Template Modal */}
      {isInvoiceModalOpen && selectedInvoice && (
        <InvoiceTemplate invoice={selectedInvoice} darkMode={darkMode} onClose={() => setIsInvoiceModalOpen(false)} />
      )}
    </div>
  );
}

// --- Invoice Template Component ---
function InvoiceTemplate({ invoice, darkMode, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Create a new window for printing/downloading
    const printWindow = window.open('', '_blank');
    const invoiceContent = document.getElementById('invoice-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            @media print {
              @page {
                margin: 0.5cm;
              }
              body { margin: 0; }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #000;
              background: #fff;
            }
            .invoice-header {
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .invoice-title {
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .invoice-number {
              font-size: 14px;
              color: #666;
              margin-top: 10px;
            }
            .billing-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .billing-info h3 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            .total-section {
              text-align: right;
              margin-bottom: 30px;
            }
      </html>
    `);
    
    printWindow.document.close();
    
    // Trigger print dialog (which also allows saving as PDF)
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className={`w-full max-w-4xl rounded-2xl p-8 shadow-2xl mt-16 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} my-8`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Invoice</h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              title="Download/Print PDF"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="Print"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>
        </div>
        
        {/* Invoice Content - Printable */}
        <div className={`p-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-2 border-gray-200`} id="invoice-content">
          {/* Header */}
          <div className="mb-8 pb-6 border-b-2 border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  BIM Mills
                </h1>
                <p className="text-gray-600 mt-2">Textile Manufacturing Company</p>
                <p className="text-sm text-gray-500 mt-1">123 Industrial Area, Textile City</p>
                <p className="text-sm text-gray-500">Phone: +91-9876543210 | Email: info@bimmills.com</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
                <p className="text-sm text-gray-500 mt-2">Invoice #: {invoice.invoice_number}</p>
                <p className="text-sm text-gray-500">Date: {new Date(invoice.issue_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Bill To:</h3>
              <p className="font-medium">{invoice.customer_name}</p>
              {invoice.customer_address && <p className="text-sm text-gray-600">{invoice.customer_address}</p>}
              {invoice.customer_email && <p className="text-sm text-gray-600">{invoice.customer_email}</p>}
              {invoice.customer_phone && <p className="text-sm text-gray-600">Phone: {invoice.customer_phone}</p>}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Payment Details:</h3>
              <p className="text-sm">Payment Status: <span className="font-bold text-green-600">{invoice.payment_status}</span></p>
              {invoice.payment_method && <p className="text-sm">Method: {invoice.payment_method}</p>}
              {invoice.due_date && <p className="text-sm">Due Date: {new Date(invoice.due_date).toLocaleDateString()}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b-2 border-gray-300`}>
                  <th className="p-3 text-left font-bold">Item</th>
                  <th className="p-3 text-left font-bold">Quantity</th>
                  <th className="p-3 text-left font-bold">Quality</th>
                  <th className="p-3 text-right font-bold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3">{invoice.product_name || 'Product'}</td>
                  <td className="p-3">{invoice.quantity || '-'}</td>
                  <td className="p-3">{invoice.quality || '-'}</td>
                  <td className="p-3 text-right">₹{invoice.subtotal?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal?.toLocaleString()}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                    <span className="font-medium">₹{invoice.tax_amount?.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                <span className="text-lg font-bold">Total Amount:</span>
                <span className="text-lg font-bold text-blue-600">₹{invoice.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-2">For any queries, please contact us at info@bimmills.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Vendor Payments View ---
function VendorPaymentsView({ darkMode, refreshKey, triggerGlobalRefresh }) {
  const [vendors, setVendors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    name: '', company_name: '', contact_person: '', email: '', phone: '',
    address: '', vendor_type: '', gstin: '', pan: '', bank_account: '',
    bank_name: '', ifsc_code: '', notes: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    vendor_id: '', description: '', amount: '', payment_method: '',
    due_date: '', status: 'Pending', reference_number: '', bill_reference: '', notes: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      const [vendorsRes, paymentsRes] = await Promise.all([
        api.get('/api/vendors/'),
        api.get('/api/vendor-payments/')
      ]);
      setVendors(vendorsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await api.put(`/api/vendors/${editingVendor.id}`, vendorForm);
      } else {
        await api.post('/api/vendors/', vendorForm);
      }
      setIsVendorModalOpen(false);
      setEditingVendor(null);
      setVendorForm({ name: '', company_name: '', contact_person: '', email: '', phone: '', address: '', vendor_type: '', gstin: '', pan: '', bank_account: '', bank_name: '', ifsc_code: '', notes: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to save vendor', err);
      alert('Failed to save vendor');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        ...paymentForm,
        vendor_id: parseInt(paymentForm.vendor_id),
        amount: parseFloat(paymentForm.amount),
        due_date: paymentForm.due_date ? new Date(paymentForm.due_date).toISOString() : null
      };
      let updatedToPaid = false;
      if (editingPayment) {
        const prevStatus = editingPayment.status;
        await api.put(`/api/vendor-payments/${editingPayment.id}`, paymentData);
        if (prevStatus !== 'Paid' && paymentData.status === 'Paid') {
          updatedToPaid = true;
        }
      } else {
        await api.post('/api/vendor-payments/', paymentData);
      }
      setIsPaymentModalOpen(false);
      setEditingPayment(null);
      setPaymentForm({ vendor_id: '', description: '', amount: '', payment_method: '', due_date: '', status: 'Pending', reference_number: '', bill_reference: '', notes: '' });
      fetchData();
      if (updatedToPaid) {
        triggerGlobalRefresh();
      }
    } catch (err) {
      console.error('Failed to save payment', err);
      alert('Failed to save payment');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="animate-spin w-8 h-8 text-blue-500" /></div>;

  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <HandCoins className="w-6 h-6 text-green-500" />
          Vendor & Dealer Payments
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditingVendor(null); setVendorForm({ name: '', company_name: '', contact_person: '', email: '', phone: '', address: '', vendor_type: '', gstin: '', pan: '', bank_account: '', bank_name: '', ifsc_code: '', notes: '' }); setIsVendorModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Vendor
          </button>
          <button
            onClick={() => { setEditingPayment(null); setPaymentForm({ vendor_id: '', description: '', amount: '', payment_method: '', due_date: '', status: 'Pending', reference_number: '', bill_reference: '', notes: '' }); setIsPaymentModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Vendors" value={vendors.length} icon={Building2} trend="" positive={true} darkMode={darkMode} />
        <StatCard title="Pending Payments" value={`₹${totalPending.toLocaleString()}`} icon={DollarSign} trend="" positive={false} darkMode={darkMode} />
        <StatCard title="Total Paid" value={`₹${totalPaid.toLocaleString()}`} icon={CheckCircle} trend="" positive={true} darkMode={darkMode} />
      </div>

      {/* Tabs */}
      <div className={`rounded-2xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-bold">Payment Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Payment #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {payments.map((payment) => (
                <tr key={payment.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-blue-500">{payment.payment_number}</td>
                  <td className="px-6 py-4">
                    {payment.vendor ? payment.vendor.name : `Vendor #${payment.vendor_id}`}
                  </td>
                  <td className="px-6 py-4 font-bold">₹{payment.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{payment.payment_method || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      payment.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : payment.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setEditingPayment(payment); setPaymentForm(payment); setIsPaymentModalOpen(true); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingVendor ? 'Edit Vendor' : 'New Vendor'}</h3>
              <button onClick={() => setIsVendorModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor Name *</label>
                  <input required value={vendorForm.name} onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input value={vendorForm.company_name} onChange={(e) => setVendorForm({...vendorForm, company_name: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <input value={vendorForm.contact_person} onChange={(e) => setVendorForm({...vendorForm, contact_person: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={vendorForm.email} onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input value={vendorForm.phone} onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor Type</label>
                  <select value={vendorForm.vendor_type} onChange={(e) => setVendorForm({...vendorForm, vendor_type: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="">Select Type</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GSTIN</label>
                  <input value={vendorForm.gstin} onChange={(e) => setVendorForm({...vendorForm, gstin: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PAN</label>
                  <input value={vendorForm.pan} onChange={(e) => setVendorForm({...vendorForm, pan: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Account</label>
                  <input value={vendorForm.bank_account} onChange={(e) => setVendorForm({...vendorForm, bank_account: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <input value={vendorForm.bank_name} onChange={(e) => setVendorForm({...vendorForm, bank_name: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IFSC Code</label>
                  <input value={vendorForm.ifsc_code} onChange={(e) => setVendorForm({...vendorForm, ifsc_code: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea rows={2} value={vendorForm.address} onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={2} value={vendorForm.notes} onChange={(e) => setVendorForm({...vendorForm, notes: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">Save Vendor</button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl mt-16 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingPayment ? 'Edit Payment' : 'New Payment'}</h3>
              <button onClick={() => setIsPaymentModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendor *</label>
                <select required value={paymentForm.vendor_id} onChange={(e) => setPaymentForm({...paymentForm, vendor_id: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name} {v.company_name ? `(${v.company_name})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹) *</label>
                <input required type="number" step="0.01" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={2} value={paymentForm.description} onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select value={paymentForm.payment_method} onChange={(e) => setPaymentForm({...paymentForm, payment_method: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="">Select Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={paymentForm.status} onChange={(e) => setPaymentForm({...paymentForm, status: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={paymentForm.due_date} onChange={(e) => setPaymentForm({...paymentForm, due_date: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reference Number</label>
                  <input value={paymentForm.reference_number} onChange={(e) => setPaymentForm({...paymentForm, reference_number: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bill Reference</label>
                  <input value={paymentForm.bill_reference} onChange={(e) => setPaymentForm({...paymentForm, bill_reference: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={2} value={paymentForm.notes} onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Save Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Component ---
function StatCard({ title, value, icon: Icon, trend, positive, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${positive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}