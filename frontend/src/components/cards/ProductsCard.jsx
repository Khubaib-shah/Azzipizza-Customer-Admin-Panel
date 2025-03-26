import { FaPlus } from "react-icons/fa";
import { useContext } from "react";
import Context from "../../context/dataContext";
import { ToastContainer, toast } from "react-toastify";

function ProductCard({ products }) {
  const { addToCart } = useContext(Context);

  const handleCart = (e) => {
    e.stopPropagation();

    addToCart(products);

    toast.success(`${products.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  return (
    <div className=" bg-white rounded-lg shadow-md hover:shadow-lg  overflow-hidden relative transition-transform">
      <div className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={products.image}
            alt={products.name}
          />

          {/* Popular tag */}
          {products.popular && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Popular
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-bold text-gray-800 line-clamp-1">
              {products.name}
            </h1>
            <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-2 py-1 rounded ml-2 whitespace-nowrap">
              ${products.price}
            </span>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {products.description}
              </p>
              {products.rating && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {products.rating}
                  </span>
                  {products.reviews && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({products.reviews} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full transition-colors shadow-md"
              onClick={handleCart}
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
