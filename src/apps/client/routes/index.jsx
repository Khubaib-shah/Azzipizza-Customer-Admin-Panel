import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "../App";

const Landing = lazy(() => import("../pages/Landing"));
const Menu = lazy(() => import("../pages/Menu"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/ContactUs"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
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
        element: <Landing />,
      },
      {
        path: "menu",
        element: <Menu />,
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
      {
        path: "my-orders",
        element: <MyOrders />,
      },
    ],
  },
]);

export default router;
