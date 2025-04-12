import { useState, useContext } from "react";
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

  // Save order to localStorage
  const saveOrderToLocalStorage = (order) => {
    try {
      const existingOrders =
        JSON.parse(localStorage.getItem("orderHistory")) || [];
      const updatedOrders = [...existingOrders, order];
      localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    if (isOrderConfirmed) {
      clearCart();
    }
  };

  const handleQuantityChange = (item, action) => {
    if (action === "increase") {
      addToCart(item.quantity > 1 ? item : { ...item, quantity: 1 });
    } else if (action === "decrease" && item.quantity > 1) {
      CartDecrement(item._id);
    }
  };

  // Calculate total price including ingredients
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const ingredientsTotal =
        item.selectedIngredients?.reduce(
          (sum, ingredient) => sum + ingredient.price,
          0
        ) || 0;
      return total + (item.price + ingredientsTotal) * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const placeOrder = async (orderData) => {
    const formattedOrder = {
      ...orderData,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedIngredients: item.selectedIngredients || [],
        image: item.image,
      })),
      totalPrice: totalPrice,
    };

    try {
      const { data } = await baseUri.post("/api/orders", formattedOrder);
      setOrderedItem(data);
      setIsOrderConfirmed(true);
      saveOrderToLocalStorage(data);

      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to place order", {
        position: "top-center",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              Thank you for your order. We'll notify you when it's on the way.
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
                  {`${orderedItem.deliveryAddress.street}, ${orderedItem.deliveryAddress.city}, ${orderedItem.deliveryAddress.zipCode}`}
                </p>
                {orderedItem.customizations && (
                  <p>
                    <span className="font-medium">Notes:</span>{" "}
                    {orderedItem.customizations}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="text-amber-600" /> Order Info
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order #:</span>{" "}
                  {orderedItem._id}
                </p>
                <p>
                  <span className="font-medium">Placed:</span>{" "}
                  {formatDate(orderedItem.createdAt)}
                </p>
                <div className="flex items-center">
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded">
                    {orderedItem.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-4">Your Order</h2>
            <div className="space-y-4">
              {orderedItem.items.map((item, index) => {
                const ingredientsTotal =
                  item.selectedIngredients?.reduce(
                    (sum, i) => sum + i.price,
                    0
                  ) || 0;
                const itemTotal =
                  (item.price + ingredientsTotal) * item.quantity;

                return (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${itemTotal.toFixed(2)}</p>
                    </div>

                    {item.selectedIngredients?.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-amber-100">
                        <div className="text-sm text-gray-600 mb-1">
                          Base price: ${item.price.toFixed(2)} × {item.quantity}{" "}
                          = ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600 mb-1">Toppings:</p>
                          <ul className="space-y-1">
                            {item.selectedIngredients.map((ing, i) => (
                              <li
                                key={i}
                                className="flex justify-between text-sm"
                              >
                                <span>+ {ing.name}</span>
                                <span>
                                  ${ing.price.toFixed(2)} × {item.quantity} = $
                                  {(ing.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 pt-1 border-t border-gray-100 text-sm font-medium">
                          <span>Item total:</span>
                          <span className="float-right">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Order Total</span>
                <span>${orderedItem.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Menu
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
        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border divide-y divide-gray-100">
              {cartItems.map((item) => {
                const ingredientsTotal =
                  item.selectedIngredients?.reduce(
                    (sum, i) => sum + i.price,
                    0
                  ) || 0;
                const itemTotal =
                  (item.price + ingredientsTotal) * item.quantity;

                return (
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
                        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                      </div>

                      <div className="mt-1 text-sm text-gray-600">
                        <p>
                          ${item.price.toFixed(2)} × {item.quantity} = $
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {item.selectedIngredients?.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-amber-100">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Toppings:
                          </p>
                          <ul className="space-y-1">
                            {item.selectedIngredients.map((ing, i) => (
                              <li
                                key={i}
                                className="flex justify-between text-xs"
                              >
                                <span>+ {ing.name}</span>
                                <span>
                                  ${ing.price.toFixed(2)} × {item.quantity} = $
                                  {(ing.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-1 pt-1 border-t border-gray-100 text-xs font-medium">
                            <span>Toppings total:</span>
                            <span className="float-right">
                              ${(ingredientsTotal * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(item, "decrease")
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-center w-8">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item, "increase")
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
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
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={openModal}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors font-medium"
              >
                Checkout
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
        cartItems={cartItems}
      />
    </div>
  );
}

export default Cart;
