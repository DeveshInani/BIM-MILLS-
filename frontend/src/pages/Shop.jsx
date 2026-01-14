import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, CheckCircle, Loader, X } from 'lucide-react';
import api from '../api/axiosClient';

// Fallback static products (for when API is down)
const fallbackProducts = [
  {
    id: 1,
    name: "Premium PPE Kit",
    quality: "PPE Equipment",
    price: 499,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    minOrder: 100,
  },
  {
    id: 2,
    name: "Surgical Face Masks",
    quality: "3-Layer Medical",
    price: 299,
    image: "https://images.unsplash.com/photo-1585155770138-a47e93ba59c2?w=400",
    minOrder: 50,
  },
];

export default function Shop({ mode = 'light' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checkoutStep, setCheckoutStep] = useState(null); // null, 'info', 'confirm', 'success'
  const [orderLoading, setOrderLoading] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from /api/readymade-products...');
        const response = await Promise.race([
          api.get('/api/readymade-products'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 5000)
          )
        ]);
        console.log('Products fetched:', response.data);
        // Add default properties to each product
        const productsWithDefaults = (response.data || []).map(product => ({
          ...product,
          minOrder: parseInt(product.quantity?.split(' ')[0]) || 50,
          price: parseInt(product.price) || 0,
          image: product.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
        }));
        setProducts(productsWithDefaults);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
        console.log('Using fallback products...');
        setProducts(fallbackProducts);
        setError('Using demo products - Backend unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const darkMode = mode === 'dark';
  const categories = ["All"];

  // Handle checkout - Create single order with all items
  const handleCheckout = async () => {
    try {
      if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
        alert('Please fill all required fields');
        return;
      }

      setOrderLoading(true);
      console.log('Starting checkout with items:', cart);
      
      // Combine all items into one order
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const productNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

      const orderPayload = {
        user_id: null,
        user_name: checkoutForm.name,
        user_email: checkoutForm.email,
        user_phone: checkoutForm.phone,
        user_address: checkoutForm.address,
        readymade_product_id: cart[0]?.id || null, // First item's ID for reference
        product_name: productNames, // All product names combined
        quantity: totalQuantity.toString(), // Total quantity
        quality: 'Multiple Items',
        amount: totalAmount
      };

      console.log('Sending combined order:', orderPayload);
      const response = await api.post('/api/orders', orderPayload);
      console.log('Order response:', response.data);
      if (!response.data) {
        throw new Error('Failed to create order');
      }
      setCreatedOrderId(response.data.id);

      console.log('✅ Order created successfully with ID:', response.data.id);
      // Move to success step
      setCheckoutStep('success');
      setCart([]);
      setShowCart(false);
      setCheckoutForm({ name: '', email: '', phone: '', address: '' });
      
    } catch (err) {
      console.error('❌ Checkout failed:', err);
      console.error('Error response:', err.response?.data);
      alert('Order creation failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setOrderLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.minOrder }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: product.minOrder }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(item.minOrder, item.quantity + delta) }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // All products (no category filter for now)
  const filteredProducts = products;

  if (checkoutStep === 'info') {
    return (
      <div className={`min-h-screen py-8 sm:py-12 px-4 transition-colors duration-300 ${darkMode
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        : 'bg-white'
        }`}>
        <div className={`max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>📦 Delivery Information</h2>
            <button onClick={() => setCheckoutStep(null)} className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Summary */}
          <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.name} × {item.quantity}</span>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={`border-t pt-2 mt-2 flex justify-between font-bold ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                <span>Total Amount</span>
                <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>👤 Your Details</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name *</label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number *</label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Address *</label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Your complete delivery address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCheckoutStep(null)}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
                  alert('Please fill all fields');
                  return;
                }
                setCheckoutStep('confirm');
              }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue to Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'confirm') {
    return (
      <div className={`min-h-screen py-8 sm:py-12 px-4 transition-colors duration-300 ${darkMode
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        : 'bg-white'
        }`}>
        <div className={`max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>✓ Order Confirmation</h2>

          {/* Order Details */}
          <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.name} × {item.quantity}</span>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={`border-t pt-2 mt-2 flex justify-between font-bold ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                <span>Total</span>
                <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delivery To</h3>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Name:</strong> {checkoutForm.name}</p>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Email:</strong> {checkoutForm.email}</p>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Phone:</strong> {checkoutForm.phone}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Address:</strong> {checkoutForm.address}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCheckoutStep('info')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            >
              Edit Details
            </button>
            <button
              onClick={handleCheckout}
              disabled={orderLoading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {orderLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'success') {
    return (
      <div className={`min-h-screen py-8 sm:py-12 px-4 transition-colors duration-300 ${darkMode
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        : 'bg-white'
        }`}>
        <div className={`max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
              <CheckCircle className={`w-12 h-12 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎉 Thank You!</h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Your order has been placed successfully
            </p>
          </div>

          <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.length > 0 ? cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.name} × {item.quantity}</span>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              )) : null}
              <div className={`border-t pt-2 flex justify-between font-bold ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                <span>Total</span>
                <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            {createdOrderId && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Order ID:</strong> #{createdOrderId}
              </p>
            )}
          </div>

          <p className={`text-center text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We'll send you an email confirmation at <strong>{checkoutForm.email}</strong><br/>
            Our sales team will contact you on <strong>{checkoutForm.phone}</strong>
          </p>

          <button
            onClick={() => {
              setCheckoutStep(null);
              setCart([]);
              setShowCart(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'
      }`}>
      {/* Header */}
      <div className={`py-12 sm:py-16 px-4 transition-colors duration-300 ${darkMode
        ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
        : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
        } text-white`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Textile Solutions Shop
          </h1>
          <p className={`text-base sm:text-xl mb-2 ${darkMode ? 'text-gray-300' : 'text-blue-100'
            }`}>
            Bulk Orders | Custom Printing | Enterprise Solutions
          </p>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-blue-200'
            }`}>
            Minimum order quantities apply for wholesale pricing
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base ${selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart ({cartCount})
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs sm:text-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className={`fixed right-0 top-0 h-full w-full sm:w-96 shadow-2xl z-50 overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                        <div className="flex justify-between mb-2">
                          <h3 className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                              }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className={`text-xs sm:text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>₹{item.price.toLocaleString()} per unit</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -item.minOrder)}
                              className={`w-8 h-8 rounded flex items-center justify-center ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className={`font-semibold w-12 sm:w-16 text-center ${darkMode ? 'text-white' : 'text-gray-900'
                              }`}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.minOrder)}
                              className={`w-8 h-8 rounded flex items-center justify-center ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className={`font-bold text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`border-t pt-4 mb-6 ${darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                    <div className={`flex justify-between text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      <span>Total</span>
                      <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('info')}
                    disabled={orderLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                  >
                    {orderLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 sm:p-6">
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'
                  }`}>{product.name}</h3>
                <p className={`text-xs sm:text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Quality: {product.quality}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>₹{(product.price || 0).toLocaleString()}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>per unit</p>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}