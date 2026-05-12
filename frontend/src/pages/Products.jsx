import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, Environment, Html, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, ShieldCheck, FileText, Download, Loader, Send, CheckCircle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import api from '../api/axiosClient';
import axios from 'axios';

// 3D Rotating Fabric Card
const RotatingFabric = ({ fabric, index }) => {
  const meshRef = useRef();
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const color = colors[index % colors.length];

  // Load thumbnail texture
  const texture = useTexture('/efab/thumbnail.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </Float>
  );
};

// 3D Scene Component
const FabricScene = ({ fabric, index }) => {
  return (
    <Suspense fallback={<Html center><div className="text-white font-bold">Loading...</div></Html>}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={2} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
      <RotatingFabric fabric={fabric} index={index} />
      <Environment preset="studio" />
    </Suspense>
  );
};

// Sample Request Modal Component
const SampleRequestModal = ({ isOpen, onClose, product, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: `I would like to request a sample for ${product?.title} (${product?.quality_code || product?.quality}).`
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/users/enquiry', {
        ...formData,
        subject: "Sample Request"
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Failed to submit sample request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl bg-slate-950/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-[1.75rem] sm:rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-12">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-black mb-2">Request Submitted!</h3>
            <p className="text-slate-400">Our team will contact you shortly regarding the samples.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 flex items-center gap-3">
              <Layers className="text-blue-500" />
              Request Samples
            </h3>
            <p className="text-slate-400 mb-8">Professional textile samples for your assessment.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Full Name"
                className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 focus:border-blue-500 text-white' : 'bg-slate-100 border-slate-200 focus:border-blue-600'}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 focus:border-blue-500 text-white' : 'bg-slate-100 border-slate-200 focus:border-blue-600'}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone"
                  className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 focus:border-blue-500 text-white' : 'bg-slate-100 border-slate-200 focus:border-blue-600'}`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="Company Name"
                className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 focus:border-blue-500 text-white' : 'bg-slate-100 border-slate-200 focus:border-blue-600'}`}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <textarea
                required
                rows={4}
                placeholder="Details of your request..."
                className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 focus:border-blue-500 text-white' : 'bg-slate-100 border-slate-200 focus:border-blue-600'}`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {submitting ? <Loader className="animate-spin" /> : <Send size={20} />}
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function Products({ mode = 'light' }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [sampleModalProduct, setSampleModalProduct] = useState(null);
  const darkMode = mode === 'dark';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/readymade-products/cat/all');

      const mappedProducts = response.data.map(product => {
        // Handle PDF path - use bimmills_catalogue folder (the actual folder name)
        let pdfPath = null;
        if (product.file) {
          if (product.file.startsWith('http')) {
            pdfPath = product.file;
          } else {
            // Normalize path: handle both bimmills_catalogue and bimillscatalogue
            // The actual folder is bimmills_catalogue, so normalize to that
            let normalizedPath = product.file.replace(/bimillscatalogue/g, 'bimmills_catalogue');

            // Remove leading slash if present (we'll add it back)
            normalizedPath = normalizedPath.replace(/^\/+/, '');

            // If path already contains bimmills_catalogue, use it as is
            if (normalizedPath.includes('bimmills_catalogue')) {
              pdfPath = `/${normalizedPath}`;
            } else {
              // Extract just the filename if full path is provided
              const filename = normalizedPath.split('/').pop();
              pdfPath = `/bimmills_catalogue/${filename}`;
            }

            console.log('PDF path normalized:', { original: product.file, normalized: pdfPath });
          }
        } else {
          console.log('No PDF file for product:', product.title || product.name);
        }

        return {
          id: product.id,
          title: product.title || product.name,
          desc: product.desc || product.description || 'Premium fabric for professional applications.',
          category: product.category || 'General',
          quality_code: product.quality_code || null,
          quality: product.category || 'Professional Grade',
          gsm: product.gsm || 'N/A',
          width: product.width || 'N/A',
          composition: product.fabric_type || 'Premium Blend',
          safety: product.features || 'Quality Certified',
          usage: product.usage_area || 'Multi-purpose',
          image: product.image || '/assets/textures/silk-royale.png',
          pdf: pdfPath
        };
      });

      // Sort by ID descending to show newest first
      const sortedProducts = mappedProducts.sort((a, b) => b.id - a.id);

      setProducts(sortedProducts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (product) => {
    if (!product || !product.id) {
      alert('Product data missing');
      return;
    }

    console.log('Opening PDF via Robust Backend Proxy for product:', product.id);

    try {
      // Use the new backend proxy endpoint
      const proxyUrl = `/api/readymade-products/pdf/${product.id}?v=${new Date().getTime()}`;

      // Fetch as blob
      const response = await api.get(proxyUrl, {
        responseType: 'blob'
      });

      // Create local Object URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      // Open in new tab
      const newTab = window.open(blobUrl, '_blank');

      // Fallback if popup blocked
      if (!newTab) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${product.title.replace(/\s+/g, '_')}_datasheet.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);
    } catch (err) {
      console.error('Error loading PDF via Proxy:', err);
      alert('Could not open PDF. The file might be missing or the server is busy.');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="text-center">
          <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Loading Products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="text-center max-w-md">
          <p className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{error}</p>
          <button onClick={fetchProducts} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <div className="py-12 sm:py-20 px-2 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-6">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Professional Textile Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase">PRODUCT CATALOGUE<span className="text-blue-600">.</span></h1>
          <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-blue-200/50' : 'text-slate-600'}`}>
            Engineered fabrics for corporate, industrial, and institutional applications.
            Discover our premium range of PV, PC, and specialized blends.
          </p>
        </motion.div>
      </div>

      {/* Product List - Vertical Alternating Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 lg:space-y-32 py-8 sm:py-12">
        {products.map((product, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 sm:gap-12 lg:gap-24 items-center`}
            >
              {/* Visual Side */}
              <div className="w-full lg:w-1/2 aspect-square relative group">
                <div className={`absolute inset-0 rounded-[3rem] blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-40 bg-blue-600`}></div>
                <div className={`relative w-full h-full rounded-[3rem] overflow-hidden ${darkMode ? 'bg-slate-900/80' : 'bg-slate-100'} border border-white/10 shadow-2xl`}>
                  <Canvas shadows dpr={[1, 2]}>
                    <FabricScene fabric={product} index={index} />
                  </Canvas>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 text-left">
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                      {product.category}
                    </span>
                    {product.quality_code && (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/5 text-white/40' : 'bg-slate-200 text-slate-600'}`}>
                        Code: {product.quality_code}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-none uppercase">{product.title}</h2>
                  <p className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-8 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    {product.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className={`px-4 sm:px-5 py-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'} transition-transform hover:scale-105`}>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">GSM</p>
                      <p className="text-lg font-black">{product.gsm || 'N/A'}</p>
                    </div>
                    <div className={`px-4 sm:px-5 py-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'} transition-transform hover:scale-105`}>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Width</p>
                      <p className="text-lg font-black">{product.width || 'N/A'}</p>
                    </div>
                    <div className={`px-4 sm:px-5 py-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'} transition-transform hover:scale-105`}>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Blend</p>
                      <p className="text-xs font-black uppercase">{product.composition || 'Premium'}</p>
                    </div>
                  </div>

                  {/* Usage Area Box UI */}
                  {product.usage && (
                    <div className="mb-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Key Applications</p>
                      <div className="flex flex-wrap gap-2.5">
                        {product.usage.split(',').map((u, i) => (
                          <span key={i} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-blue-600 hover:text-white ${darkMode ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                            {u.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setSelectedFabric(product)}
                    className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${darkMode ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}
                  >
                    <Layers size={20} /> Technical Specs
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(product)}
                    className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${darkMode ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30' : 'bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200'}`}
                  >
                    <FileText size={20} /> Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fabric Genuineness Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-16 sm:pb-20 mt-16 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-[2rem] sm:rounded-3xl p-6 sm:p-10 lg:p-12 ${darkMode ? 'bg-slate-900/50 border border-white/10' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'}`}
        >
          <div className="flex items-start sm:items-center gap-3 mb-6">
            <ShieldCheck className="text-blue-600" size={32} />
            <h2 className={`text-2xl sm:text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Why Trust Our Fabrics?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Quality Assurance & Certification
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-white/70' : 'text-slate-700'}`}>
                Our fabrics undergo rigorous quality testing and are certified for professional use. We maintain strict quality control standards ensuring every batch meets industry specifications for durability, safety, and performance.
              </p>
            </div>
            <div>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Authenticity Guarantee
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-white/70' : 'text-slate-700'}`}>
                We source materials directly from verified suppliers and maintain complete traceability. Every product comes with detailed specifications, quality codes, and certification documentation. Our commitment to transparency ensures you receive genuine, premium-grade textiles.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tech Specs Modal */}
      <AnimatePresence>
        {selectedFabric && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 backdrop-blur-2xl bg-slate-950/90" onClick={() => setSelectedFabric(null)}>
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={(e) => e.stopPropagation()} className={`relative w-full max-w-4xl rounded-[1.75rem] sm:rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}>
              <button onClick={() => setSelectedFabric(null)} className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition"><X size={20} /></button>

              <div className="flex items-center gap-3 mb-6">
                <Layers className="text-blue-500" />
                <span className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/20 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest">{selectedFabric.category}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">{selectedFabric.title}<span className="text-blue-600">.</span></h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                {[
                  { label: 'Fabric Weight (GSM)', value: selectedFabric.gsm },
                  { label: 'Material Composition', value: selectedFabric.composition },
                  { label: 'Fabric Width', value: selectedFabric.width },
                  { label: 'Quality Code', value: selectedFabric.quality_code || 'N/A' },
                  { label: 'Certifications', value: selectedFabric.safety }
                ].map((spec, i) => (
                  <div key={i} className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">{spec.label}</p>
                    <p className="text-lg font-bold">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  onClick={() => handleDownloadPDF(selectedFabric)}
                  className="flex-1 px-6 sm:px-10 py-4 sm:py-6 bg-blue-600 text-white rounded-2xl font-black text-xs sm:text-sm tracking-widest shadow-xl hover:bg-blue-700 transition flex justify-center items-center gap-3"
                >
                  <Download size={18} /> DOWNLOAD DATASHEET
                </button>
                <button
                  onClick={() => setSampleModalProduct(selectedFabric)}
                  className={`flex-1 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl font-black text-xs sm:text-sm tracking-widest transition ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  REQUEST SAMPLES
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SampleRequestModal
        isOpen={!!sampleModalProduct}
        onClose={() => setSampleModalProduct(null)}
        product={sampleModalProduct}
        darkMode={darkMode}
      />

      <div className="flex justify-center pb-12 sm:pb-20">
        <WhatsAppButton
          label="Connect via WhatsApp"
          message="Hello, I would like to discuss bulk fabric procurement and partnership opportunities."
          className="px-6 sm:px-12 py-4 sm:py-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest"
        />
      </div>
    </div>
  );
}
