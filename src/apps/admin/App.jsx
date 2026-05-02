// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddItems from "./pages/AddItems";
import ListItems from "./pages/ListItems";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";
import Header from "./components/common/Header";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AudioManager from "./components/AudioManager";

const App = () => {
  return (
    <Router>
      <AudioManager />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 md:ml-64">
                  <Header />
                  <main className="flex-1 transition-all duration-300 mt-20">
                    <Routes>
                      <Route path="/add-items" element={<AddItems />} />
                      <Route path="/list-items" element={<ListItems />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/" element={<Orders />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
