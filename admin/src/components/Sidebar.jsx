import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ShoppingBag, ChevronDown, Menu, X, LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) {
      setOpenSubmenu(null);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setOpenSubmenu(null);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { title: "Orders", icon: <ShoppingBag className="h-5 w-5" />, path: "/" },
    {
      title: "Menu Management",
      icon: <List className="h-5 w-5" />,
      submenu: [
        { title: "Add Items", path: "/add-items" },
        { title: "List Items", path: "/list-items" },
      ],
    },
  ];
  const logoutHandle = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-2 left-4 p-2 bg-white border border-gray-200 rounded-md shadow z-50001"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar + Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 pt-16 h-full w-64 bg-white border-r border-gray-200 shadow-md z-50 transition-transform duration-300 ease-in-out 
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button (Mobile Only) */}
          <button
            className="absolute top-4 right-4 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>

          <nav className="flex-1 py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div className="mb-1 cursor-pointer">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu(item.title);
                        }}
                        className={`flex items-center justify-between w-full p-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
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
                        <ul className="mt-1 ml-6 space-y-1 transition-all duration-300 ease-in-out">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                onClick={closeSidebar} // Close sidebar on click (mobile)
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
                      onClick={closeSidebar}
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
          <button
            className="flex items-center  w-full p-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 gap-3"
            onClick={logoutHandle}
          >
            <LogOut /> LogOut
          </button>

          <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              © 2023{" "}
              <a href="https://khubaib-portfolio-seven.vercel.app">
                Khubaib Shah
              </a>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
