import { Outlet, useLocation } from "react-router-dom";
import Context, { ContextProvider } from "./context";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import { useState } from "react";
import Footer from "./components/footer/Footer";
import "./index.css";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation(); // Get current route

  return (
    <ContextProvider value={{ cartItems, setCartItems }}>
      <Header />
      <main className="bg-gray-100 dark:bg-gray-800 dark:text-white">
        <div className="grid grid-cols-12">
          {/* Main Content - Outlet */}
          <div
            className={`${
              location.pathname === "/"
                ? "col-span-12 md:col-span-9"
                : "col-span-12"
            }`}
          >
            <Outlet />
          </div>

          {/* Sidebar only on Home Page */}
          {location.pathname === "/" && (
            <div className="col-span-3 hidden md:block bg-white dark:bg-gray-900 p-4 filter drop-shadow-[-10px_0_15px_rgba(0,0,0,0.1)]">
              <SideBar />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </ContextProvider>
  );
}

export default App;
