import { Button, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// icons
import {
  IoBusinessOutline,
  IoCloseOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { CiDiscount1, CiCircleInfo } from "react-icons/ci";
import { MdOutlineDeliveryDining } from "react-icons/md";

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

        {/* Login/Signup Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 mt-2">
          <Button className="w-1/2 !bg-[#EDE9E5] hover:!bg-[rgb(216,212,208)] !text-[#000] !font-[600] !text-[14px] !rounded-full">
            Accedi
          </Button>
          <Button className="w-1/2 !bg-[#F36805] hover:!bg-[rgb(243,73,5)] !text-white !font-[600] !rounded-full">
            Crea un account
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="mt-2">
          <ul className="border-b pb-2 border-gray-200">
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/cartefedeltà"
                className="flex items-center gap-2 text-[14px] sm:text-[16px] font-[500]"
              >
                <CiDiscount1 className="text-[20px] sm:text-[22px]" />
                Carte Fedeltà
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/cartefedeltà"
                className="flex items-center gap-2 text-[14px] sm:text-[16px] font-[500]"
              >
                <CiCircleInfo className="text-[20px] sm:text-[22px]" />
                Ti serve aiuto?
              </Link>
            </li>
          </ul>

          <ul className="mt-2">
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/cartefedeltà"
                className="flex items-center gap-2 text-[14px] sm:text-[16px] font-[500]"
              >
                <MdOutlineDeliveryDining className="text-[20px] sm:text-[22px]" />
                Diventa rider
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/cartefedeltà"
                className="flex items-center gap-2 text-[14px] sm:text-[16px] font-[500]"
              >
                <IoBusinessOutline className="text-[20px] sm:text-[22px]" />
                Just Eat for business
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link
                to="/cartefedeltà"
                className="flex items-center gap-2 text-[14px] sm:text-[16px] font-[500]"
              >
                <IoStorefrontOutline className="text-[20px] sm:text-[22px]" />
                Diventa Partner
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}

export default HeaderModal;
