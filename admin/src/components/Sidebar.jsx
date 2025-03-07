import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ShoppingBag, LogOut, ChevronDown } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      title: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/",
    },
    {
      title: "Menu Management",
      icon: <List className="h-5 w-5" />,
      submenu: [
        { title: "Add Items", path: "/add-items" },
        { title: "List Items", path: "/list-items" },
      ],
    },
    // {
    //   title: "Customers",
    //   icon: <Users className="h-5 w-5" />,
    //   path: "/customers",
    // },
    // {
    //   title: "Settings",
    //   icon: <Settings className="h-5 w-5" />,
    //   path: "/settings",
    // },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full mt-16 shadow-sm z-0 transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`flex items-center justify-between w-full p-2.5 rounded-md text-sm font-medium transition-colors ${
                        openSubmenu === item.title
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSubmenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubmenu === item.title && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-md text-sm transition-colors ${
                                isActive(subItem.path)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 p-2.5 w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <LogOut className="h-5 w-5 text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
