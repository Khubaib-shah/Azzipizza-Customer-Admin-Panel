import React from "react";
import NotificationBar from "../NotificationBar";

const Header = () => {
  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-200 fixed w-full z-100">
      <div className="flex items-center gap-2 ms-14 md:ms-0 ">
        <div className="bg-primary/90 text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center">
          <span className="font-bold text-lg">A</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
          zzipizza
        </h1>
      </div>
      <NotificationBar />
    </header>
  );
};

export default Header;
