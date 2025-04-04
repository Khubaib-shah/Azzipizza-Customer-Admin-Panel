import { Outlet, useLocation } from "react-router-dom";
import { ContextProvider } from "./context/dataContext";
import Header from "./components/header/Header";
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
            className={`${location?.pathname === "/" ? "col-span-12" : "col-span-12"
              }`}
          >
            <Outlet />
          </div>

          {/* Sidebar only on Home Page */}
        </div>
      </main>
      <ToastContainer />

      <Footer />
    </ContextProvider>
  );
}

export default App;
