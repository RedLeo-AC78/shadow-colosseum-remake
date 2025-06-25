
"use client"

import React, { useEffect, useState } from 'react';

const EndScreen = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in">
      {showText && (
        <div className="text-white text-4xl font-bold text-center animate-fade-in">
          <p>A suivre</p>
          <p className="mt-4">Merci d'avoir joué</p>
        </div>
      )}
    </div>
  );
};

export default EndScreen;
