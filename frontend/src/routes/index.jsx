import { createBrowserRouter } from "react-router-dom";

// components
import App from "../App";
import Home from "../pages/Home";
import ContactUs from "../pages/ContactUs";
import Cart from "../pages/CartPage";
import AboutUs from "../pages/aboutUs";

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
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
]);

export default router;
