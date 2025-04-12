import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import Context from "../../context/dataContext";
import { toast } from "react-toastify";
import Modal from "../Modal/ProductDetailModal";

function ProductCard({ products }) {
  const { addToCart } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log(products, selectedToppings);
    addToCart(products, selectedToppings);
    toast.success(`${products.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const rating = products.rating || Math.floor(Math.random() * 50) + 100;
  const reviews = products.reviews || Math.floor(Math.random() * 50) + 100;

  const handleTopping = (e, ingredient) => {
    setSelectedToppings((prev) => {
      if (e.target.checked) {
        return [...prev, ingredient];
      } else {
        return prev.filter((item) => item._id !== ingredient._id);
      }
    });
  };

  return (
    <>
      {/* Product Card */}
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden relative transition-transform hover:-translate-y-1 flex flex-col h-full w-full cursor-pointer"
        onClick={openModal}
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={products.image}
            alt={products.name}
            loading="lazy"
          />

          {products.category !== "bibite" && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded truncate max-w-[80%]">
              Popular
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h1 className="text-lg font-bold text-gray-800 truncate flex-1 capitalize">
              {products.name}
            </h1>
            <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-2 py-1 rounded whitespace-nowrap shrink-0">
              ${products.price.toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
            {products.description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            {/* Rating */}
            <div className="flex items-center min-w-0">
              <div className="flex shrink-0">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 shrink-0 ${
                      i < Math.floor(rating)
                        ? "text-amber-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center min-w-0 ml-1">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {rating}
                </span>
                {reviews && (
                  <span className="text-sm text-gray-500 ml-1 truncate">
                    ({reviews})
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full transition-colors shadow-md hover:shadow-lg active:scale-95 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
              aria-label={`Add ${products.name} to cart`}
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 overflow-y-auto">
              {/* Product Image */}
              <div className="relative w-full aspect-square">
                <img
                  className="w-full h-full object-cover"
                  src={products.image}
                  alt={products.name}
                />
                {products.category !== "bibite" && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {products.name}
                </h1>

                <div className="flex items-center mb-4">
                  <span className="text-xl font-bold text-amber-600">
                    ${products.price.toFixed(2)}
                  </span>
                  {selectedToppings.length > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (+$
                      {selectedToppings
                        .reduce((sum, topping) => sum + topping.price, 0)
                        .toFixed(2)}
                      )
                    </span>
                  )}
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating)
                            ? "text-amber-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-700">
                    {rating} ({products.reviews || 0} reviews)
                  </span>
                </div>

                {/* Description Section */}
                <div className="mb-6 overflow-y-auto max-h-[200px]">
                  <p className="text-gray-600 whitespace-pre-line">
                    {products.description}
                  </p>
                </div>

                {products.ingredients && products.ingredients.length != 0 && (
                  <div className="mb-6 overflow-y-auto max-h-[200px]">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Toppings
                    </h3>
                    <ul className="list-none text-gray-600 space-y-2">
                      {products.ingredients.map((ingredient) => (
                        <li key={ingredient._id}>
                          <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedToppings.some(
                                  (t) => t._id === ingredient._id
                                )}
                                onChange={(e) => handleTopping(e, ingredient)}
                                className="w-5 h-5 accent-orange-500 rounded focus:ring-2 focus:ring-orange-400"
                              />
                              <span className="text-sm ml-2">
                                {ingredient.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              +${ingredient.price.toFixed(2)}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(e);
                        closeModal();
                      }}
                    >
                      <FaPlus /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ProductCard;
