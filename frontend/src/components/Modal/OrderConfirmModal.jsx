import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Clock } from "lucide-react";

const OrderConfirmModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null;

  // Safe access with fallbacks
  const orderedItem = orderDetails || {};
  const items = orderedItem.items || [];
  const deliveryAddress = orderedItem.deliveryAddress || {};

  const formatDate = (dateString) => {
    return new Date(dateString || Date.now()).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-12">
          <button
            onClick={onClose}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="text-amber-600" />
                Delivery Details
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {orderedItem.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {orderedItem.phoneNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {deliveryAddress.street
                    ? `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.zipCode}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="text-amber-600" /> Order Info
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order #:</span>{" "}
                  {orderedItem._id || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Placed:</span>{" "}
                  {formatDate(orderedItem.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-4">Your Order</h2>
            <div className="space-y-4">
              {items.map((item, index) => {
                const ingredientsTotal = (
                  item.selectedIngredients || []
                ).reduce((sum, ing) => sum + (ing?.price || 0), 0);

                const itemPrice = item.price || 0;
                const quantity = item.quantity || 1;
                const itemTotal = (itemPrice + ingredientsTotal) * quantity;
                console.log(item);

                return (
                  <div key={index} className=" pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {item.selectedIngredients?.map(
                            (selectedIng, index) => (
                              <span
                                key={index}
                                className="text-sm text-gray-500"
                              >
                                Name: {selectedIng.name}
                              </span>
                            )
                          ) || "Unnamed Item"}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {quantity}</p>
                      </div>
                      <p className="font-medium">
                        <span>Price </span>€{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Order Total</span>
                <span>€{(orderedItem.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              onClick={onClose}
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
