import React, { useEffect, useState } from "react";
import { baseUri } from "../config/config";

const Orders = () => {
  const [getOrders, setGetOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await baseUri.get("api/orders");
        console.log(response);
        setGetOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        Customer Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="px-4 py-3 border border-gray-300">#</th>
              <th className="px-4 py-3 border border-gray-300">Customer</th>
              <th className="px-4 py-3 border border-gray-300">Items</th>
              <th className="px-4 py-3 border border-gray-300">Total</th>
              <th className="px-4 py-3 border border-gray-300">Status</th>
              <th className="px-4 py-3 border border-gray-300">ETA</th>
            </tr>
          </thead>
          <tbody className="capitalize">
            {getOrders.map((order, index) => (
              <tr
                key={order._id}
                className={`text-sm md:text-base hover:bg-gray-100 transition ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 border border-gray-300">
                  {order._id.slice(-5)}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {order.deliveryAddress.city}, {order.deliveryAddress.street},{" "}
                  {order.deliveryAddress.zipCode}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center space-x-1"
                      >
                        <span className="font-semibold">{item.quantity}x</span>
                        <span className="text-gray-600">
                          {item.menuItem.name}
                        </span>
                        {item.customizations &&
                          item.customizations.length > 0 && (
                            <ul className="text-xs text-gray-500 flex flex-wrap">
                              {item.customizations.map(
                                (customization, customizationIndex) => (
                                  <li key={customizationIndex} className="px-1">
                                    ({customization})
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Preparing"
                        ? "bg-yellow-500 text-white"
                        : order.status === "On the Way"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700">
                  30 mins
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
