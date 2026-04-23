import { useState, useEffect } from "react";
import NotificationBar from "../NotificationBar";
import { baseUri } from "@shared/config/api";
import ToggleButton from "../ToggleButton";

const Header = () => {
  const [restaurantOpen, setRestaurantOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await baseUri.get("/api/settings/restaurant-status");
        setRestaurantOpen(res.data.isOpen);
      } catch (error) {
        console.error("Failed to fetch restaurant status:", error);
      }
    };
    fetchStatus();
  }, []);

  const toggleStatus = async () => {
    try {
      await baseUri.post("/api/settings/restaurant-status", {
        isOpen: !restaurantOpen,
      });
      setRestaurantOpen(!restaurantOpen);
    } catch (error) {
      console.error("Failed to update restaurant status:", error);
    } finally {
    }
  };

  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-6 bg-red-600 shadow-xl fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-500 transition-all duration-300">
      <div className="flex items-center gap-3 ms-12 md:ms-0">
        <div className="hidden sm:block">
          <h1 className="text-2xl font-serif font-bold !text-white tracking-tight">
            Azzipizza <span className="text-amber-300 text-sm italic font-sans font-normal ml-1">Admin</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="px-4">
          <ToggleButton restaurantOpen={restaurantOpen} toggleStatus={toggleStatus} />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
          <NotificationBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
