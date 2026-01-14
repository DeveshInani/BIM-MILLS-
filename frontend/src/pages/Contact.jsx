import { useState } from "react";
import { sendEnquiry } from "../user/api/userApi";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Send,
  CheckCircle2,
  Clock,
  Users,
  Globe,
  MessageSquare,
  User,
  Briefcase,
  X
} from 'lucide-react';

const contactInfo = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Company",
    value: "BIM Mills Pvt. Ltd.",
    description: "Premium Textile Manufacturing"
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    value: "contact@bimmills.com",
    description: "We reply within 24 hours"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    value: "+91 98765 43210",
    description: "Mon-Sat, 9AM-6PM IST"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location",
    value: "India",
    description: "Global Operations"
  }
];

const quickStats = [
  { icon: <Clock className="w-8 h-8" />, value: "24hrs", label: "Response Time" },
  { icon: <Users className="w-8 h-8" />, value: "500+", label: "Happy Clients" },
  { icon: <Globe className="w-8 h-8" />, value: "15+", label: "Countries" }
];

export default function Contact({ mode = 'light' }) {
  const navigate = useNavigate();
  const darkMode = mode === 'dark';

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });

  const [openSuccess, setOpenSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEnquiry(form);
      setForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        message: "",
      });
      setOpenSuccess(true);
    } catch {
      alert("Failed to send enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setOpenSuccess(false);
    navigate("/");
  };

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
            <MessageSquare className="w-4 h-4 inline mr-2" />
            We're Here to Help
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Get in Touch
            <br />
            <span className={`${darkMode ? 'text-blue-300' : 'text-blue-100'}`}>Let's Talk Business</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-blue-100' : 'text-blue-50'}`}>
            Have a question or need a quote? Our team is ready to assist you with premium textile solutions
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              className={`${darkMode ? 'bg-gradient-to-br from-blue-900/90 to-blue-950/90 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-6 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                  <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left Side - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h2>
              <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-gray-600'} leading-relaxed`}>
                Reach out to us through any of these channels. We're committed to providing excellent customer service.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30 hover:border-blue-400/60' : 'bg-white border-blue-100 hover:border-blue-300'} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                        {info.title}
                      </div>
                      <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {info.value}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
                        {info.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/40 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} border-2 rounded-2xl p-6`}>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Hours
              </h3>
              <p className={`${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>
                Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-3">
            <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-500/30' : 'bg-white border-blue-100'} border-2 rounded-3xl p-8 md:p-10 shadow-2xl`}>
              <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Send us a Message
              </h2>
              <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-gray-600'} mb-8`}>
                Fill out the form below and we'll get back to you within 24 hours
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 rounded-xl border-2 ${darkMode
                      ? 'bg-blue-950/50 border-blue-500/30 text-white placeholder-blue-400/50 focus:border-blue-400'
                      : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      } outline-none transition-all duration-300 font-medium`}
                  />
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={`w-full px-5 py-4 rounded-xl border-2 ${darkMode
                        ? 'bg-blue-950/50 border-blue-500/30 text-white placeholder-blue-400/50 focus:border-blue-400'
                        : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                        } outline-none transition-all duration-300 font-medium`}
                    />
                  </div>

                  <div>
                    <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className={`w-full px-5 py-4 rounded-xl border-2 ${darkMode
                        ? 'bg-blue-950/50 border-blue-500/30 text-white placeholder-blue-400/50 focus:border-blue-400'
                        : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                        } outline-none transition-all duration-300 font-medium`}
                    />
                  </div>
                </div>

                {/* Company Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                    <Briefcase className="w-4 h-4" />
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className={`w-full px-5 py-4 rounded-xl border-2 ${darkMode
                      ? 'bg-blue-950/50 border-blue-500/30 text-white placeholder-blue-400/50 focus:border-blue-400'
                      : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      } outline-none transition-all duration-300 font-medium`}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                    <MessageSquare className="w-4 h-4" />
                    Your Requirement *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your requirements, quantity, timeline, etc."
                    className={`w-full px-5 py-4 rounded-xl border-2 ${darkMode
                      ? 'bg-blue-950/50 border-blue-500/30 text-white placeholder-blue-400/50 focus:border-blue-400'
                      : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      } outline-none transition-all duration-300 font-medium resize-none`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-5 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    } text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 group`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      Submit Enquiry
                    </>
                  )}
                </button>

                <p className={`text-sm text-center ${darkMode ? 'text-blue-400' : 'text-gray-500'}`}>
                  By submitting this form, you agree to our privacy policy
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {openSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-950' : 'bg-white'} rounded-3xl p-10 max-w-md w-full shadow-2xl transform animate-scale-in relative`}>
            <button
              onClick={handleDone}
              className={`absolute top-4 right-4 w-10 h-10 ${darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
            >
              <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
            </button>

            <div className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>

              <h3 className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Enquiry Submitted!
              </h3>

              <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-gray-600'} mb-8`}>
                Thank you for reaching out. Our team will contact you within 24 hours.
              </p>

              <button
                onClick={handleDone}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Done
              </button>
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
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
