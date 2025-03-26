import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import Cart from "../pages/CartPage";
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
