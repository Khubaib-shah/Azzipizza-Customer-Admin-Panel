import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Context from "../context/dataContext";
import { baseUri } from "../config/config";
import OrderModal from "../components/Modal/OrderModel";

function Cart() {
  const { cartItems, addToCart, removeFromCart, CartDecrement, clearCart } =
    useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [orderedItem, setOrderedItem] = useState(null);

  // Function to save order ID to localStorage
  const saveOrderToLocalStorage = (orderId) => {
    try {
      const existingOrders =
        JSON.parse(localStorage.getItem("orderHistory")) || [];
      const updatedOrders = [...existingOrders, orderId];
      localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error saving order to localStorage:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    if (isOrderConfirmed) {
      // Clear the cart when modal closes after order confirmation
      clearCart();
    }
  };
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
  const placeOrder = async (orderData) => {
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
        name: item.name,
        price: item.price,
      })),
      customizations: orderData.customizations || "",
      totalPrice: totalPrice,
    };

    try {
      const { data } = await baseUri.post("/api/orders", formattedOrder);
      setOrderedItem(data);
      setIsOrderConfirmed(true);

      saveOrderToLocalStorage(data._id);

      toast.success("Order placed successfully!", { position: "top-center" });

      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order!", { position: "top-center" });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isOrderConfirmed && orderedItem) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We've received it and will process it
              shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="text-amber-600" />
                Delivery Details
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {orderedItem.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {orderedItem.phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {orderedItem.deliveryAddress.street},{" "}
                  {orderedItem.deliveryAddress.city},{" "}
                  {orderedItem.deliveryAddress.zipCode}
                </p>
                {orderedItem.customizations && (
                  <p>
                    <span className="font-medium">Special Instructions:</span>{" "}
                    {orderedItem.customizations}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="text-amber-600" /> Order Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {orderedItem._id}
                </p>
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {formatDate(orderedItem.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                    {orderedItem.orderStatus}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment:</span>
                  <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                    {orderedItem.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-4">
              {orderedItem.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${orderedItem.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${orderedItem.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag size={28} className="text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
      </div>
      {!cartItems.length ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-4 flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-center w-8">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={openModal}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
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
