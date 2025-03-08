import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

const NotificationBar = ({ notifications, setNotifications }) => {
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  return (
    <>
      {/* Notification Bell */}
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
              notifications.map(
                (notify, index) => (
                  console.log(notify),
                  (
                    <DropdownMenuItem
                      key={notify.id * index}
                      className="text-sm p-2 hover:bg-gray-100"
                    >
                      <p className="font-semibold">{notify.message}</p>

                      {notify.items?.map((item, index) => (
                        <div key={index} className="text-xs text-gray-600 ml-2">
                          {item.menuItem.name} - {item.quantity}x
                        </div>
                      ))}
                    </DropdownMenuItem>
                  )
                )
              )
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
    </>
  );
};

export default NotificationBar;
