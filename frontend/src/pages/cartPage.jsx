import { useState, useContext } from "react";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Context from "../context/dataContext";
import axios from "axios";
import OrderModal from "../components/Modal/OrderModel";

// Cart Component
function Cart() {
  const { cartItems, addToCart, removeFromCart, CartDecrement } =
    useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedItemId, setOrderedItemId] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increaseQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) addToCart(item);
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) CartDecrement(item);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const placeOrder = (orderData) => {
    const formattedOrder = {
      name: orderData.name,
      phoneNumber: orderData.phoneNumber,
      deliveryAddress: {
        street: orderData.street,
        city: orderData.city,
        zipCode: orderData.zipCode,
      },
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),

      customizations: orderData.customizations || "",
    };

    console.log("Formatted Order Data:", formattedOrder);

    // Send order to backend
    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedOrder),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to place order");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order placed successfully:", data);
        setOrderedItemId(data._id);

        toast.success("Order placed successfully!", { position: "top-center" });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast.error("Failed to place order!", { position: "top-center" });
      });
  };

  const orderedItem = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/orders/${orderedItemId}`
    );
    console.log(data);
  };
  console.log(orderedItem());

  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>
      {!cartItems.length ? (
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
                key={item._id}
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
                      onClick={() => decreaseQuantity(item._id)}
                      className="p-2 bg-black rounded text-lg hover:bg-gray-400 transition"
                    >
                      <Minus size={18} className="text-white" />
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="p-2 bg-black rounded text-lg hover:bg-gray-400 transition"
                    >
                      <Plus size={18} className="text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={openModal}
              className="bg-green-500 px-6 py-3 rounded text-white text-lg font-semibold hover:bg-green-600 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      )}

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
