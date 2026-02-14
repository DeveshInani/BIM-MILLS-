import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, Environment, Html, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, CheckCircle, Loader, X, Package, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import api from '../api/axiosClient';
import WhatsAppButton from '../components/WhatsAppButton';

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

// 3D Product Card with Interactive Rotation
const Product3DCard = ({ product, index, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Dynamic colors for each product
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const color = colors[index % colors.length];
  
  // Load thumbnail texture
  const texture = useTexture('/efab/thumbnail.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;

    // Hover effect - scale up
    const targetScale = hovered ? 1.1 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[2.5, 3.5, 0.15]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Glowing edges */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.6, 3.6, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.2} />
      </mesh>
    </Float>
  );
};

// 3D Scene Component
const ProductScene = ({ product, index, onAddToCart }) => {
  return (
    <Suspense fallback={<Html center><div className="text-white font-bold">Loading...</div></Html>}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={7}
        autoRotate={false}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} color="#8b5cf6" />
      <Product3DCard product={product} index={index} onClick={onAddToCart} />
      <Environment preset="city" />
    </Suspense>
  );
};

export default function Shop({ mode = 'light' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
          image: product.image || ""
        }));
        setProducts(productsWithDefaults);
      } catch (err) {
        console.log('Using fallback products...');
        setProducts(fallbackProducts);
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
            We'll send you an email confirmation at <strong>{checkoutForm.email}</strong><br />
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
      {/* Premium Header with Glassmorphism */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} -top-20 -left-20 animate-pulse`}></div>
          <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} -bottom-20 -right-20 animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-6 backdrop-blur-sm">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Premium Shopping Experience</span>
            </div>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              3D Product Gallery<span className="text-blue-600">.</span>
            </h1>
            <p className={`text-lg sm:text-xl mb-4 max-w-3xl mx-auto ${darkMode ? 'text-blue-200/70' : 'text-gray-600'}`}>
              Explore our premium textile solutions in an immersive 3D environment
            </p>
            <p className={`text-sm sm:text-base ${darkMode ? 'text-blue-300/50' : 'text-gray-500'}`}>
              Bulk Orders | Custom Printing | Enterprise Solutions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base backdrop-blur-sm ${selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : darkMode
                    ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCart(!showCart)}
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 w-full sm:w-auto justify-center text-sm sm:text-base shadow-xl shadow-blue-500/30"
          >
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({cartCount})
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* 3D Products Grid - Scrollable */}
        <div className="space-y-24">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* 3D Canvas */}
              <div className={`relative aspect-square rounded-3xl overflow-hidden backdrop-blur-xl border ${darkMode
                  ? 'bg-white/5 border-white/10 shadow-2xl shadow-blue-500/10'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-2xl'
                } ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Canvas shadows dpr={[1, 2]}>
                  <ProductScene
                    product={product}
                    index={index}
                    onAddToCart={() => addToCart(product)}
                  />
                </Canvas>

                {/* Floating Info Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  {product.quality}
                </div>
              </div>

              {/* Product Info */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="text-blue-500" size={24} />
                      <span className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Min. Order: {product.minOrder} units
                      </span>
                    </div>

                    <h2 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </h2>

                    <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                      Premium quality {product.quality.toLowerCase()} designed for professional applications.
                    </p>

                    {/* Price Display */}
                    <div className={`inline-block px-8 py-4 rounded-2xl mb-8 ${darkMode
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                      }`}>
                      <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Wholesale Price
                      </p>
                      <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{(product.price || 0).toLocaleString()}
                        <span className="text-lg font-normal ml-2 opacity-60">per unit</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(product)}
                      className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-base uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${darkMode
                            ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                            : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-md'
                          }`}
                      >
                        View Details
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(`https://wa.me/919890915839?text=${encodeURIComponent(`Inquiry about ${product.name}`)}`, '_blank')}
                        className={`py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${darkMode
                            ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                            : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-md'
                          }`}
                      >
                        Enquire Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full sm:w-[480px] shadow-2xl z-50 overflow-y-auto ${darkMode ? 'bg-gray-900 border-l border-white/10' : 'bg-white border-l border-gray-200'
                }`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Shopping Cart
                  </h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className={`p-2 rounded-full transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                  >
                    <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {cart.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`rounded-2xl p-5 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className={`font-bold text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.name}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                ₹{item.price.toLocaleString()} per unit
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className={`p-2 rounded-lg transition ${darkMode
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-red-500 hover:bg-red-50'
                                }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, -item.minOrder)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition ${darkMode
                                    ? 'bg-white/10 hover:bg-white/20'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                  }`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className={`font-bold text-lg min-w-[60px] text-center ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.minOrder)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition ${darkMode
                                    ? 'bg-white/10 hover:bg-white/20'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                  }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className={`font-black text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className={`border-t pt-6 mb-6 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className={`flex justify-between text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        <span>Total</span>
                        <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                          ₹{cartTotal.toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {cartCount} items in cart
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCheckoutStep('info')}
                      disabled={orderLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 disabled:opacity-50"
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
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global CTA Section */}
      <div className="mt-32 mb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`max-w-5xl mx-auto rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden ${darkMode
              ? 'bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-blue-900/50 border border-white/10'
              : 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600'
            } shadow-2xl`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute w-64 h-64 rounded-full bg-white blur-3xl -top-20 -left-20 animate-pulse"></div>
            <div className="absolute w-64 h-64 rounded-full bg-white blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white">
              Need Bulk Orders or Customization?
            </h2>
            <p className="text-lg sm:text-xl mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto">
              We offer special pricing for bulk orders and custom manufacturing solutions tailored to your business needs.
            </p>
            <div className="flex justify-center">
              <WhatsAppButton
                label="Connect via WhatsApp"
                message="Hi, I am interested in placing a bulk order."
                darkMode={true}
                className="px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}