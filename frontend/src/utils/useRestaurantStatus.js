import { useEffect, useState } from "react";
import { baseUri } from "../config/config";

export function useRestaurantStatus() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await baseUri.get("/api/settings/restaurant-status");
        setIsOpen(res.data.isOpen);
        console.log(res.data.isOpen);

      } catch (err) {
        console.error(err);
      }

    };

    fetchStatus();
  }, []);

  return { isOpen };
}
