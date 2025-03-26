import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Context from "../../context/dataContext";

const CartCard = ({ products }) => {
  const { cartItems, addToCart, removeFromCart, CartDecrement } =
    useContext(Context);

  // Remove item from cart
  const handleRemove = () => {
    removeFromCart(products._id);
  };

  const increment = () => {
    addToCart(products);
  };

  // Decrease quantity
  const decrement = (id) => {
    if (products.quantity > 1) {
      const item = cartItems.find((item) => item._id === id);
      if (item) CartDecrement(item);
    } else {
      handleRemove();
    }
  };

  return (
    <div className="bg-slate-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center gap-4 w-full my-5">
      {/* Product Image & Delete Button */}
      <div className="relative flex-shrink-0">
        <img
          className="size-32 object-cover rounded-lg"
          src={products.image}
          alt={products.name}
        />
        <button
          onClick={handleRemove}
          aria-label="Remove item"
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white  rounded-full shadow-md transition-colors cursor-pointer p-1"
        >
          <FaTrash size={12} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 justify-between items-center w-full lg:gap-4">
        <h2 className="text-base font-medium text-gray-700">
          $ <span className="text-green-600">{products.price}</span>
        </h2>

        {/* Quantity Controls */}
        <div className="flex items-center relative">
          <button
            onClick={() => decrement(products._id)}
            className=" bg-orange-500 p-1 lg:px-2 rounded-full text-white hover:bg-orange-600 transition-colors shadow-lg cursor-pointer"
          >
            <FiMinus className="text-sm text-white" />
          </button>

          <span className="w-8 h-8 flex items-center justify-center text-base font-semibold text-gray-800">
            {products.quantity}
          </span>

          <button
            onClick={increment}
            className="bg-orange-500 p-1 lg:px-2 rounded-full text-white hover:bg-orange-600 transition-colors shadow-lg cursor-pointer"
          >
            <FiPlus className="text-sm text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
