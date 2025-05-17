import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import Context from "../../context/dataContext";
import { toast } from "react-toastify";
import Modal from "../Modal/Modal";

function ProductCard({ product }) {
  const { addToCart } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const discount = product.discount || 0;
  const basePrice = product.price;
  const discountedPrice = basePrice - (basePrice * discount) / 100;

  const rating = product.rating || Math.floor(Math.random() * 50) + 100;
  const reviews = product.reviews || Math.floor(Math.random() * 50) + 100;

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const finalPrice = discountedPrice + toppingsTotal;

  const handleToppingToggle = (e, topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((item) => item._id === topping._id);
      return exists
        ? prev.filter((item) => item._id !== topping._id)
        : [...prev, topping];
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = { ...product, price: finalPrice };
    addToCart(cartItem, selectedToppings);
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  return (
    <>
      {/* Product Card */}
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col h-full cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
              -{discount}% OFF
            </div>
          )}
          {product.category !== "bibite" && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Popular
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-bold text-gray-800 truncate capitalize">
              {product.name}
            </h1>
            <div className="text-sm text-right">
              {discount > 0 && (
                <div className="line-through text-gray-400">
                  €{basePrice.toFixed(2)}
                </div>
              )}
              <div className="text-amber-800 font-semibold">
                €{discountedPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-700">
                {rating} ({reviews})
              </span>
            </div>
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full transition-colors shadow-md hover:shadow-lg active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 overflow-y-auto p-6">
              {/* Image */}
              <div className="relative w-full aspect-square">
                <img
                  className="w-full h-full object-cover"
                  src={product.image}
                  alt={product.name}
                />
                {product.category !== "bibite" && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
                    Popular
                  </span>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-0 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow">
                    -{discount}% OFF
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  {discount > 0 && (
                    <span className="text-lg text-gray-400 line-through mr-2">
                      €{basePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xl font-bold text-amber-600">
                    €{discountedPrice.toFixed(2)}
                  </span>
                  {selectedToppings.length > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (+€{toppingsTotal.toFixed(2)})
                    </span>
                  )}
                </div>

                <div className="flex items-center mb-4">
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
                  <span className="text-gray-700 ml-2">
                    {rating} ({reviews})
                  </span>
                </div>

                <div className="mb-6 overflow-y-auto max-h-[200px]">
                  <p className="text-gray-600 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {product.ingredients?.length > 0 && (
                  <div className="mb-6 overflow-y-auto max-h-[200px]">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Toppings
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      {product.ingredients.map((ingredient) => (
                        <li key={ingredient._id}>
                          <label className="flex justify-between items-center cursor-pointer">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="w-5 h-5 accent-orange-500 rounded"
                                checked={selectedToppings.some(
                                  (t) => t._id === ingredient._id
                                )}
                                onChange={(e) =>
                                  handleToppingToggle(e, ingredient)
                                }
                              />
                              <span className="text-sm">{ingredient.name}</span>
                            </div>
                            <span className="text-sm font-medium">
                              +€{ingredient.price.toFixed(2)}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between">
                  <button
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
                    onClick={(e) => {
                      handleAddToCart(e);
                      setIsModalOpen(false);
                    }}
                  >
                    <FaPlus /> Add to Cart
                  </button>
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
