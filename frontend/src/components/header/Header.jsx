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

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
      path: "/about",
      label: "About Us",
      icon: <AiOutlineInfoCircle className="text-[24px]" />,
    },
    {
      path: "/contact",
      label: "Contact Us",
      icon: <AiOutlinePhone className="text-[24px]" />,
    },
    {
      path: "/orders",
      label: "My Orders",
      icon: <MdHistory className="text-[24px]" />,
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-gray-300/30 dark:bg-gray-900/30 shadow-md backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "py-1" : "py-2"
        }`}
      >
        <div className="px-4 md:px-6">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo Section */}
            <Link
              to="/"
              className="h-[40px] flex items-center transition-transform hover:scale-105"
              aria-label="Home"
            >
              <img
                src={logo}
                className={`h-20 w-20 object-cover transition-all duration-300 ${
                  scrolled ? "h-16 w-16" : "h-20 w-20"
                }`}
                alt="Pizza Restaurant Logo"
              />
            </Link>

            {/* Centered Navigation Links and Icons */}
            <div className="flex flex-1 justify-center items-center gap-4 text-black dark:text-white">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-200 rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Navigation Icons */}
              <nav className="flex md:hidden items-center gap-4">
                {navItems.slice(0, 3).map((item) => (
                  <Link key={item.path} to={item.path} aria-label={item.label}>
                    {React.cloneElement(item.icon, {
                      className: `text-[24px] transition-colors duration-300 ${
                        scrolled ? "text-white" : "text-black"
                      }`,
                    })}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Cart Icon and Menu Button */}
            <div className="flex items-center gap-4">
              {/* Cart Icon with Dynamic Count */}
              <Link
                to="/cart"
                className="relative transition-transform hover:scale-110"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
                aria-label={`Cart (${cartCount} items)`}
              >
                <AiOutlineShoppingCart
                  className={`text-[26px] transition-colors duration-300 ${
                    scrolled ? "text-white" : "text-black"
                  } ${isCartHovered ? "text-amber-500" : ""}`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Menu Button */}
              <Button
                onClick={() => setOpen(!open)}
                variant="text"
                className="!min-w-[37px] !h-[37px] !rounded-full !p-0"
                aria-label="Menu"
              >
                <div
                  className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors duration-300 ${
                    scrolled ? "text-white" : "text-black"
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
