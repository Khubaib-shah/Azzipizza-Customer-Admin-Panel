import { Outlet, useLocation } from "react-router-dom";
import { ContextProvider } from "./context/dataContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";

import TrackOrder from "./components/TrackOrder";

function App() {
  const location = useLocation();

  const shouldHideHeaderFooter =
    location.pathname.startsWith("/order-success/") ||
    location.pathname === "/payment-error/" ||
    location.pathname === "/payment-success/" ||
    location.pathname === "/payment-cancelled/";

  return (
    <ErrorBoundary>
      <ContextProvider>
        <div className="min-h-screen flex flex-col">
          {!shouldHideHeaderFooter && <Header />}
          <main className="bg-gray-100 flex-grow relative">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <PageTransition key={location.pathname}>
                      <Outlet />
                    </PageTransition>
                  </Suspense>
                </AnimatePresence>
              </div>
            </div>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="toast-premium"
            bodyClassName="toast-body-premium"
            progressClassName="toast-progress-premium"
          />
          <TrackOrder />

          {!shouldHideHeaderFooter && <Footer />}
        </div>
      </ContextProvider>
    </ErrorBoundary>
  );
}

export default App;
