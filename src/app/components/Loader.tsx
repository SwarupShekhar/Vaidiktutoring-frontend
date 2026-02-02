'use client';
import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default Loader;
