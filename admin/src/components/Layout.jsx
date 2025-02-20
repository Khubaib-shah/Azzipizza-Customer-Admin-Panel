// this is a layout component create navigations here the in App.jsx with routes
import { Outlet } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";

const Layout = () => {
  return (
    <div className="">
      <Header />
      <main className="w-full mx-auto bg-amber-400 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
