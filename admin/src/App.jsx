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
        <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-6 md:grid-rows-5 gap-0">
          <Sidebar className="col-start-1 col-end-2 row-start-1 row-end-6" />
          <main className="col-start-2 col-end-6 row-start-1 row-end-6 p-6 transition-all duration-300 mt-16">
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
