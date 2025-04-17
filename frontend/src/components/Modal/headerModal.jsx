import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import { IoCloseOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";

function HeaderModal({ open, setOpen }) {
  const [fullWidth, setFullWidth] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event) => {
      setFullWidth(!event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    handleMediaChange(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);
  const handleNavigate = () => {
    setOpen(false);
  };

  const location = useLocation();

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullWidth}>
      <div className="bg-white p-3 sm:p-4 md:w-[400px] w-full flex flex-col gap-3 sm:gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] sm:text-[18px] font-[500]">
            Il mio account
          </h2>
          <span
            onClick={() => setOpen(false)}
            tabIndex="-1"
            className="bg-none hover:bg-[rgba(0,0,0,0.2)] cursor-pointer p-1 rounded-full"
          >
            <IoCloseOutline className="text-[20px] sm:text-[22px]" />
          </span>
        </div>

        {/* Navigation Links */}
        <div className="mt-2">
          <ul className="border-b pb-2 border-gray-200">
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/contact"
                onClick={() => handleNavigate()}
                className={`flex items-center gap-2 text-[14px] sm:text-[16px] font-[500] cursor-pointer ${
                  location.pathname === "/contact"
                    ? "text-orange-500"
                    : "text-gray-800"
                }`}
              >
                <CiCircleInfo className="text-[20px] sm:text-[22px] " />
                Ti serve aiuto?
              </Link>
            </li>

            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/about"
                onClick={() => handleNavigate()}
                className={`flex items-center gap-2 text-[14px] sm:text-[16px] font-[500] cursor-pointer ${
                  location.pathname === "/about"
                    ? "text-orange-500"
                    : "text-gray-800"
                }`}
              >
                <AiOutlineInfoCircle className="text-[20px] sm:text-[22px] " />
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}

export default HeaderModal;
