import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlinePhone,
} from "react-icons/ai";
import { MdOutlineMenu, MdHistory } from "react-icons/md";
import { Button } from "@mui/material";
import Context from "../../context/dataContext";
import HeaderModal from "../Modal/headerModal";
import logo from "../../assets/logo-pizza.png";

function Header() {
  const { cartItems } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [activePage, setActivePage] = useState("Home");

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle page change
  const handlePageChange = (page) => {
    setActivePage(page);
    console.log("Current page:", page);
    // Close the menu after selecting a page
    setOpen(false);
  };

  // Detect Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items for DRY code
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: <AiOutlineHome className="text-[24px]" />,
    },
    {
      path: "/my-orders-history",
      label: "My Orders",
      icon: <MdHistory className="text-[24px]" />,
    },

    {
      path: "/contact",
      label: "Contact Us",
      icon: <AiOutlinePhone className="text-[24px]" />,
    },

    {
      path: "/about",
      label: "About Us",
      icon: <AiOutlineInfoCircle className="text-[24px]" />,
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur-lg dark:bg-gray-900/70 shadow-md transition-all duration-300 ${
          scrolled ? "py-1" : "py-3"
        }`}
      >
        <div className="px-4 md:px-6">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center transition-transform hover:scale-105"
            >
              <img
                src={logo}
                alt="Pizza Logo"
                className={`object-contain transition-all duration-300 ${
                  scrolled ? "h-14 w-14" : "h-16 w-16"
                }`}
              />
            </Link>

            {/* Navigation */}
            <div className="flex flex-1 justify-center items-center gap-4 text-black dark:text-white">
              {/* Desktop */}
              <nav className="hidden md:flex gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => handlePageChange(item.label)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activePage === item.label
                        ? "bg-orange-300 text-white shadow-md"
                        : "bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Icons */}
              <nav className="flex md:hidden items-center gap-4">
                {navItems.slice(0, 3).map((item) => (
                  <Link key={item.path} to={item.path} aria-label={item.label}>
                    {React.cloneElement(item.icon, {
                      className: `text-[24px] transition-colors duration-300 ${
                        scrolled ? "text-black dark:text-white" : "text-black"
                      }`,
                    })}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side: Cart & Menu */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative hover:scale-110 transition-transform"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <AiOutlineShoppingCart
                  className={`text-[26px] transition duration-300 ${
                    isCartHovered
                      ? "text-amber-500"
                      : scrolled
                      ? "text-black dark:text-white"
                      : "text-black"
                  }`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Menu Button */}
              <Button
                onClick={() => setOpen(!open)}
                variant="text"
                className="!min-w-[40px] !h-[40px] !p-0 !rounded-full"
              >
                <div
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors duration-300 ${
                    scrolled ? "text-black dark:text-white" : "text-black"
                  }`}
                >
                  <MdOutlineMenu className="text-[26px]" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Responsive Menu Modal */}
      <HeaderModal open={open} setOpen={setOpen} navItems={navItems} />
    </>
  );
}

export default Header;
