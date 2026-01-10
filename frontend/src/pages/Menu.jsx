import { useState, useRef, useContext, useMemo } from "react";
import ProductCard from "../components/cards/ProductsCard";
import { PiListBulletsBold } from "react-icons/pi";
import Context from "../context/dataContext";
import MenuModal from "../components/Modal/MenuModel";
import ProductsListSkeleton from "../components/ProductsListSkeleton";
import TrackOrder from "../components/TrackOrder";
import { FaSearch, FaFilter, FaTh, FaList } from "react-icons/fa";

function Menu() {
    const { items, isLoading } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const categoryRefs = useRef({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const categoriesContainerRef = useRef(null);

    const menuItems = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return [...new Set(items.map((item) => item.category))];
    }, [items]);

    // Filter items
    const filteredItems = useMemo(() => {
        if (!items) return [];

        let filtered = items;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (activeCategory && activeCategory !== "all") {
            filtered = filtered.filter((item) => item.category === activeCategory);
        }

        return filtered;
    }, [items, searchQuery, activeCategory]);

    // Sort items
    const sortedItems = useMemo(() => {
        let sorted = [...filteredItems];

        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "name":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "discount":
                sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default:
                // Keep original order
                break;
        }

        return sorted;
    }, [filteredItems, sortBy]);

    // Separate offers
    const offerItems = useMemo(() => {
        return items?.filter(item => item.discount && item.discount > 0) || [];
    }, [items]);

    // Group by category
    const listing = useMemo(() => {
        const result = {};
        menuItems.forEach((category) => {
            const categoryItems = sortedItems.filter(
                (item) => item.category === category
            );
            if (categoryItems.length > 0) {
                result[category] = categoryItems;
            }
        });
        return result;
    }, [sortedItems, menuItems]);

    const visibleCategories = Object.keys(listing);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (category !== "all") {
            setTimeout(() => {
                const el = categoryRefs.current[category];
                if (el) {
                    const offset = 150;
                    const topPos = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top: topPos,
                        behavior: "smooth",
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream to-white">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
                    <p className="text-xl text-amber-200">
                        Explore our delicious selection of authentic Italian pizzas
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 pb-12" id="menu">
                {isLoading ? (
                    <ProductsListSkeleton />
                ) : items.length > 0 ? (
                    <>
                        {/* Special Offers Section */}
                        {offerItems.length > 0 && (
                            <section className="mb-12 animate-slide-up">
                                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8 border-2 border-red-200">
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <div className="decorative-line flex-grow max-w-[100px]"></div>
                                        <div className="text-center">
                                            <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full mb-2 animate-bounce">
                                                <span className="font-bold">🔥 SPECIAL OFFERS 🔥</span>
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-800">
                                                Limited Time Deals
                                            </h2>
                                        </div>
                                        <div className="decorative-line flex-grow max-w-[100px]"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {offerItems.slice(0, 8).map((item) => (
                                            <ProductCard key={item._id} product={item} />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Search and Filters */}
                        <div className="card-premium p-6 mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                                {/* Search Bar */}
                                <div className="md:col-span-5 relative">
                                    <FaSearch
                                        size={20}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search for your favorite pizza..."
                                        className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="col-span-1 md:col-span-3 relative">
                                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="default">Sort By: Default</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name: A-Z</option>
                                        <option value="discount">Best Offers</option>
                                    </select>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="col-span-2 md:col-span-2 flex gap-2 hidden md:block">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${viewMode === "grid"
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <FaTh className="inline mr-2" />
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${viewMode === "list"
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <FaList className="inline mr-2" />
                                        List
                                    </button>
                                </div>

                                {/* Menu Button */}
                                <div className="hidden md:col-span-2">
                                    <button
                                        className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <PiListBulletsBold className="inline mr-2" size={20} />
                                        Categories
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="glass sticky top-[80px] z-30 py-4 px-4 rounded-2xl shadow-lg mb-6 overflow-visible">
                            <div
                                ref={categoriesContainerRef}
                                className="flex overflow-x-auto gap-4 styled-scrollbar whitespace-nowrap p-2"
                            >
                                <button
                                    onClick={() => handleCategoryClick("all")}
                                    className={`px-6 py-2.5 font-semibold text-sm transition-all duration-300 rounded-full uppercase shadow-md ${activeCategory === "all"
                                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white scale-105"
                                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300"
                                        }`}
                                >
                                    All Items
                                </button>
                                {menuItems?.map((item) => (
                                    <button
                                        key={item}
                                        className={`px-6 py-2.5 font-semibold text-sm transition-all duration-300 rounded-full uppercase shadow-md ${activeCategory === item
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white scale-105"
                                            : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300"
                                            }`}
                                        onClick={() => handleCategoryClick(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Display */}
                        {searchQuery || activeCategory !== "all" ? (
                            // Search/Filter Results
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {searchQuery ? `Search Results for "${searchQuery}"` : `${activeCategory}`}
                                    </h2>
                                    <p className="text-gray-600">
                                        {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"} found
                                    </p>
                                </div>
                                {sortedItems.length > 0 ? (
                                    <div className={viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "space-y-4"
                                    }>
                                        {sortedItems.map((item) => (
                                            <ProductCard key={item._id} product={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-xl text-gray-500">
                                            No items found. Try adjusting your search or filters.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Category View
                            visibleCategories.map((category) => (
                                <div
                                    key={category}
                                    ref={(el) => (categoryRefs.current[category] = el)}
                                    className="mt-10 mb-8"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="decorative-line flex-grow max-w-[100px]"></div>
                                        <h2 className="text-2xl sm:text-3xl font-bold capitalize text-gray-800">
                                            {category}
                                        </h2>
                                        <div className="decorative-line flex-grow"></div>
                                    </div>
                                    <p className="text-center text-gray-600 mb-6 italic">
                                        Handcrafted with love and authentic Italian ingredients
                                    </p>
                                    {listing[category]?.length > 0 && (
                                        <div className={viewMode === "grid"
                                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                            : "space-y-4"
                                        }>
                                            {listing[category].map((item) => (
                                                <ProductCard key={item._id} product={item} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h1 className="font-mono text-gray-500 tracking-tight text-xl">
                            No items available. Please check back later.
                        </h1>
                    </div>
                )}



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
        </div>
    );
}

export default Menu;
