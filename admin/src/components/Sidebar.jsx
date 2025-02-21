// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white fixed h-full mt-16 transform transition-all duration-300 ease-in-out">
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/add-items"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
            >
              <span className="ml-3 group-hover:text-blue-400 transition-colors">
                Add Items
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/list-items"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
            >
              <span className="ml-3 group-hover:text-blue-400 transition-colors">
                List Items
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
            >
              <span className="ml-3 group-hover:text-blue-400 transition-colors">
                Orders
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
