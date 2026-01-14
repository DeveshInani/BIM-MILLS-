import { useState } from 'react';
import { X, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import api from '../api/axiosClient';

export default function CancelOrder({ mode = 'light' }) {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error', 'requesting'
  const [message, setMessage] = useState('');

  const darkMode = mode === 'dark';

  const handleRequestCancellation = async () => {
    if (!orderId || !email) {
      alert('Please enter both Order ID and Email');
      return;
    }

    try {
      setLoading(true);
      setStatus('requesting');

      // Request cancellation (this marks it in admin, doesn't delete)
      const response = await api.post(`/api/orders/${orderId}/request-cancellation`, {
        email: email
      });
      
      setStatus('success');
      setMessage(`✅ Cancellation request submitted! Order #${orderId} has been marked for cancellation. An admin will review and process your request shortly. You'll receive a confirmation email once it's completed.`);
      setOrderId('');
      setEmail('');

    } catch (err) {
      console.error('Cancellation request failed:', err);
      setStatus('error');
      
      if (err.response?.status === 404) {
        setMessage('❌ Order not found. Please check your Order ID.');
      } else if (err.response?.status === 403) {
        setMessage('❌ Email does not match the order. Please check and try again.');
      } else {
        setMessage('❌ Failed to submit cancellation request. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 sm:py-12 px-4 transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-gray-50'
    }`}>
      <div className={`max-w-2xl mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Cancel Order</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Request to cancel your order - an admin will review and process it
          </p>
        </div>

        {/* Success State */}
        {status === 'success' && (
          <div className={`rounded-lg p-6 mb-6 text-center ${
            darkMode ? 'bg-green-900/30' : 'bg-green-50'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-8 h-8 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <p className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-green-400' : 'text-green-700'
            }`}>{message}</p>
            <button
              onClick={() => {
                setStatus(null);
                setMessage('');
              }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Request Another Cancellation
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className={`rounded-lg p-6 mb-6 ${
            darkMode ? 'bg-red-900/30' : 'bg-red-50'
          }`}>
            <p className={`text-lg font-semibold ${
              darkMode ? 'text-red-400' : 'text-red-700'
            }`}>{message}</p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <div className={`rounded-lg p-6 mb-6 ${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Order ID *</label>
                <input
                  type="number"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } disabled:opacity-50`}
                  placeholder="e.g., 1234"
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  You can find this in your order confirmation email
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } disabled:opacity-50`}
                  placeholder="your@email.com"
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Must match the email used when placing the order
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className={`mt-6 p-4 rounded-lg border ${
              darkMode
                ? 'bg-blue-900/20 border-blue-500/30'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>How it works:</p>
                  <ul className={`text-sm mt-2 space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <li>✓ Enter your Order ID and email to submit a cancellation request</li>
                    <li>✓ An admin will review your request</li>
                    <li>✓ Once approved, your order will be cancelled</li>
                    <li>✓ You'll receive a confirmation email</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setOrderId('');
                  setEmail('');
                  setStatus(null);
                  setMessage('');
                  window.location.href = '/';
                }}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Back to Home
              </button>
              <button
                onClick={handleRequestCancellation}
                disabled={loading || !orderId || !email}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Request Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Help */}
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <strong>Need help?</strong> If you're having trouble, please contact us at support@bimmills.com
          </p>
        </div>
      </div>
    </div>
  );
}
