// this is a layout component create navigations here the in App.jsx with routes
import { Outlet } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
