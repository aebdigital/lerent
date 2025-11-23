import React from 'react';
import logo from '../logoRENT.svg';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={logo}
            alt="LeRent Logo"
            className="h-24 md:h-32 mx-auto"
          />
        </div>

        {/* Maintenance Text */}
        <h1 className="text-white text-2xl md:text-4xl font-goldman font-bold mb-4">
          Na stránke sa pracuje
        </h1>

        <p className="text-gray-400 text-lg md:text-xl">
          Čoskoro sa vrátime
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
