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

        <DropdownMenuContent className="w-64 bg-white shadow-lg rounded-lg p-2 z-1000">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No notifications
            </p>
          ) : (
            notifications.map((notify) => {
              return (
                <DropdownMenuItem
                  key={notify.id}
                  className="text-sm p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/`)}
                >
                  <p className="font-semibold">{notify.message}</p>

                  {Array.isArray(notify.items?.items) ? (
                    notify.items.items.map((item, index) =>
                      item.menuItem ? (
                        <div key={index} className="text-xs text-gray-600 ml-2">
                          {item.menuItem.name} - {item.quantity}x
                        </div>
                      ) : (
                        <div key={index} className="text-xs text-red-500 ml-2">
                          ⚠️ Item data missing!
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-xs text-red-500 ml-2">
                      ⚠️ No items found in this order.
                    </p>
                  )}
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
