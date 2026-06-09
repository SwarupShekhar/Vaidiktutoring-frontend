'use client';

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
}

const BookConsultationButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="relative px-8 py-4 rounded-full border-none text-white cursor-pointer bg-[#4C70F5] hover:scale-105 active:scale-95 transition-transform duration-200 text-lg font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300" 
      onClick={onClick}
    >
      Book a free academic consultation
    </button>
  );
}

export default BookConsultationButton;
