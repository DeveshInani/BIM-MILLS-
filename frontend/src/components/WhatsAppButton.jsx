import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({
    phoneNumber = "+919890915839",
    message = "Hi, I would like to enquire about your products.",
    label = "Chat on WhatsApp",
    className = "",
    darkMode = false
}) => {
    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${darkMode
                ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-900/20'
                : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-500/30'
                } ${className}`}
        >
            <MessageCircle className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );
};

export default WhatsAppButton;
