import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TrendingUp,
  ShoppingCart,
  Zap,
  Shield,
  Globe,
  Shirt,
  Lightbulb,
  Palette,
  Eye,
  Layers,
  Wind,
  Flame,
  Cloud,
  Star,
  Heart,
  Flame as Fire,
  X
} from 'lucide-react';

// Material/Fabric showcase
const fabricMaterials = [
  {
    name: "Premium Cotton",
    description: "100% pure cotton with superior breathability",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=400",
    features: ["Breathable", "Soft", "Durable"],
    feel: "Premium Feel"
  },
  {
    name: "Polyester Blend",
    description: "Wrinkle-resistant and easy-care blend fabric",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    features: ["Wrinkle-Free", "Quick-Dry", "Low-Maintenance"],
    feel: "Tech Feel"
  },
  {
    name: "Cotton-Poly Mix",
    description: "Perfect balance of comfort and durability",
    image: "https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=800&q=80",
    features: ["Comfortable", "Durable", "Versatile"],
    feel: "Best Feel"
  },
  {
    name: "Heavy Duty Drill",
    description: "Industrial-grade for heavy-duty work",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400",
    features: ["Industrial", "Heavy-Duty", "Long-Lasting"],
    feel: "Strong Feel"
  },
];

const products = [
  {
    name: "Corporate Uniforms",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    desc: "Professional uniforms for corporate identity"
  },
  {
    name: "School Uniforms",
    img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400",
    desc: "Comfortable and durable school wear"
  },
  {
    name: "Medical Apparel",
    img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400",
    desc: "Premium scrubs and medical wear"
  },
  {
    name: "Industrial Workwear",
    img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400",
    desc: "Safety-first industrial uniforms"
  },
  {
    name: "Hospitality Uniforms",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    desc: "Elegant hospitality and service wear"
  },
  {
    name: "Premium Fabrics",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=400",
    desc: "High-quality fabric collections"
  },
];

const services = [
  {
    icon: <Package className="w-8 h-8" />,
    title: "Bulk Manufacturing",
    desc: "Large-scale production with minimum order quantities starting from 100 units"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Custom Branding",
    desc: "Personalized printing, embroidery, and logo placement services"
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Pan-India Delivery",
    desc: "Fast and reliable shipping across all Indian states"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Quality Assurance",
    desc: "ISO certified processes with rigorous quality checks"
  },
];

const stats = [
  { label: "Years Experience", value: 25, suffix: "+" },
  { label: "Happy Clients", value: 500, suffix: "+" },
  { label: "Annual Production", value: 12000, suffix: " tons" },
  { label: "Countries Served", value: 15, suffix: "+" },
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
  "ISO Certified Manufacturing",
  "Advanced Machinery & Technology",
  "Skilled Workforce of 200+",
  "Custom Design & Branding",
  "Bulk Order Specialists",
  "Fast Turnaround Time",
  "Competitive Wholesale Pricing"
];



export default function Home({ mode = 'light' }) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const darkMode = mode === 'dark';


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'} transition-all duration-500 overflow-hidden`}>

      {/* Hero Section with 3D */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Frames3DBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full animate-blob blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full animate-blob animation-delay-2000 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full animate-blob animation-delay-4000 blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className={`inline-block mb-6 px-6 py-3 ${darkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/20 border border-white/30'} backdrop-blur-md rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-300 animate-pulse`}>
              <span>✨</span> Premium Textile Manufacturing Since 1995
            </div>

            {/* Main Title with Explosion Animation */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className={`${darkMode ? 'text-white drop-shadow-2xl' : 'text-white drop-shadow-xl'} inline-block`}>
                BIM MILLS
              </span>
              <br />
              <span className={`${darkMode ? 'bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400' : 'bg-gradient-to-r from-blue-100 via-white to-blue-200'} bg-clip-text text-transparent animate-gradient`}>
                Textile Excellence
              </span>
            </h1>

            <p className={`text-lg sm:text-xl md:text-2xl mb-10 ${darkMode ? 'text-blue-100' : 'text-blue-50'} max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up`} style={{animationDelay: '0.2s'}}>
              Premium fabrics crafted for perfection. From corporate wear to industrial uniforms,
              <br />
              we deliver excellence in every stitch.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
              <button onClick={() => navigate('/products')} className={`group px-10 py-5 ${darkMode ? 'bg-white/30 text-white hover:bg-white/50' : 'bg-white/60 text-blue-700 hover:bg-white/80'} rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl backdrop-blur-lg flex items-center gap-3 relative overflow-hidden border border-white/30 animate-fade-in-up`} style={{animationDelay: '0.4s'}}>
                <span className="relative z-10">Explore Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button onClick={() => navigate('/contact')} className={`px-10 py-5 bg-transparent border-2 ${darkMode ? 'border-blue-300 text-blue-100 hover:bg-blue-400/20' : 'border-white text-white hover:bg-white/20'} backdrop-blur-sm rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg animate-fade-in-up`} style={{animationDelay: '0.6s'}}>
                Request Quote
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`group bg-white/95 backdrop-blur-xl rounded-3xl p-6 border-2 ${darkMode ? 'border-white/20' : 'border-white/40'} transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-fade-in-up`}
                  style={{animationDelay: `${0.8 + idx * 0.1}s`}}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`text-4xl sm:text-5xl font-black mb-2 ${darkMode ? 'text-blue-600' : 'text-blue-600'} transition-all duration-300 ${hoveredCard === idx ? 'scale-110' : ''}`}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-gray-600' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-8 h-12 border-2 ${darkMode ? 'border-blue-300/60' : 'border-white/60'} rounded-full flex justify-center p-2`}>
            <div className={`w-1.5 h-4 ${darkMode ? 'bg-blue-300/60' : 'bg-white/60'} rounded-full animate-scroll`}></div>
          </div>
        </div>
      </div>

      {/* FABRIC SHOWCASE SECTION - NEW */}
      <div className={`py-32 ${darkMode ? 'bg-gradient-to-b from-blue-950/50 to-slate-900/50' : 'bg-gradient-to-b from-blue-50 to-white'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className={`inline-block px-6 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6 animate-pulse`}>
              ✨ MATERIALS & FABRICS ✨
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Premium Material Selection
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Feel the difference in every fabric we offer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Fabric Details */}
            <div className="order-2 lg:order-1">
              <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                <div className="flex items-center gap-4 mb-6">
                  <Palette className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-spin-slow`} />
                  <h3 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {fabricMaterials[selectedFabric].name}
                  </h3>
                </div>
                <p className={`text-lg mb-6 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                  {fabricMaterials[selectedFabric].description}
                </p>
                <div className="flex gap-3 mb-8 flex-wrap">
                  {fabricMaterials[selectedFabric].features.map((feature, idx) => (
                    <span key={idx} className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                      ✓ {feature}
                    </span>
                  ))}
                </div>
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>FEEL</p>
                  <p className={`text-2xl font-black ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    {fabricMaterials[selectedFabric].feel}
                  </p>
                </div>
              </div>
            </div>

            {/* Fabric Image Carousel */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={fabricMaterials[selectedFabric].image}
                  alt={fabricMaterials[selectedFabric].name}
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-pulse-slow"
                />
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-t ${darkMode ? 'from-blue-950 via-transparent to-transparent' : 'from-blue-900/50 via-transparent to-transparent'}`}></div>
              </div>

              {/* Fabric Selector */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {fabricMaterials.map((fabric, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFabric(idx)}
                    className={`p-4 rounded-2xl transition-all duration-300 transform ${
                      selectedFabric === idx
                        ? `${darkMode ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-blue-600 shadow-lg shadow-blue-500/50'} scale-105 text-white`
                        : `${darkMode ? 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`
                    } font-bold text-sm border-2 ${selectedFabric === idx ? 'border-blue-300' : darkMode ? 'border-blue-500/30' : 'border-blue-200'}`}
                  >
                    <Layers className="w-4 h-4 inline mr-2" />
                    {fabric.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className={`py-24 ${darkMode ? 'bg-slate-900/50' : 'bg-white/80'} backdrop-blur-sm relative`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className={`inline-block px-6 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6`}>
              WHAT WE OFFER
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Services
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Comprehensive textile solutions for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`group ${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 hover:border-blue-400/60' : 'bg-white border-blue-100 hover:border-blue-300'} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer backdrop-blur-sm relative overflow-hidden`}
              >
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-blue-500/0 to-blue-500/10' : 'bg-gradient-to-br from-blue-50/0 to-blue-100/50'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className={`relative z-10 w-20 h-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-white shadow-lg shadow-blue-500/50`}>
                  {service.icon}
                </div>
                <h3 className={`relative z-10 text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                <p className={`relative z-10 ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className={`py-24 ${darkMode ? 'bg-gradient-to-b from-slate-950 to-blue-950/30' : 'bg-gradient-to-b from-blue-50 to-white'} relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-block px-6 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6`}>
              OUR COLLECTION
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Product Range
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
              Premium uniforms and fabrics for every industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <div
                key={idx}
                className={`group ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-slate-900/50' : 'bg-white'} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border-2 ${darkMode ? 'border-blue-500/20 hover:border-blue-400/50' : 'border-blue-100 hover:border-blue-300'} animate-fade-in`}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-blue-950 via-blue-950/50 to-transparent' : 'bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent'}`}></div>

                  {/* Floating Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 ${darkMode ? 'bg-blue-500/90' : 'bg-white/90'} backdrop-blur-md rounded-full text-xs font-bold ${darkMode ? 'text-white' : 'text-blue-600'} shadow-lg animate-bounce`}>
                    Premium
                  </div>
                </div>
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h3>
                  <p className={`mb-6 ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                    {product.desc}
                  </p>
                  <button className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-bold flex items-center gap-2 group-hover:gap-4 transition-all`}>
                    Learn More <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className={`py-24 ${darkMode ? 'bg-slate-900/50' : 'bg-blue-50/50'} backdrop-blur-sm relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className={`inline-block px-6 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6`}>
                WHY US
              </div>
              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why Choose BIM Mills?
              </h2>
              <p className={`text-xl mb-10 ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                We're not just a textile manufacturer – we're your trusted partner in creating quality uniforms and fabrics at scale.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((feature, idx) => (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl ${darkMode ? 'hover:bg-blue-900/20' : 'hover:bg-white/80'} transition-all duration-300 group cursor-pointer hover:scale-110 transform`}>
                    <CheckCircle className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-1 group-hover:scale-125 transition-transform`} />
                    <span className={`${darkMode ? 'text-blue-100' : 'text-gray-700'} font-semibold`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}>
                <Factory className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-4xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>50K+</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-gray-600'} font-semibold`}>Units Monthly</p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group mt-10`}>
                <Users className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-4xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>200+</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-gray-600'} font-semibold`}>Skilled Workers</p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}>
                <Award className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-4xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>ISO</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-gray-600'} font-semibold`}>Certified</p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group mt-10`}>
                <Globe className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-4xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>15+</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-gray-600'} font-semibold`}>Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className={`py-24 ${darkMode ? 'bg-gradient-to-b from-blue-950/30 to-slate-950' : 'bg-gradient-to-b from-white to-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-block px-6 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6`}>
              TESTIMONIALS
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What Our Clients Say
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
              Trusted by businesses across India
            </p>
          </div>

          {/* Carousel */}
          <div className="relative overflow-x-hidden">
            <div className="flex gap-8 animate-testimonial-carousel" style={{width: 'max-content'}}>
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-slate-900/50 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 min-w-[340px] max-w-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
                  style={{flex: '0 0 340px'}}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${darkMode ? 'bg-blue-500/5' : 'bg-blue-100/50'} rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className={`${darkMode ? 'text-yellow-400' : 'text-yellow-500'} text-2xl`}>★</span>
                    ))}
                  </div>
                  <p className={`mb-6 italic text-lg leading-relaxed ${darkMode ? 'text-blue-100' : 'text-gray-700'} relative z-10`}>
                    "{testimonial.text}"
                  </p>
                  <div className="relative z-10">
                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold`}>{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 w-full flex flex-col justify-center items-center">
          <div className="backdrop-blur-xl bg-black/30 w-full py-16 shadow-2xl border-t border-b border-white/20 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight text-white drop-shadow-xl animate-pulse">
              Ready to Experience Excellence?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto font-medium">
              Join thousands of businesses relying on BIM Mills for premium uniforms and fabrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl mx-auto">
              <button onClick={() => navigate('/shop')} className="group px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg sm:text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 relative overflow-hidden w-full sm:w-auto">
                <ShoppingCart className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-transparent border-2 border-blue-300 text-blue-100 hover:bg-blue-400/20 backdrop-blur-sm font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg w-full sm:w-auto">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
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