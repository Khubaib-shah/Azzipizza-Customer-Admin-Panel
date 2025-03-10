import { FaPlus } from "react-icons/fa";
import Context from "../../context";
import { useContext } from "react";

function ProductCard({ products, openModal }) {
  const { cartItems, setCartItems } = useContext(Context);

  const handleCart = (e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking on the add button
    const check = cartItems.find((item) => item.id === products.id);
    if (check) {
      const newCart = cartItems.map((item) =>
        item.id === products.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(newCart);
      return;
    }
    setCartItems([...cartItems, { ...products, quantity: 1 }]);
  };

  return (
    <div
      className="product-card border rounded-lg border-gray-300 hover:bg-gray-100 transition cursor-pointer p-2 sm:p-3"
      onClick={() => openModal(products)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Product Info */}
        <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
          <h1 className="text-sm sm:text-base font-semibold">
            {products.name}
          </h1>
          <h2 className="text-xs sm:text-sm font-medium text-gray-700">
            ${products.price}
          </h2>
          <p className="text-xs text-gray-600">{products.des}</p>
        </div>

        {/* Product Image & Add Button */}
        <div className="relative flex-shrink-0">
          <img
            className="h-[70px] sm:h-[90px] max-w-[90px] sm:max-w-[120px] object-contain rounded-md"
            src={products.image}
            alt="Product"
          />
          <span
            className="absolute top-1 right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 flex justify-center items-center cursor-pointer shadow-md"
            onClick={handleCart}
          >
            <FaPlus size={16} color="white" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
