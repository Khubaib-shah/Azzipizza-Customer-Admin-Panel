import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddItems from "./pages/AddItems";
import ListItems from "./pages/ListItems";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Header from "./components/common/Header";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-12 gap-0">
          {/* Sidebar: Fixed on the left */}
          <div className="col-span-3 md:col-span-3 lg:col-span-3">
            <Sidebar />
          </div>

          {/* Main Content: Pushed to the right */}
          <main className="col-span-1 md:col-span-7 lg:col-span-9 p-6 transition-all duration-300 mt-16 ">
            <Routes>
              <Route path="/add-items" element={<AddItems />} />
              <Route path="/list-items" element={<ListItems />} />
              <Route path="/" element={<Orders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
