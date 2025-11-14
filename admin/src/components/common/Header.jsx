import { useState, useEffect } from "react";
import NotificationBar from "../NotificationBar";
import { baseUri } from "../../config/config";
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
    <header className="flex items-center justify-between  h-16 px-6 bg-white border-b border-gray-200 fixed w-full z-500">
      <div className="flex items-center gap-2 ms-14 md:ms-0">
        <div className="bg-primary/90 text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center">
          <span className="font-bold text-lg">A</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
          zzipizza
        </h1>
      </div>


      <div className="flex gap-6">
        <ToggleButton restaurantOpen={restaurantOpen} toggleStatus={toggleStatus} />
        <NotificationBar />
      </div>
    </header>
  );
};

export default Header;
