import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Clock, CreditCard } from "lucide-react";

const PaymentSuccess = ({ onClose, orderDetails }) => {
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
    <div className="inset-0   overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-12">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Your order has been placed via PayPal.
            </p>
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
                <p className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Paid with:</span> PayPal
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

                return (
                  <div key={index} className="pb-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {item.name || "Custom Item"}
                        </p>
                        <ul className="text-sm text-gray-500 ml-4 list-disc">
                          {item.selectedIngredients?.map((ing, idx) => (
                            <li key={idx}>{ing.name}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {quantity}
                        </p>
                      </div>
                      <p className="font-medium text-right">
                        €{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
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

export default PaymentSuccess;
