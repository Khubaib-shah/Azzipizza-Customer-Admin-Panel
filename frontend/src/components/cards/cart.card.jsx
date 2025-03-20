import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Context from "../../context";

function CartCard({ products }) {
  const { cartItems, setCartItems } = useContext(Context);

  const removeCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const increment = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <div className="border rounded-lg border-gray-300 hover:bg-gray-100 transition p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 w-full">
      {/* Product Image & Delete Button */}
      <div className="relative flex-shrink-0">
        <img
          className="h-20 sm:h-24 md:h-28 w-20 sm:w-24 md:w-28 object-cover rounded-md"
          src={products.image}
          alt={products.name}
        />
        <button
          onClick={() => removeCart(products.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
        >
          <FaTrash size={12} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 w-full">
        <h1 className="text-sm sm:text-base md:text-lg font-semibold">
          {products.name}
        </h1>
        <h2 className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
          ${products.price}
        </h2>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decrement(products.id)}
            className="border border-gray-400 hover:border-black w-8 h-8 flex items-center justify-center rounded-md"
          >
            <FiMinus className="text-sm" />
          </button>

          <span className="border border-black w-8 h-8 flex items-center justify-center text-sm font-semibold">
            {products.quantity}
          </span>

          <button
            onClick={() => increment(products.id)}
            className="border border-gray-400 hover:border-black w-8 h-8 flex items-center justify-center rounded-md"
          >
            <FiPlus className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
