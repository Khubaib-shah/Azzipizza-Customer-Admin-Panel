import { useState, useRef, useContext, useMemo } from "react";
import ProductCard from "../cards/ProductsCard"; // Ensure correct path
import { MdStarOutline } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { FaBicycle, FaSearch } from "react-icons/fa";
import smoothscroll from "smoothscroll-polyfill";
import Context from "../../context/dataContext";
import MenuModal from "../Modal/MenuModel";
import CompDetails from "../CompDetails";
import ProductsListSkeleton from "../ProductsListSkeleton";

// Main Products List Component
function ProductsList() {
  const { items, isLoading, error } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] = useState("pizze rosse");

  const menuItems = [...new Set(items.map((item) => item.category))];

  smoothscroll.polyfill();

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    return items?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Group filtered items by category
  const listing = useMemo(() => {
    const result = {};

    menuItems.forEach((category) => {
      const categoryItems = filteredItems.filter(
        (item) => item.category === category
      );
      if (categoryItems.length > 0) {
        result[category] = categoryItems;
      }
    });

    return result;
  }, [filteredItems, menuItems]);
  const categoriesContainerRef = useRef(null);
  const visibleCategories = Object.keys(listing);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    requestAnimationFrame(() => {
      const el = categoryRefs.current[category];
      if (el) {
        const offset = 125;
        const topPos = el.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: topPos,
          behavior: "smooth",
        });
      }
    });
  };

  return (
    <div className="container  mx-auto px-4 pt-5 mt-3">
      {/* Header */}
      {isLoading ? (
        <ProductsListSkeleton />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl sm:text-xl font-bold text-center sm:text-left lg:text-3xl md:text-[18px] flex-1">
              Azzipizza Mica Pizza e Fichi
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <MdStarOutline size={22} className="text-amber-500" />
                <p className="text-sm">0 Recensioni</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-600 text-white px-3 py-1 rounded-md">
                <FaBicycle size={18} />
                <p>Gratis</p>
              </div>
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
              className="pl-10 pr-3 py-2 w-full border border-amber-500 rounded-3xl focus:ring-0 focus:ring-sky-500 text-sm sm:text-base "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Reset active category when searching
                if (e.target.value) {
                  setActiveCategory("");
                }
              }}
            />
          </div>

          {/*  Menu Items (Scrollable on Mobile) */}
          {!searchQuery && (
            <div className="flex items-center justify-between sticky top-16 bg-white z-10 py-2 px-4 shadow-md rounded-md w-full mt-4">
              <div
                ref={categoriesContainerRef} // Add this ref
                className="flex overflow-x-auto gap-2 w-full hide-scrollbar whitespace-nowrap"
              >
                {menuItems?.map((item) => (
                  <button
                    key={item}
                    className={`px-5 py-1 font-semibold text-sm sm:text-base transition rounded-md uppercase ${
                      activeCategory === item
                        ? "bg-orange-400 text-white"
                        : "text-black hover:bg-orange-400 cursor-pointer hover:text-white"
                    }`}
                    onClick={(e) => {
                      handleCategoryClick(item);
                      // Scroll to center the clicked button
                      const container = categoriesContainerRef.current;
                      const button = e.target;
                      const containerWidth = container.offsetWidth;
                      const buttonLeft = button.offsetLeft;
                      const buttonWidth = button.offsetWidth;

                      container.scrollTo({
                        left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                className="w-20 h-10 flex items-center justify-center bg-white-200 hover:bg-white-300 rounded-md transition ml-2 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <PiListBulletsBold size={22} />
              </button>
            </div>
          )}
        </>
      )}
      {/* Product Categories & Listing */}
      {searchQuery ? (
        // Show all filtered items in one section when searching
        <div className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold capitalize">
            Risultati della ricerca
          </h2>
          {filteredItems.length > 0 ? (
            <div className="grid md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {filteredItems.map((item) => (
                <ProductCard key={item._id} products={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Nessun prodotto trovato per "{searchQuery}"
            </p>
          )}
        </div>
      ) : (
        // Show items grouped by category when not searching
        visibleCategories.map((category) => (
          <div
            key={category}
            ref={(el) => (categoryRefs.current[category] = el)}
            className="mt-6"
          >
            <h2 className="text-lg sm:text-xl font-semibold capitalize">
              {category}
            </h2>
            {listing[category]?.length > 0 ? (
              <div className="relative mt-4">
                {/* Scrollable container for product cards */}
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap scroll-smooth styled-scrollbar pb-4">
                  {listing[category].map((item) => (
                    <div
                      key={item._id}
                      className="inline-block flex-shrink-0 w-[250px]"
                    >
                      <ProductCard products={item} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No items available in this category.
              </p>
            )}
          </div>
        ))
      )}
      <CompDetails />

      {isModalOpen && (
        <MenuModal
          menuItems={menuItems}
          activeCategory={activeCategory}
          onClose={() => setIsModalOpen(false)}
          onSelectCategory={(category) => {
            handleCategoryClick(category);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ProductsList;
