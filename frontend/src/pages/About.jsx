import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Factory,
  Globe,
  Heart,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const milestones = [
  { year: "1995", title: "Founded", desc: "BIM Mills established" },
  { year: "2005", title: "Expansion", desc: "New manufacturing facility" },
  { year: "2015", title: "ISO Certified", desc: "Quality standards achieved" },
  { year: "2025", title: "Global Reach", desc: "15+ countries served" }
];

const values = [
  { icon: <Award className="w-8 h-8" />, title: "Quality First", desc: "Premium materials and craftsmanship" },
  { icon: <Users className="w-8 h-8" />, title: "Customer Focus", desc: "Dedicated to client satisfaction" },
  { icon: <TrendingUp className="w-8 h-8" />, title: "Innovation", desc: "Cutting-edge manufacturing" },
  { icon: <Shield className="w-8 h-8" />, title: "Trust", desc: "40 years of reliability" }
];

export default function About({ mode = 'light' }) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const darkMode = mode === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} overflow-hidden`}>
      {/* Hero Section with Parallax Textile Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Textile Pattern Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-blue-950/95 via-slate-950/90 to-blue-900/95' : 'bg-gradient-to-br from-blue-600/90 via-blue-500/85 to-blue-700/90'}`}></div>

        {/* Floating Fabric Swatches */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 backdrop-blur-sm rounded-2xl rotate-12 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/10 backdrop-blur-sm rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-blue-300/10 backdrop-blur-sm rounded-2xl -rotate-12 animate-float animation-delay-4000"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-blue-500/10 backdrop-blur-sm rounded-full animate-float animation-delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className={`inline-block mb-6 px-6 py-3 ${darkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/20 border border-white/30'} backdrop-blur-md rounded-full text-sm font-semibold text-white shadow-lg`}>
              <Sparkles className="w-4 h-4 inline mr-2" />
              ABOUT BIM MILLS
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 text-white leading-tight">
              <span className="inline-block animate-slide-in-left">Fabric &</span>
              <br />
              <span className="inline-block animate-slide-in-right bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                Uniform Manufacturing
              </span>
              <br />
              <span className="inline-block animate-slide-in-left">Excellence</span>
            </h1>

            <p className={`text-xl md:text-2xl mb-12 ${darkMode ? 'text-blue-100' : 'text-blue-50'} max-w-4xl mx-auto leading-relaxed`}>
              Nearly four decades of textile expertise, building quality uniforms and fabrics for organizations across the globe
            </p>

            {/* Scroll Indicator */}
            <div className="animate-bounce mt-16">
              <div className={`w-8 h-12 border-2 ${darkMode ? 'border-blue-300/60' : 'border-white/60'} rounded-full flex justify-center p-2 mx-auto`}>
                <div className={`w-1.5 h-4 ${darkMode ? 'bg-blue-300/60' : 'bg-white/60'} rounded-full animate-scroll`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 - Complete Uniform Solutions */}
      <div className={`relative py-32 ${darkMode ? 'bg-gradient-to-br from-slate-950 to-blue-950' : 'bg-white'}`}>
        {/* Textile Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=1600&q=80')`,
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image with 3D Tilt Effect */}
            <div className="relative group">
              <div className={`absolute inset-0 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Uniform Solutions"
                  className="w-full h-[500px] object-cover"
                />
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-blue-950/80 to-transparent' : 'bg-gradient-to-t from-blue-900/60 to-transparent'}`}></div>

                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Factory className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-2xl">500+</div>
                        <div className="text-blue-200 text-sm">Organizations Served</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className={`inline-block px-4 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold`}>
                OUR EXPERTISE
              </div>

              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                Complete Uniform Solutions
              </h2>

              <p className={`text-xl ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                A uniform is a type of clothing worn by members of an organization. BIM Mills has a long-standing tradition of supplying premium uniform fabrics and complete uniform solutions for schools, hospitals, corporates, hotels and institutions across the country.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6">
                {['Schools', 'Hospitals', 'Corporates', 'Hotels'].map((item, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border-2 rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer group`}>
                    <CheckCircle2 className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2 group-hover:scale-110 transition-transform`} />
                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 - Single Source Manufacturing */}
      <div className={`relative py-32 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content - Reversed Order */}
            <div className="space-y-6 lg:order-2">
              <div className={`inline-block px-4 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold`}>
                ONE-STOP SOLUTION
              </div>

              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                Single Source Manufacturing
              </h2>

              <p className={`text-xl ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                Beyond garments, BIM Mills provides accessories such as ties, belts, socks, caps, shoes, sportswear, sweaters and blazers. This makes us a true single-source uniform solution provider for virtually every occupation.
              </p>

              {/* Product Categories with Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {[
                  { icon: '👔', label: 'Ties' },
                  { icon: '🧢', label: 'Caps' },
                  { icon: '👟', label: 'Shoes' },
                  { icon: '🧥', label: 'Blazers' }
                ].map((item, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border-2 rounded-2xl p-4 text-center hover:scale-110 hover:rotate-3 transition-all cursor-pointer group`}>
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{item.icon}</div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image with Parallax */}
            <div className="relative group lg:order-1">
              <div className={`absolute inset-0 ${darkMode ? 'bg-cyan-600' : 'bg-cyan-500'} rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                  alt="Manufacturing"
                  className="w-full h-[500px] object-cover"
                />
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-slate-950/80 to-transparent' : 'bg-gradient-to-t from-gray-900/60 to-transparent'}`}></div>

                {/* Floating Stats */}
                <div className="absolute top-8 right-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="text-white font-black text-3xl">100%</div>
                    <div className="text-blue-200 text-sm">Quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className={`relative py-32 ${darkMode ? 'bg-gradient-to-br from-blue-950 to-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-block px-4 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold mb-6`}>
              OUR JOURNEY
            </div>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Milestones of Excellence
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-1 ${darkMode ? 'bg-blue-500/30' : 'bg-blue-300'} transform -translate-x-1/2 hidden lg:block`}></div>

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-200'} border-2 rounded-3xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-block group cursor-pointer`}>
                      <div className={`text-5xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2 group-hover:scale-110 transition-transform`}>
                        {milestone.year}
                      </div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {milestone.title}
                      </div>
                      <div className={`${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                        {milestone.desc}
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className={`hidden lg:block w-8 h-8 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full border-4 ${darkMode ? 'border-slate-950' : 'border-white'} shadow-lg z-10`}></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Quality, Trust & Growth */}
      <div className={`relative py-32 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative group">
              <div className={`absolute inset-0 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
                  alt="Quality"
                  className="w-full h-[500px] object-cover"
                />
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-blue-950/80 to-transparent' : 'bg-gradient-to-t from-blue-900/60 to-transparent'}`}></div>

                {/* Floating Award */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-xl">ISO Certified</div>
                        <div className="text-blue-200 text-sm">Quality Standards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className={`inline-block px-4 py-2 ${darkMode ? 'bg-blue-500/10 border border-blue-400/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'} rounded-full text-sm font-bold`}>
                OUR FOUNDATION
              </div>

              <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                Quality, Trust & Growth
              </h2>

              <p className={`text-xl ${darkMode ? 'text-blue-200' : 'text-gray-600'} leading-relaxed`}>
                With nearly four decades of textile expertise, BIM Mills has built a strong reputation for quality, timely delivery and competitive pricing. Our growth is driven by customer confidence, consistent performance and a commitment to excellence.
              </p>

              {/* Values Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                {values.map((value, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-blue-900/30 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border-2 rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition-all cursor-pointer group`}>
                    <div className={`w-12 h-12 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      {value.icon}
                    </div>
                    <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{value.title}</div>
                    <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>{value.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`relative py-28 overflow-hidden ${darkMode ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-0 right-0 w-96 h-96 ${darkMode ? 'bg-cyan-500' : 'bg-white'} rounded-full mix-blend-multiply filter blur-3xl animate-blob`}></div>
          <div className={`absolute bottom-0 left-0 w-96 h-96 ${darkMode ? 'bg-blue-400' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000`}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Ready to Partner with Us?
          </h2>
          <p className={`text-xl mb-12 ${darkMode ? 'text-blue-100' : 'text-blue-50'} max-w-2xl mx-auto`}>
            Experience the BIM Mills difference. Let's create premium uniform solutions together.
          </p>

          <button
            onClick={() => navigate('/contact')}
            className={`group px-12 py-6 ${darkMode ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50'} rounded-2xl font-bold text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 mx-auto relative overflow-hidden`}
          >
            <span className="relative z-10">Contact Us Today</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
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

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes scroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(8px); }
          100% { transform: translateY(0); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.2s backwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
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