import React from "react";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-primary/90 text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center">
            <span className="font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
            zzipizza
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
