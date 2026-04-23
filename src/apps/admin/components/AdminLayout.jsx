import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./common/Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-12 gap-0">
        <div className="col-span-3 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>

        <main className="col-span-1 md:col-span-7 lg:col-span-10 transition-all duration-300 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
