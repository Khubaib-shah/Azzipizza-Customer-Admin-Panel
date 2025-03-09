import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const NotificationBar = () => {
  const { notifications, setNotifications } = useNotifications();
  console.log(notifications);
  const navigate = useNavigate();

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="flex items-center gap-3 ml-auto relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
          {notifications.length > 0 && (
            <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 bg-white shadow-lg rounded-lg p-2">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No notifications
            </p>
          ) : (
            notifications.map((notify) => {
              return (
                <DropdownMenuItem
                  key={notify.id}
                  className="text-sm p-2 hover:bg-gray-100"
                  onClick={() => navigate(`/`)}
                >
                  <p className="font-semibold">{notify.message}</p>
                  {/* Show menu items */}
                  {/* {notify.items.map((item, index) => ( */}
                  <div className="text-xs text-gray-600 ml-2">
                    {/* {notify.name} - {notify.items[0].quantity}x */}
                  </div>
                  {/* ))} */}
                </DropdownMenuItem>
              );
            })
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearNotifications}
              className="w-full text-center text-blue-500 text-sm mt-2"
            >
              Clear All
            </button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationBar;
