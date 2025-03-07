import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="flex items-center h-16 px-6 bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-primary/90 text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center">
            <span className="font-bold text-lg">R</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
            Restaurant Admin
          </h1>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-primary/50"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <span className="font-medium text-sm">AD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
