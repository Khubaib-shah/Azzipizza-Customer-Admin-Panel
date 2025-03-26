import { Outlet, useLocation } from "react-router-dom";
import { ContextProvider } from "./context/dataContext";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import Footer from "./components/footer/Footer";
import "./index.css";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  return (
    <ContextProvider>
      <Header />
      <main className="bg-gray-100">
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
            <div className="col-span-3 hidden md:block bg-white p-4 filter drop-shadow-[-10px_0_15px_rgba(0,0,0,0.1)]">
              <SideBar />
            </div>
          )}
        </div>
      </main>
      <ToastContainer />

      <Footer />
    </ContextProvider>
  );
}

export default App;
