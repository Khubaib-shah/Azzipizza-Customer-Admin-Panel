import { useState, useContext } from "react";
import { Dialog } from "@headlessui/react";
import Context from "../context";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";

// Order Modal Component
function OrderModal({ isOpen, closeModal, placeOrder, totalPrice }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode
    ) {
      toast.error("Please fill in all required fields!", {
        position: "top-center",
      });
      return;
    }
    placeOrder(formData);
    toast.success("Order placed successfully!", { position: "top-center" });
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          🛍️ Place Your Order
        </h2>

        {/* Form Fields */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <textarea
            name="customizations"
            placeholder="Customizations (optional)"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Total Price */}
        <div className="mt-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total:{" "}
            <span className="text-green-600">${totalPrice.toFixed(2)}</span>
          </h3>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// Cart Component
function Cart() {
  const { cartItems, setCartItems } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log("Opening modal...");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const placeOrder = (orderData) => {
    console.log("Order Placed", orderData);

    // Clear the cart after order is placed
    setCartItems([]);

    // Show success message
    toast.success("Order placed successfully!", { position: "top-center" });

    // Close the modal
    closeModal();
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-lg">
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-500 underline">
            Go back to shopping
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-white shadow-lg rounded-lg p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="mt-3 flex flex-col">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-2 bg-black rounded text-lg hover:bg-gray-400 transition"
                    >
                      <Minus size={18} className="text-white" />
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-2 bg-black rounded text-lg hover:bg-gray-400 transition"
                    >
                      <Plus size={18} className="text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={openModal}
          className="bg-green-500 px-6 py-3 rounded text-white text-lg font-semibold hover:bg-green-600 transition"
        >
          Order Now
        </button>
      </div>

      {/* Order Modal Component */}
      <OrderModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        placeOrder={placeOrder}
        totalPrice={totalPrice}
      />
    </div>
  );
}

export default Cart;
