import { useState, useRef } from "react";
import { listing, menuItems } from "./productdata";
import ProductCard from "../cards/products.card"; // Ensure correct path
import { MdGroups, MdStarOutline, MdInfoOutline } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { FaBicycle, FaSearch } from "react-icons/fa";
import Companydetails from "../companydetails";

function MenuModal({ menuItems, onClose, onSelectCategory }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-xl shadow-xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold">Menu Items</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold p-2 rounded hover:bg-red-100"
          >
            ✖
          </button>
        </div>
        <ul className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="text-lg cursor-pointer p-3 bg-white text-black hover:bg-black hover:text-white rounded-md transition"
              onClick={() => {
                onSelectCategory(item);
                onClose();
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Main Products List Component
function ProductsList() {
  const [activeCategory, setActiveCategory] = useState(
    menuItems[0] || "Pizze Rosse"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryRefs = useRef({});

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-5 mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          Azzipizza Mica Pizza e Fichi
        </h1>
        <div className="flex gap-3 mt-3 sm:mt-0">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-transparent hover:bg-gray-300 rounded-lg transition text-sm sm:text-base">
            <MdGroups size={22} className="text-orange-500" />
            <span>Ordini di gruppo</span>
          </button>
          <button className="p-2 bg-transparent hover:bg-gray-300 rounded-lg transition">
            <MdInfoOutline size={24} />
          </button>
        </div>
      </div>

      {/* Rating & Delivery */}
      <div className="flex flex-wrap items-center gap-4 mt-3">
        <div className="flex items-center gap-2">
          <MdStarOutline size={22} className="text-amber-500" />
          <p className="text-sm">0 Recensioni</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-600 text-white px-3 py-1 rounded-md">
          <FaBicycle size={18} />
          <p>Gratis</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mt-5">
        <FaSearch
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500"
        />
        <input
          type="text"
          placeholder="Cerca il prodotto..."
          className="pl-10 pr-3 py-2 w-full border rounded-3xl focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
        />
      </div>

      {/* Menu Items (Scrollable on Mobile) */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex overflow-x-auto gap-2 w-full hide-scrollbar whitespace-nowrap">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`px-5 py-1 font-semibold text-sm sm:text-base transition rounded-md ${
                activeCategory === item
                  ? "bg-black text-white"
                  : "text-black hover:bg-black hover:text-white"
              }`}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="w-20 h-10 flex items-center justify-center bg-white-200 hover:bg-white-300 rounded-md transition ml-2"
          onClick={() => setIsModalOpen(true)}
        >
          <PiListBulletsBold size={22} />
        </button>
      </div>

      {/* Product Categories & Listing */}
      {menuItems.map((category) => (
        <div
          key={category}
          ref={(el) => (categoryRefs.current[category] = el)}
          className="mt-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold">{category}</h2>
          {listing[category]?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {listing[category].map((item) => (
                <ProductCard key={item.id} products={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No items available in this category.
            </p>
          )}
        </div>
      ))}

      <Companydetails />

      {/* Render Modal */}
      {isModalOpen && (
        <MenuModal
          menuItems={menuItems}
          onClose={() => setIsModalOpen(false)}
          onSelectCategory={handleCategoryClick}
        />
      )}
    </div>
  );
}

export default ProductsList;
