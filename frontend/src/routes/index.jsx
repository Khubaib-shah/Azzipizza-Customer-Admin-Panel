import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/ContactUs";
import Cart from "../pages/Cart";
import OrderHistory from "../pages/OrderHistory";
import PaymentSuccess from "../components/paymentPages/PaymentSuccess";
import PaymentError from "../components/paymentPages/PaymentError";
import PaymentCancelled from "../components/paymentPages/PaymentCancelled";

// components
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "my-orders-history",
        element: <OrderHistory />,
      },
      {
        path: "order-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-error",
        element: <PaymentError />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
    ],
  },
]);

export default router;
