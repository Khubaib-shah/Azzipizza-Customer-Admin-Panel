import { useState, useRef, useContext } from "react";
import ProductCard from "../cards/ProductsCard"; // Ensure correct path
import { MdGroups, MdStarOutline, MdInfoOutline } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { FaBicycle, FaSearch } from "react-icons/fa";

import Context from "../../context/dataContext";
import MenuModal from "../Modal/MenuModel";
import CompanyDetails from "../CompanyDetails";
// Main Products List Component
function ProductsList() {
  const { items } = useContext(Context);
  const [activeCategory, setActiveCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryRefs = useRef({});

  const menuItems = [...new Set(items.map((item) => item.category))];

  const listing = menuItems.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category);
    return acc;
  }, {});

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        window.scrollBy(0, -100);
      }, 300);
    }
  };

  return (
    <div className="container  mx-auto px-4 pt-5 mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl sm:text-xl font-bold text-center sm:text-left lg:text-3xl md:text-[18px] flex-1">
          Azzipizza Mica Pizza
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
              className={`px-5 py-1 font-semibold text-sm sm:text-base transition rounded-md uppercase ${
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
          <h2 className="text-lg sm:text-xl font-semibold capitalize">
            {category}
          </h2>
          {listing[category]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {listing[category].map((item) => (
                <ProductCard key={item._id} products={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No items available in this category.
            </p>
          )}
        </div>
      ))}

      <CompanyDetails />

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
