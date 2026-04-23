import React from "react";
import { motion } from "framer-motion";

const ToggleButton = ({ restaurantOpen, toggleStatus }) => {
  return (
    <button
      onClick={toggleStatus}
      className={`relative w-14 h-7 rounded-full p-1 transition-all duration-500 cursor-pointer shadow-inner ${
        restaurantOpen ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <motion.div
        animate={{ 
          x: restaurantOpen ? 28 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="size-5 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden"
      >
        <div className={`size-1.5 rounded-full ${restaurantOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
      </motion.div>
    </button>
  );
};

export default ToggleButton;
