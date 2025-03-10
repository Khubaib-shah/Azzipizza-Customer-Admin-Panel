import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlinePhone,
} from "react-icons/ai";
import { MdOutlineMenu } from "react-icons/md";
import { Button } from "@mui/material";
import Context from "../../context/index";
import HeaderModal from "./headerModal/headerModal";
import logo from "../../assets/logo-pizza.png";

function Header() {
  const { cartItems } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Detect Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-300/30 dark:bg-gray-900/30 shadow-md backdrop-blur-sm">
        <div className="py-2 px-4 md:px-6">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="h-[40px] flex items-center">
              <img src={logo} className="h-20 w-20 object-cover" alt="Logo" />
            </Link>

            {/* Centered Navigation Links and Icons */}
            <div className="flex flex-1 justify-center items-center gap-4 text-black dark:text-white">
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/"
                  className="relative px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-200 rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-300"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="relative px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-200 rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-300"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="relative px-4 py-1.5 text-sm font-medium text-gray-900 bg-gray-200 rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-300"
                >
                  Contact Us
                </Link>
              </div>
              {/* Mobile Navigation Icons */}
              <div className="flex md:hidden items-center gap-4">
                <Link to="/">
                  <AiOutlineHome
                    className={`text-[24px] transition-colors duration-300 ${
                      scrolled ? "text-white" : "text-black"
                    }`}
                  />
                </Link>
                <Link to="/about">
                  <AiOutlineInfoCircle
                    className={`text-[24px] transition-colors duration-300 ${
                      scrolled ? "text-white" : "text-black"
                    }`}
                  />
                </Link>
                <Link to="/contact">
                  <AiOutlinePhone
                    className={`text-[24px] transition-colors duration-300 ${
                      scrolled ? "text-white" : "text-black"
                    }`}
                  />
                </Link>
              </div>
            </div>

            {/* Cart Icon and Menu Button */}
            <div className="flex items-center gap-4 relative">
              {/* Cart Icon with Dynamic Count */}
              <Link to="/cart" className="relative">
                <AiOutlineShoppingCart
                  className={`text-[26px] cursor-pointer transition-colors duration-300 ${
                    scrolled ? "text-white" : "text-black"
                  }`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* Menu Button */}
              <Button
                onClick={() => setOpen(!open)}
                variant="text"
                className="w-[37px] !min-w-[37px] h-[37px] !rounded-full"
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
      {open && <HeaderModal open={open} setOpen={setOpen} />}
    </>
  );
}

export default Header;
