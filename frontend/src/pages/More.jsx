import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Factory,
  Globe,
  Cpu,
  Recycle,
  Droplet,
  Wind,
  Layers,
  Zap,
  Scissors,
  Trello,
  PenTool,
  Search
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
  }
];

const garmentrySteps = [
  {
    icon: <Scissors className="w-8 h-8" />,
    title: "Precision Cutting",
    description: "CAD-integrated automatic cutting machines ensuring zero-error patterns.",
    details: "Maximum fabric utilization with millimetre precision."
  },
  {
    icon: <Trello className="w-8 h-8" />,
    title: "Assembly Line",
    description: "High-speed industrial sewing units with specialized machinery for every seam.",
    details: "200+ skilled experts dedicated to uniform assembly."
  },
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Detail Finishing",
    description: "Advanced embroidery, heavy-duty buttoning, and industrial steam pressing.",
    details: "Giving every garment a crisp, professional corporate look."
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "100% Quality Audit",
    description: "Rigorous 4-point inspection system for every single garment produced.",
    details: "Zero-defect policy for bulk and wholesale orders."
  }
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
    title: "Global Export Strategy",
    timeline: "Q4 2026",
    description: "Exporting premium e-fab textiles to Southeast Asia and Middle East markets.",
    status: "Market Entry",
    impact: "3x Export Revenue"
  }
];

const sustainability = [
  { icon: <Droplet className="w-6 h-6" />, text: "Water recycling systems saving 60% water" },
  { icon: <Wind className="w-6 h-6" />, text: "Solar power covering 40% of energy needs" },
  { icon: <Recycle className="w-6 h-6" />, text: "Zero liquid discharge wastewater treatment" },
  { icon: <Layers className="w-6 h-6" />, text: "Biodegradable packaging materials" }
];

export default function More({ mode = 'light' }) {
  const [activeTab, setActiveTab] = useState('manufacturing');
  const darkMode = mode === 'dark';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-all duration-500 overflow-hidden`}>

      {/* Hero Section - Premium Cinematic */}
      <div className="relative py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600'} text-[10px] font-black tracking-widest uppercase mb-8`}
          >
            <Factory className="w-3 h-3" /> Industrial Excellence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-6xl md:text-8xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tighter leading-none`}
          >
            Capabilities <br />
            <span className="text-gradient">& Infrastructure</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-3xl mx-auto ${darkMode ? 'text-blue-100/60' : 'text-slate-600'} font-light leading-relaxed`}
          >
            Exploring the fusion of traditional craftsmanship and fourth-generation industrial technology.
          </motion.p>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <div className="sticky top-0 z-50 px-4 py-4 backdrop-blur-2xl border-y border-white/5 bg-slate-950/20">
        <div className="max-w-4xl mx-auto">
          <div className={`p-1.5 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-slate-200'} flex gap-1 items-center overflow-x-auto no-scrollbar`}>
            {[
              { id: 'manufacturing', label: 'Mill Unit', icon: <Droplet className="w-4 h-4" /> },
              { id: 'garmentry', label: 'Garmentry Unit', icon: <Scissors className="w-4 h-4" /> },
              { id: 'projects', label: 'Innovation', icon: <Zap className="w-4 h-4" /> },
              { id: 'sustainability', label: 'Eco-System', icon: <Recycle className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105'
                  : `${darkMode ? 'text-white/40 hover:text-white/80' : 'text-slate-500 hover:text-slate-900'}`
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
          >
            {activeTab === 'manufacturing' && manufacturingSteps.map((step, idx) => (
              <CapabilityCard key={idx} step={step} idx={idx} darkMode={darkMode} />
            ))}

            {activeTab === 'garmentry' && garmentrySteps.map((step, idx) => (
              <CapabilityCard key={idx} step={step} idx={idx} darkMode={darkMode} accent="indigo" />
            ))}

            {activeTab === 'projects' && upcomingProjects.map((project, idx) => (
              <ProjectCard key={idx} project={project} darkMode={darkMode} />
            ))}

            {activeTab === 'sustainability' && sustainability.map((item, idx) => (
              <SustainabilityCard key={idx} item={item} darkMode={darkMode} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Global Production Stats Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`mt-24 p-12 rounded-[4rem] ${darkMode ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10' : 'bg-white shadow-2xl'} text-center relative overflow-hidden group`}
        >
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-colors" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: "50K+", label: "Monthly Units" },
              { value: "200+", label: "Expert Tailors" },
              { value: "1M+", label: "Fabric Meters/Yr" },
              { value: "100%", label: "In-House QA" }
            ].map((stat, idx) => (
              <div key={idx} className="relative z-10">
                <div className={`text-5xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tighter`}>{stat.value}</div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .text-gradient {
          background: linear-gradient(to right, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Sub-components for cleaner structure
function CapabilityCard({ step, idx, darkMode, accent = "blue" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, rotateY: -10 },
        visible: { opacity: 1, rotateY: 0 }
      }}
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: 2 }}
      className={`p-10 rounded-[3.5rem] relative group border border-white/5 transition-all duration-500 ${darkMode ? 'glass-card' : 'bg-white shadow-xl shadow-slate-200'}`}
    >
      <div className={`w-16 h-16 rounded-3xl ${accent === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-indigo-500/20 text-indigo-400'} flex items-center justify-center mb-8`}>
        {step.icon}
      </div>
      <div className="text-6xl font-black opacity-5 absolute top-8 right-8">{idx + 1}</div>
      <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>{step.title}</h3>
      <p className={`${darkMode ? 'text-blue-100/80' : 'text-slate-600'} mb-6 font-light leading-relaxed`}>{step.description}</p>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${accent === 'blue' ? 'text-blue-400/80' : 'text-indigo-400/80'}`}>{step.details}</div>
    </motion.div>
  );
}

function ProjectCard({ project, darkMode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`p-10 rounded-[3.5rem] border border-white/5 lg:col-span-1 transition-all ${darkMode ? 'glass-card' : 'bg-white shadow-xl shadow-slate-200'}`}
    >
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          {project.icon}
        </div>
        <div>
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{project.timeline}</div>
          <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{project.title}</h3>
        </div>
      </div>
      <p className={`${darkMode ? 'text-blue-100/80' : 'text-slate-600'} mb-8 font-light italic leading-relaxed`}>"{project.description}"</p>
      <div className="flex items-center justify-between mt-auto">
        <span className={`px-4 py-1.5 rounded-full ${darkMode ? 'bg-white/5 text-white/60 border-white/10' : 'bg-slate-100 text-slate-500 border-slate-200'} text-[9px] font-black uppercase tracking-widest border`}>{project.status}</span>
        <div className={`text-[10px] font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{project.impact}</div>
      </div>
    </motion.div>
  );
}

function SustainabilityCard({ item, darkMode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className={`p-10 rounded-[3.5rem] flex flex-col items-center text-center group border border-white/5 transition-all ${darkMode ? 'glass-card' : 'bg-white shadow-xl shadow-slate-200'}`}
    >
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform shadow-2xl shadow-emerald-500/10">
        {item.icon}
      </div>
      <p className={`text-lg font-light leading-relaxed ${darkMode ? 'text-blue-100/80' : 'text-slate-600'}`}>
        {item.text}
      </p>
    </motion.div>
  );
}
