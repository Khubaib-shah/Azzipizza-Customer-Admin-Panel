// src/components/Header.js
import React from "react";
const Header = () => {
  return (
    <header className="flex items-center h-16 px-6 bg-[#e0e0e0] shadow-md fixed w-full z-10">
      <img
        src="/Logo.jpg"
        alt="Logo"
        className="w-22 mr-3 roundedf transition-transform duration-300"
      />
      <h1 className="text-xl font-bold text-[#340036]">Admin Dashboard</h1>
    </header>
  );
};

export default Header;
