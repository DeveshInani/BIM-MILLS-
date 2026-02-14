import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Frames3DBackground from '../components/Frames3DBackground.jsx';
import {
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  Award,
  Users,
  Factory,
  Sparkles,
  ShoppingCart,
  Shield,
  Globe,
  Palette,
  Layers,
  Star,
  Zap
} from 'lucide-react';

// Material/Fabric showcase
const fabricMaterials = [
  {
    name: "Premium Cotton",
    description: "100% pure cotton with superior breathability",
    image: "",
    features: ["Breathable", "Soft", "Durable"],
    feel: "Premium Feel"
  },
  {
    name: "Polyester Blend",
    description: "Wrinkle-resistant and easy-care blend fabric",
    image: "",
    features: ["Wrinkle-Free", "Quick-Dry", "Low-Maintenance"],
    feel: "Tech Feel"
  },
  {
    name: "Cotton-Poly Mix",
    description: "Perfect balance of comfort and durability",
    image: "",
    features: ["Comfortable", "Durable", "Versatile"],
    feel: "Best Feel"
  },
  {
    name: "Heavy Duty Drill",
    description: "Industrial-grade for heavy-duty work",
    image: "",
    features: ["Industrial", "Heavy-Duty", "Long-Lasting"],
    feel: "Strong Feel"
  },
];

const products = [
  {
    name: "Corporate Uniforms",
    img: "",
    desc: "Professional uniforms for corporate identity"
  },
  {
    name: "School Uniforms",
    img: "",
    desc: "Comfortable and durable school wear"
  },
  {
    name: "Medical Apparel",
    img: "",
    desc: "Premium scrubs and medical wear"
  },
  {
    name: "Industrial Workwear",
    img: "",
    desc: "Safety-first industrial uniforms"
  },
  {
    name: "Hospitality Uniforms",
    img: "",
    desc: "Elegant hospitality and service wear"
  },
  {
    name: "Premium Fabrics",
    img: "",
    desc: "High-quality fabric collections"
  },
];

const services = [
  {
    icon: <Package className="w-8 h-8" />,
    title: "Single Source Solution",
    desc: "A complete range of fabrics and accessories including ties, socks, belts, and caps."
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Double Edge Brand",
    desc: "Our promise of industrial-grade quality at accessible wholesale pricing."
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Pan-India Delivery",
    desc: "Fast and reliable shipping across all Indian states and industries."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Quality Assurance",
    desc: "ISO certified processes with more stitches per inch and roomier cuts."
  },
];

const stats = [
  { label: "Global Presence", value: "40", suffix: " Years" },
  { label: "Happy Cliens", value: 500, suffix: "+" },
  { label: "Annual Production", value: "1M+", suffix: " Meters" },
  { label: "States Served", value: 15, suffix: "+" },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "ABC Industries",
    text: "Outstanding quality and timely delivery. BIM Mills has been our trusted partner for corporate uniforms.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    company: "Global School Network",
    text: "The best uniform manufacturer we've worked with. Professional service and competitive pricing.",
    rating: 5
  },
  {
    name: "Dr. Amit Patel",
    company: "City Hospital",
    text: "Excellent medical apparel quality. Their attention to detail and fabric quality is remarkable.",
    rating: 5
  },
  {
    name: "Sneha Verma",
    company: "Elite Hotels",
    text: "Our staff looks fantastic! The uniforms are stylish, comfortable, and durable. Highly recommended.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    company: "MegaMart Retail",
    text: "BIM Mills delivers on time, every time. The quality and service are unmatched in the industry.",
    rating: 5
  },
];

const features = [
  "Premium Grade Fabrics",
  "Advanced Machinery & Technology",
  "Skilled Workforce of 200+",
  "Custom Design & Branding",
  "Bulk Order Specialists",
  "Fast Turnaround Time",
  "Competitive Wholesale Pricing"
];



export default function Home({ mode = 'light' }) {
  const navigate = useNavigate();
  const [selectedFabric, setSelectedFabric] = useState(0);
  const darkMode = mode === 'dark';



  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'} transition-all duration-500 overflow-hidden`}>

      {/* Hero Section with 3D Image Sequence */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Frames3DBackground />

        {/* Cinematic Overlay - Dark Gradient to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-[1]" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-[10] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full glass-card-dark text-blue-200 text-sm font-medium tracking-wide border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="uppercase tracking-widest">Premium Textile Excellence</span>
            </motion.div>

            {/* Main Title with Premium Gradient */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tight">
              <span className="block text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                BIM MILLS
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 animate-gradient pb-4">
                TEXTILES
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl mb-12 text-blue-100/80 max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
            >
              Engineering the finest fabrics for the world's leading industries.
              <span className="block mt-2 font-medium text-white italic">Precision in every thread, excellence in every yard.</span>
            </motion.p>

            {/* CTA Buttons - Premium Styled */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/products')}
                className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contact')}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg transition-all"
              >
                Request Consultation
              </motion.button>
            </div>

            {/* Stats - Grid layout with glassmorphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                  className="group glass-card-dark p-6 md:p-8 rounded-[2rem] hover:bg-white/10 transition-all duration-500 cursor-pointer border border-white/5"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-blue-300/60 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[10]">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-blue-400 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className={`py-32 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-blue-50 to-white'} relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600'} text-xs font-bold tracking-widest uppercase mb-6`}>
              <Zap className="w-3 h-3" /> Our Collection
            </div>
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              Product <span className="text-gradient">Range</span>
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300/60' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>
              Industrial-grade uniforms and precision-crafted fabrics designed for versatility and durability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate('/products')}
                className={`group relative glass-card-dark rounded-[2.5rem] overflow-hidden transition-all duration-700 cursor-pointer border border-white/5 hover:border-blue-500/30`}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out shadow-2xl"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />

                  {/* Floating Action Badge */}
                  <div className="absolute top-6 right-6 px-4 py-2 glass-card-dark rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    View Details
                  </div>
                </div>

                <div className="p-10 relative">
                  {/* Decorative number */}
                  <div className="absolute top-10 right-10 text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-blue-500/10 transition-colors">
                    0{idx + 1}
                  </div>

                  <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-400 transition-colors`}>
                    {product.name}
                  </h3>
                  <p className={`mb-8 text-lg font-light leading-relaxed ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    {product.desc}
                  </p>

                  <div className="flex items-center gap-2 text-blue-400 font-black text-sm tracking-widest uppercase group/btn">
                    Explore <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FABRIC SHOWCASE SECTION */}
      <div className={`py-32 ${darkMode ? 'bg-slate-950' : 'bg-white'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-100 text-indigo-600'} text-xs font-bold tracking-widest uppercase mb-6`}>
              <Layers className="w-3 h-3" /> Masterful Engineering
            </div>
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Art of Fabric</span>
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300/60' : 'text-gray-600'} max-w-2xl mx-auto font-light`}>
              Experience the tactile excellence of our premium textile selection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Fabric Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFabric}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="glass-card-dark p-12 rounded-[3.5rem] border border-white/10 relative z-10 overflow-hidden"
                  >
                    {/* Animated background highlights */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-2xl glass-card-dark flex items-center justify-center border border-white/20">
                        <Palette className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-4xl font-bold text-white tracking-tight">
                        {fabricMaterials[selectedFabric].name}
                      </h3>
                    </div>

                    <p className="text-xl text-blue-100/60 mb-10 leading-relaxed font-light italic">
                      "{fabricMaterials[selectedFabric].description}"
                    </p>

                    <div className="grid grid-cols-1 gap-4 mb-12">
                      {fabricMaterials[selectedFabric].features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Star className="w-3 h-3 text-blue-400" />
                          </div>
                          <span className="text-sm font-bold text-white uppercase tracking-widest">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[2rem] shadow-2xl">
                      <div className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em] mb-2">Tactile Signature</div>
                      <div className="text-2xl font-black text-white flex items-center gap-3">
                        <Zap className="w-6 h-6 text-cyan-300" />
                        {fabricMaterials[selectedFabric].feel}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Fabric Selector & Large Image */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative group">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFabric}
                      initial={{ opacity: 0, rotateY: -10 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 10 }}
                      transition={{ duration: 0.7 }}
                      className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white/5"
                    >
                      <img
                        src={fabricMaterials[selectedFabric].image}
                        alt={fabricMaterials[selectedFabric].name}
                        className="w-full h-[600px] object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Vertical Fabric Selector */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                  {fabricMaterials.map((fabric, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedFabric(idx)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border ${selectedFabric === idx
                        ? 'bg-blue-600 text-white border-blue-400 scale-110 z-10'
                        : 'glass-card-dark text-white/40 border-white/5 hover:text-white hover:border-white/20'
                        }`}
                    >
                      <Layers className="w-6 h-6" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className={`py-32 ${darkMode ? 'bg-slate-950' : 'bg-white'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600'} text-xs font-bold tracking-widest uppercase mb-6`}>
              <Star className="w-3 h-3" /> Business Solutions
            </div>
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              Specialized <span className="text-gradient">Services</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative glass-card-dark rounded-[2rem] p-10 border border-white/5 hover:border-blue-500/40 transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-blue-100/60 leading-relaxed font-light">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>



      {/* Why Choose Us */}
      <div className={`py-32 ${darkMode ? 'bg-slate-950' : 'bg-blue-50/50'} relative overflow-hidden backdrop-blur-3xl`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600'} text-xs font-bold tracking-widest uppercase mb-8`}>
                <Award className="w-3 h-3" /> Reliable Partner
              </div>
              <h2 className={`text-6xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight leading-none`}>
                The <span className="text-gradient">BIM Mills</span> Edge
              </h2>
              <p className={`text-2xl mb-12 ${darkMode ? 'text-blue-100/60' : 'text-gray-600'} font-light leading-relaxed`}>
                Combining decades of craftsmanship with industrial precision to deliver unmatched textile quality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <CheckCircle className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-white/80 font-medium tracking-wide">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6 perspective-1000"
            >
              {[
                { icon: <Factory />, value: "50K+", label: "Units Monthly" },
                { icon: <Users />, value: "200+", label: "Skilled Experts", mt: true },
                { icon: <Shield />, value: "ISO", label: "Certified Ops" },
                { icon: <Globe />, value: "15+", label: "States Served", mt: true }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ rotateY: -10, rotateX: 5, translateZ: 20 }}
                  className={`glass-card-dark p-8 rounded-[2.5rem] border border-white/10 ${item.mt ? 'mt-12' : ''} transition-all duration-500 shadow-2xl`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                    {item.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{item.value}</div>
                  <div className="text-xs font-bold text-blue-300/40 uppercase tracking-widest">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className={`py-32 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-white to-blue-50'} overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-yellow-100 text-yellow-600'} text-[10px] font-black tracking-widest uppercase mb-6`}>
              <Star className="w-3 h-3 fill-current" /> Trusted Globally
            </div>
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              Client <span className="text-gradient">Voices</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="flex gap-8 animate-testimonial-carousel hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing" style={{ width: 'max-content' }}>
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  className="glass-card-dark p-10 rounded-[3rem] min-w-[400px] border border-white/5 relative group overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

                  <div className="flex gap-1 mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-xl italic font-light leading-relaxed text-blue-100/80 mb-10">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg tracking-wide">{testimonial.name}</h4>
                      <p className="text-sm font-black text-blue-400 uppercase tracking-widest">{testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className="absolute inset-0 z-10 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-20 max-w-5xl mx-auto px-4 text-center"
        >
          <div className="glass-card-dark py-24 px-12 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter leading-none">
              Ready to Weave <br />
              <span className="text-gradient">Your Future?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100/60 font-light max-w-2xl mx-auto">
              Partner with BIM Mills today and experience the pinnacle of industrial textile engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="group px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all"
              >
                <ShoppingCart className="w-6 h-6" />
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="px-12 py-5 bg-transparent border-2 border-white/20 text-white rounded-2xl font-black text-xl hover:bg-white/5 transition-all"
              >
                Get Quotation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popup-burst {
          0% {
            opacity: 0;
            transform: scale(0) translate(-50%, -50%);
          }
          10% {
            opacity: 1;
            transform: scale(1.2) translate(-50%, -50%);
          }
          90% {
            opacity: 1;
            transform: scale(1) translate(-50%, calc(-50% - 80px));
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translate(-50%, calc(-50% - 120px));
          }
        }

        @keyframes bounce-popup {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        @keyframes spin-slow {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes testimonial-carousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-popup-burst {
          animation: popup-burst 5s ease-out forwards;
        }

        .animate-bounce-popup {
          animation: bounce-popup 2s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-testimonial-carousel {
          animation: testimonial-carousel 40s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
