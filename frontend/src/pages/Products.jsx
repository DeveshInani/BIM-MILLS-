import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Package,
  Sparkles,
  TrendingUp,
  Award,
  ShoppingBag,
  ArrowRight,
  Loader
} from 'lucide-react';
import api from '../api/axiosClient';

// Static catalog PDFs (keeping these as they are custom files)
const staticCatalogs = [
  {
    title: "Shirting Fabrics",
    desc: "Premium shirting fabrics for schools, corporates and uniforms",
    file: "bimmills_catalogue/P.V.SUITING (1).pdf",
    category: "Shirting",
    features: ["Wrinkle-Free", "Breathable", "Easy Care"],
    image: "https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=800&q=80"
  },
  {
    title: "Suiting Fabrics",
    desc: "Durable suiting fabrics with elegant finishes",
    file: "bimmills_catalogue/P.V.SUITING (2).pdf",
    category: "Suiting",
    features: ["Premium Quality", "Wrinkle Resistant", "Professional Look"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
  },
  {
    title: "Yarn Dyed Fabrics",
    desc: "Colorfast yarn dyed fabrics with rich texture",
    file: "bimmills_catalogue/ENIGMA YARN DYED SUTING.pdf",
    category: "Premium",
    features: ["Colorfast", "Rich Texture", "Long Lasting"],
    image: "https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=800&q=80"
  },
  {
    title: "Cotton Drill",
    desc: "Heavy-duty cotton drill fabrics for industrial wear",
    file: "bimmills_catalogue/100 COTTON DRILL.pdf",
    category: "Industrial",
    features: ["Heavy Duty", "100% Cotton", "Durable"],
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80"
  },
  {
    title: "Matty Fabrics",
    desc: "Breathable matty fabrics for comfort uniforms",
    file: "bimmills_catalogue/E-18 YARN DYED MATTY.pdf",
    category: "Comfort",
    features: ["Breathable", "Comfortable", "Uniform Ready"],
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80"
  },
  {
    title: "Enigma Series",
    desc: "Premium enigma yarn dyed exclusive collection",
    file: "bimmills_catalogue/ENIGMA YARN DYED SUTING.pdf",
    category: "Exclusive",
    features: ["Exclusive", "Premium", "Limited Edition"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
  },
];

export default function Products({ mode = 'light' }) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkMode = mode === 'dark';

  // Fetch real product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/readymade-products/cat/all');
        // If API returns products, use them; otherwise use static catalogs
        if (response.data && response.data.length > 0) {
          setProductData(response.data);
        } else {
          setProductData(staticCatalogs);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Fall back to static catalogs
        setProductData(staticCatalogs);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-white'} transition-all duration-500`}>
      {/* Hero Section */}
      <div className={`relative py-20 overflow-hidden ${darkMode ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-0 right-0 w-96 h-96 ${darkMode ? 'bg-cyan-500' : 'bg-white'} rounded-full mix-blend-multiply filter blur-3xl animate-blob`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 ${darkMode ? 'bg-blue-400' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className={`inline-block mb-6 px-6 py-3 ${darkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/20 border border-white/30'} backdrop-blur-md rounded-full text-sm font-semibold shadow-lg`}>
            <FileText className="w-4 h-4 inline mr-2" />
            Product Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Premium Fabric Collections
            <br />
            <span className={`${darkMode ? 'text-blue-300' : 'text-blue-100'}`}>Download Our Catalogs</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-blue-100' : 'text-blue-50'}`}>
            Discover our comprehensive range of premium fabrics with detailed specifications and bulk pricing options
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "6+", label: "Product Lines", icon: <Package className="w-8 h-8" /> },
            { value: "1000+", label: "Fabric Designs", icon: <Sparkles className="w-8 h-8" /> },
            { value: "100%", label: "Quality Assured", icon: <Award className="w-8 h-8" /> }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`${darkMode ? 'bg-gradient-to-br from-blue-900/90 to-blue-950/90 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-6 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                  <div className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Catalog Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData.map((catalog, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group ${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 hover:border-blue-400/60' : 'bg-white border-blue-100 hover:border-blue-300'} border-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer`}
              >
                {/* Header with Fabric Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={catalog.image || 'https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=800&q=80'}
                    alt={catalog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-blue-950 via-blue-900/50 to-transparent' : 'bg-gradient-to-t from-blue-900/80 via-blue-600/40 to-transparent'}`}></div>

                  {/* Category Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 ${darkMode ? 'bg-blue-950/90' : 'bg-white/95'} backdrop-blur-md rounded-full text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'} shadow-lg`}>
                    {catalog.category || 'Fabric'}
                  </div>

                  {/* Fabric Type Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                      <h3 className="text-white font-black text-xl">
                        {catalog.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className={`text-base mb-4 leading-relaxed ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                    {catalog.desc}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(catalog.features || ['Premium Quality', 'Durable', 'Professional']).map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${darkMode
                          ? 'bg-blue-950/50 border border-blue-500/30 text-blue-300'
                          : 'bg-blue-50 border border-blue-200 text-blue-700'
                          }`}
                      >
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        <span className="font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* View Button */}
                    <a
                      href={catalog.file || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 group"
                    >
                      <Eye size={20} className="group-hover:scale-110 transition-transform" />
                      <span>View Catalog</span>
                    </a>

                    {/* Download Button */}
                    <a
                      href={catalog.file || '#'}
                      download
                      className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 ${darkMode
                        ? 'bg-blue-950/50 border-2 border-blue-500/30 text-blue-300 hover:bg-blue-900/50 hover:border-blue-400/50'
                        : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                    >
                      <Download size={20} />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className={`mt-20 ${darkMode ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'} rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-0 right-0 w-96 h-96 ${darkMode ? 'bg-cyan-500' : 'bg-white'} rounded-full mix-blend-multiply filter blur-3xl animate-blob`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 ${darkMode ? 'bg-blue-400' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000`}></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">
              Need Custom Fabric Solutions?
            </h2>
            <p className={`text-xl mb-8 leading-relaxed ${darkMode ? 'text-blue-100' : 'text-blue-50'}`}>
              Our expert team is ready to help with bulk orders, custom designs, and enterprise fabric solutions tailored to your specific requirements.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${darkMode ? 'bg-blue-800' : 'bg-white/20'} backdrop-blur-sm rounded-full flex items-center justify-center text-2xl`}>
                  📧
                </div>
                <span className="text-lg font-semibold">sales@bimmills.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${darkMode ? 'bg-blue-800' : 'bg-white/20'} backdrop-blur-sm rounded-full flex items-center justify-center text-2xl`}>
                  📞
                </div>
                <span className="text-lg font-semibold">+91 98765 43210</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className={`group px-12 py-5 ${darkMode ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50'} rounded-2xl font-bold text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 mx-auto relative overflow-hidden`}
            >
              <span className="relative z-10">Contact Sales Team</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🏭", title: "Manufacturing", desc: "State-of-the-art facilities" },
            { icon: "🚚", title: "Fast Delivery", desc: "Pan-India shipping" },
            { icon: "✅", title: "Quality Assured", desc: "ISO certified processes" },
            { icon: "🎨", title: "Custom Design", desc: "Tailored solutions" }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}