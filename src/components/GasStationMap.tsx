
import React from 'react';

const GasStationMap = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-green-400">
      {/* Ciel et arrière-plan */}
      <div className="absolute inset-0">
        {/* Route */}
        <div className="absolute bottom-0 w-full h-32 bg-gray-700">
          {/* Lignes de la route */}
          <div className="absolute top-1/2 w-full h-1 bg-yellow-300 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 w-full h-1 bg-yellow-300 transform -translate-y-1/2">
            <div className="flex justify-around h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-8 h-1 bg-yellow-300"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sol/herbe */}
        <div className="absolute bottom-32 w-full h-96 bg-green-500"></div>

        {/* Bâtiment principal de la station service */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          {/* Bâtiment principal */}
          <div className="relative">
            {/* Murs */}
            <div className="w-64 h-40 bg-red-600 border-2 border-red-800">
              {/* Toit */}
              <div className="absolute -top-8 -left-2 w-68 h-10 bg-red-800 transform -skew-y-1"></div>
              
              {/* Porte d'entrée */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-brown-600 border-2 border-brown-800">
                <div className="w-full h-full bg-gradient-to-r from-amber-700 to-amber-600"></div>
                {/* Poignée de porte */}
                <div className="absolute right-2 top-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-y-1/2"></div>
              </div>

              {/* Fenêtres */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-cyan-200 border-2 border-gray-400">
                <div className="w-full h-full bg-gradient-to-br from-white/50 to-cyan-100"></div>
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-200 border-2 border-gray-400">
                <div className="w-full h-full bg-gradient-to-br from-white/50 to-cyan-100"></div>
              </div>
            </div>

            {/* Enseigne */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-blue-600 border-2 border-blue-800 flex items-center justify-center">
              <span className="text-white text-xs font-bold">STATION</span>
            </div>
          </div>
        </div>

        {/* Pompes à essence */}
        <div className="absolute bottom-32 left-1/4 transform -translate-x-1/2">
          <div className="w-8 h-16 bg-red-500 border-2 border-red-700">
            <div className="absolute top-2 left-1/2 w-4 h-4 bg-black rounded transform -translate-x-1/2"></div>
            <div className="absolute bottom-2 left-1/2 w-2 h-6 bg-black transform -translate-x-1/2"></div>
          </div>
        </div>

        <div className="absolute bottom-32 right-1/4 transform translate-x-1/2">
          <div className="w-8 h-16 bg-red-500 border-2 border-red-700">
            <div className="absolute top-2 left-1/2 w-4 h-4 bg-black rounded transform -translate-x-1/2"></div>
            <div className="absolute bottom-2 left-1/2 w-2 h-6 bg-black transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Arbres d'arrière-plan */}
        <div className="absolute top-20 left-8">
          <div className="w-4 h-20 bg-amber-800"></div>
          <div className="absolute -top-8 left-1/2 w-16 h-16 bg-green-600 rounded-full transform -translate-x-1/2"></div>
        </div>

        <div className="absolute top-20 right-8">
          <div className="w-4 h-20 bg-amber-800"></div>
          <div className="absolute -top-8 left-1/2 w-16 h-16 bg-green-600 rounded-full transform -translate-x-1/2"></div>
        </div>

        {/* Nuages */}
        <div className="absolute top-8 left-1/4 w-20 h-8 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-12 right-1/3 w-16 h-6 bg-white rounded-full opacity-80"></div>
      </div>
    </div>
  );
};

export default GasStationMap;
