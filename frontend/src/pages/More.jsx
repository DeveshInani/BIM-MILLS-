import { useState } from 'react';
import {
  Factory,
  Award,
  Leaf,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Calendar,
  Target,
  Sparkles,
  Globe,
  Shield,
  Cpu,
  Recycle,
  Droplet,
  Wind
} from 'lucide-react';

const manufacturingSteps = [
  {
    icon: <Droplet className="w-8 h-8" />,
    title: "Fiber Selection",
    description: "Premium quality cotton, polyester, and blended fibers sourced from certified suppliers",
    details: "We carefully select fibers based on strength, durability, and comfort requirements"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Spinning & Weaving",
    description: "State-of-the-art spinning machines convert fibers into high-quality yarn",
    details: "Advanced weaving technology creates consistent, durable fabric structures"
  },
  {
    icon: <Wind className="w-8 h-8" />,
    title: "Dyeing & Finishing",
    description: "Eco-friendly dyeing processes with colorfast and fade-resistant treatments",
    details: "Our finishing processes ensure softness, wrinkle resistance, and longevity"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Quality Control",
    description: "Rigorous multi-stage inspection ensuring every product meets our standards",
    details: "ISO certified quality assurance at every step of production"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Customization",
    description: "Custom printing, embroidery, and branding services for bulk orders",
    details: "Advanced embroidery machines and digital printing technology"
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Packaging & Delivery",
    description: "Eco-friendly packaging and efficient logistics for timely delivery",
    details: "Pan-India delivery network with real-time tracking"
  }
];

const certifications = [
  { name: "ISO 9001:2015", desc: "Quality Management System" },
  { name: "ISO 14001:2015", desc: "Environmental Management" },
  { name: "OEKO-TEX Standard 100", desc: "Textile Safety Certification" },
  { name: "GOTS", desc: "Global Organic Textile Standard" }
];

const upcomingProjects = [
  {
    icon: <Recycle className="w-10 h-10" />,
    title: "Sustainable Textile Initiative",
    timeline: "Q2 2026",
    description: "Launching 100% recycled fabric production line with zero-waste manufacturing",
    status: "In Development",
    impact: "50% reduction in carbon footprint"
  },
  {
    icon: <Cpu className="w-10 h-10" />,
    title: "Smart Factory Automation",
    timeline: "Q3 2026",
    description: "AI-powered quality control and automated production systems",
    status: "Planning Phase",
    impact: "40% increase in production efficiency"
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: "International Expansion",
    timeline: "Q4 2026",
    description: "Opening new manufacturing facilities in Southeast Asia and Middle East",
    status: "Site Selection",
    impact: "3x production capacity"
  },
  {
    icon: <Leaf className="w-10 h-10" />,
    title: "Organic Cotton Range",
    timeline: "Q1 2027",
    description: "Premium organic cotton uniforms with GOTS certification",
    status: "R&D Phase",
    impact: "100% organic product line"
  }
];

const sustainability = [
  { icon: <Droplet className="w-6 h-6" />, text: "Water recycling systems saving 60% water" },
  { icon: <Wind className="w-6 h-6" />, text: "Solar power covering 40% of energy needs" },
  { icon: <Recycle className="w-6 h-6" />, text: "Zero liquid discharge wastewater treatment" },
  { icon: <Leaf className="w-6 h-6" />, text: "Biodegradable packaging materials" }
];

export default function More({ mode = 'light' }) {
  const [activeTab, setActiveTab] = useState('manufacturing');
  const darkMode = mode === 'dark';

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
            <Factory className="w-4 h-4 inline mr-2" />
            Manufacturing Excellence Since 1995
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Our Manufacturing Process
            <br />
            <span className={`${darkMode ? 'text-blue-300' : 'text-blue-100'}`}>& Future Vision</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-blue-100' : 'text-blue-50'}`}>
            Discover how we create premium textiles with cutting-edge technology and sustainable practices
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-b ${darkMode ? 'border-blue-500/20' : 'border-blue-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {[
              { id: 'manufacturing', label: 'Manufacturing Process', icon: <Factory className="w-5 h-5" /> },
              { id: 'certifications', label: 'Certifications', icon: <Award className="w-5 h-5" /> },
              { id: 'projects', label: 'Upcoming Projects', icon: <TrendingUp className="w-5 h-5" /> },
              { id: 'sustainability', label: 'Sustainability', icon: <Leaf className="w-5 h-5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'} shadow-lg scale-105`
                  : `${darkMode ? 'text-blue-300 hover:bg-blue-900/30' : 'text-gray-600 hover:bg-blue-50'}`
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manufacturing Process Section */}
      {activeTab === 'manufacturing' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Manufacturing Journey
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              From raw fiber to finished product - every step is crafted with precision and care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {manufacturingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`group ${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 hover:border-blue-400/60' : 'bg-white border-blue-100 hover:border-blue-300'} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 text-9xl font-black ${darkMode ? 'text-blue-500/5' : 'text-blue-100/50'} -mr-4 -mt-4`}>
                  {idx + 1}
                </div>

                <div className={`relative z-10 w-20 h-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-white shadow-lg shadow-blue-500/50`}>
                  {step.icon}
                </div>

                <h3 className={`relative z-10 text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p className={`relative z-10 ${darkMode ? 'text-blue-200' : 'text-gray-600'} mb-4 leading-relaxed`}>
                  {step.description}
                </p>
                <p className={`relative z-10 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold`}>
                  {step.details}
                </p>
              </div>
            ))}
          </div>

          {/* Production Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "50K+", label: "Units/Month" },
              { value: "200+", label: "Skilled Workers" },
              { value: "25+", label: "Years Experience" },
              { value: "99.8%", label: "Quality Rate" }
            ].map((stat, idx) => (
              <div key={idx} className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                <div className={`text-5xl font-black mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {activeTab === 'certifications' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Certifications & Standards
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Our commitment to quality and safety is validated by international certifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cert.name}
                    </h3>
                    <p className={`text-lg ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                      {cert.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/40 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} border-2 rounded-3xl p-10`}>
            <div className="flex items-start gap-6">
              <Shield className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Compliance & Safety
                </h3>
                <p className={`text-lg ${darkMode ? 'text-blue-200' : 'text-gray-700'} leading-relaxed`}>
                  All our products comply with international safety standards including REACH, CPSIA, and local regulatory requirements.
                  We conduct regular third-party audits to ensure continuous compliance and maintain the highest safety standards for our customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Projects Section */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Future Innovations
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Pioneering the future of textile manufacturing with cutting-edge projects
            </p>
          </div>

          <div className="space-y-8">
            {upcomingProjects.map((project, idx) => (
              <div
                key={idx}
                className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 hover:border-blue-400/60' : 'bg-white border-blue-100 hover:border-blue-300'} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group`}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className={`w-24 h-24 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-white shadow-lg shadow-blue-500/50`}>
                    {project.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-700'} rounded-full text-sm font-bold`}>
                            <Calendar className="w-4 h-4" />
                            {project.timeline}
                          </span>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-green-600/30 text-green-300' : 'bg-green-100 text-green-700'} rounded-full text-sm font-bold`}>
                            <Target className="w-4 h-4" />
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-lg ${darkMode ? 'text-blue-200' : 'text-gray-600'} mb-4 leading-relaxed`}>
                      {project.description}
                    </p>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300' : 'bg-purple-50 border border-purple-200 text-purple-700'} rounded-xl font-semibold`}>
                      <TrendingUp className="w-5 h-5" />
                      Expected Impact: {project.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vision Statement */}
          <div className={`mt-16 ${darkMode ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'} rounded-3xl p-12 text-center text-white`}>
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-black mb-4">Our Vision for 2030</h3>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              To become the leading sustainable textile manufacturer in Asia, setting new standards for
              eco-friendly production while maintaining premium quality and competitive pricing.
            </p>
          </div>
        </div>
      )}

      {/* Sustainability Section */}
      {activeTab === 'sustainability' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sustainability Initiatives
            </h2>
            <p className={`text-xl ${darkMode ? 'text-blue-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Building a greener future through responsible manufacturing practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {sustainability.map((item, idx) => (
              <div
                key={idx}
                className={`${darkMode ? 'bg-gradient-to-br from-green-900/40 to-blue-950/40 border-green-500/30' : 'bg-white border-green-200'} border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${darkMode ? 'bg-green-600' : 'bg-green-500'} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-white`}>
                    {item.icon}
                  </div>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Environmental Impact */}
          <div className={`${darkMode ? 'bg-gradient-to-br from-green-900/40 to-blue-950/40 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'} border-2 rounded-3xl p-12`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className={`text-6xl font-black mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  60%
                </div>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reduction in Water Usage
                </p>
              </div>
              <div>
                <div className={`text-6xl font-black mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  40%
                </div>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Solar Energy Coverage
                </p>
              </div>
              <div>
                <div className={`text-6xl font-black mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Zero
                </div>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Liquid Discharge
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
