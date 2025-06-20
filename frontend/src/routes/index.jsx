import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";
import Home from "../pages/Home";

const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/ContactUs"));
const Cart = lazy(() => import("../pages/Cart"));
const OrderSuccess = lazy(() =>
  import("../components/paymentPages/OrderSuccess")
);
const PaymentSuccess = lazy(() =>
  import("../components/paymentPages/PaymentSuccess")
);
const PaymentError = lazy(() =>
  import("../components/paymentPages/PaymentError")
);
const PaymentCancelled = lazy(() =>
  import("../components/paymentPages/PaymentCancelled")
);

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
        path: "order-success/:orderId",
        element: <OrderSuccess />,
      },
      {
        path: "payment-success",
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
