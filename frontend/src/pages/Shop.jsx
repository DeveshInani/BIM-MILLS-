import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, Environment, Html, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader, X, Package, Sparkles, MessageCircle } from 'lucide-react';
import * as THREE from 'three';
import api from '../api/axiosClient';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_PHONE = "919890915839";

const createFallbackEnquiryEmail = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "") || "customer";
  return `shop-enquiry-${digits}@example.com`;
};

const buildEnquiryMessage = (product, enquiryForm) => {
  const lines = [
    "Shop Enquiry",
    `Product: ${product?.name || "General Product"}`,
    `Name: ${enquiryForm.name.trim()}`,
    `Phone: ${enquiryForm.phone.trim()}`,
  ];

  if (enquiryForm.company.trim()) {
    lines.push(`Company Name: ${enquiryForm.company.trim()}`);
  }
  if (enquiryForm.qualityAndShade.trim()) {
    lines.push(`Quality and Shade: ${enquiryForm.qualityAndShade.trim()}`);
  }
  if (enquiryForm.message.trim()) {
    lines.push(`Message/Enquiry: ${enquiryForm.message.trim()}`);
  }

  return lines.join("\n");
};

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

const Product3DCard = ({ product, index, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const color = colors[index % colors.length];
  const texture = useTexture('/efab/thumbnail.png', (loadedTexture) => {
    loadedTexture.wrapS = THREE.RepeatWrapping;
    loadedTexture.wrapT = THREE.RepeatWrapping;
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
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

      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.6, 3.6, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.2} />
      </mesh>
    </Float>
  );
};

const ProductScene = ({ product, index, onProductClick }) => {
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
      <Product3DCard product={product} index={index} onClick={onProductClick} />
      <Environment preset="city" />
    </Suspense>
  );
};

export default function Shop({ mode = 'light' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] = useState(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    message: '',
    company: '',
    qualityAndShade: '',
  });

  const darkMode = mode === 'dark';
  const categories = ["All"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Promise.race([
          api.get('/api/readymade-products'),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 5000)
          )
        ]);

        const productsWithDefaults = (response.data || []).map(product => ({
          ...product,
          minOrder: parseInt(product.quantity?.split(' ')[0], 10) || 50,
          price: parseInt(product.price, 10) || 0,
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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      try {
        const res = await api.get('/users/me');
        setEnquiryForm((prev) => ({
          ...prev,
          name: res.data.name || prev.name,
          phone: res.data.phone || prev.phone,
          company: res.data.company_name || prev.company,
        }));
      } catch (err) {
        console.error("Failed to fetch user data for enquiry", err);
      }
    };

    fetchUserData();
  }, []);

  const filteredProducts = products;

  const resetEnquiryModal = () => {
    setShowEnquiryModal(false);
    setSelectedEnquiryProduct(null);
    setEnquirySuccess(false);
    setEnquiryLoading(false);
    setEnquiryForm((prev) => ({
      name: prev.name,
      phone: prev.phone,
      company: prev.company,
      message: '',
      qualityAndShade: '',
    }));
  };

  const openEnquiryModal = (product) => {
    setSelectedEnquiryProduct(product);
    setEnquirySuccess(false);
    setShowEnquiryModal(true);
  };

  const validateEnquiryForm = () => {
    if (!enquiryForm.name.trim() || !enquiryForm.phone.trim()) {
      alert('Please fill name and phone number');
      return false;
    }
    return true;
  };

  const handleEnquiryWhatsApp = () => {
    if (!validateEnquiryForm()) return;
    const formattedMessage = buildEnquiryMessage(selectedEnquiryProduct, enquiryForm);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(formattedMessage)}`, '_blank');
  };

  const handleEnquirySubmit = async () => {
    if (!validateEnquiryForm()) return;

    try {
      setEnquiryLoading(true);
      const formattedMessage = buildEnquiryMessage(selectedEnquiryProduct, enquiryForm);
      const storedEmail = localStorage.getItem('userEmail');

      await api.post('/users/enquiry', {
        name: enquiryForm.name.trim(),
        phone: enquiryForm.phone.trim(),
        email: storedEmail || createFallbackEnquiryEmail(enquiryForm.phone),
        company: enquiryForm.company.trim() || null,
        subject: `Shop Enquiry - ${selectedEnquiryProduct?.name || 'Product'}`,
        message: formattedMessage,
      });

      setEnquirySuccess(true);
      setTimeout(() => {
        resetEnquiryModal();
      }, 1600);
    } catch (err) {
      console.error('Failed to send enquiry', err);
      alert('Failed to send enquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'}`}>
      <div className="relative py-20 px-4 overflow-hidden">
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
              Enquiry Based Orders | Custom Printing | Enterprise Solutions
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
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

          <div className={`px-5 py-3 rounded-2xl text-sm font-bold ${darkMode ? 'bg-white/5 border border-white/10 text-blue-200' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
            Orders available via enquiry only
          </div>
        </div>

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
              <div className={`relative aspect-square rounded-3xl overflow-hidden backdrop-blur-xl border ${darkMode
                ? 'bg-white/5 border-white/10 shadow-2xl shadow-blue-500/10'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-2xl'
                } ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Canvas shadows dpr={[1, 2]}>
                  <ProductScene
                    product={product}
                    index={index}
                    onProductClick={() => openEnquiryModal(product)}
                  />
                </Canvas>

                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest shadow-lg">
                  {product.quality}
                </div>
              </div>

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
                        Min. Enquiry Qty: {product.minOrder} units
                      </span>
                    </div>

                    <h2 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </h2>

                    <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                      Premium quality {product.quality.toLowerCase()} designed for professional applications.
                    </p>

                    <div className={`inline-block px-8 py-4 rounded-2xl mb-8 ${darkMode
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                      }`}>
                      <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Reference Price
                      </p>
                      <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{(product.price || 0).toLocaleString()}
                        <span className="text-lg font-normal ml-2 opacity-60">per unit</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEnquiryModal(product)}
                      className="py-5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-base uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30"
                    >
                      <MessageCircle size={20} />
                      Enquire Now
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEnquiryModal(product)}
                      className={`py-5 px-6 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all ${darkMode
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                        : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-md'
                        }`}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showEnquiryModal && selectedEnquiryProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1400] overflow-y-auto bg-black/70 backdrop-blur-sm"
            onClick={resetEnquiryModal}
          >
            <div className="min-h-full flex items-start justify-center px-4 py-24 sm:py-28">
              <motion.div
                initial={{ scale: 0.94, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 24 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100vh-7rem)] flex flex-col ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'}`}
              >
                <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b ${darkMode ? 'border-white/10 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <div>
                    <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enquire Now</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedEnquiryProduct.name}</p>
                  </div>
                  <button
                    onClick={resetEnquiryModal}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                  {enquirySuccess ? (
                    <div className="py-10 text-center">
                      <CheckCircle className="w-14 h-14 mx-auto mb-4 text-green-500" />
                      <h4 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enquiry Sent</h4>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        The enquiry has been submitted for the admin dashboard.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name *</label>
                          <input
                            value={enquiryForm.name}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Phone No *</label>
                          <input
                            value={enquiryForm.phone}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Message / Enquiry</label>
                        <textarea
                          rows={4}
                          value={enquiryForm.message}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          placeholder="Write your enquiry"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Company Name</label>
                          <input
                            value={enquiryForm.company}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, company: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Quality and Shade</label>
                          <input
                            value={enquiryForm.qualityAndShade}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, qualityAndShade: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div className={`rounded-2xl p-4 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Message Format</p>
                        <pre className={`whitespace-pre-wrap text-sm leading-6 font-sans ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{buildEnquiryMessage(selectedEnquiryProduct, enquiryForm)}
                        </pre>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pb-1">
                        <button
                          onClick={handleEnquiryWhatsApp}
                          className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#20bd5a] transition"
                        >
                          Connect via WhatsApp
                        </button>
                        <button
                          onClick={handleEnquirySubmit}
                          disabled={enquiryLoading}
                          className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                        >
                          {enquiryLoading ? 'Sending...' : 'Send Enquiry'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
