import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Clock } from "lucide-react";

const OrderConfirmModal = ({ orderedItem }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                <span className="font-medium">Order #:</span> {orderedItem._id}
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
              const itemTotal = (item.price + ingredientsTotal) * item.quantity;

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
                        Base price: ${item.price.toFixed(2)} × {item.quantity} =
                        ${(item.price * item.quantity).toFixed(2)}
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
};

export default OrderConfirmModal;
