// src/pages/Orders.js
import React from "react";

const Orders = () => {
  // Dummy data for customer orders
  const orders = [
    {
      id: 1,
      customerName: "John Doe",
      items: ["Margherita Pizza", "Caesar Salad"],
      totalPrice: 21.98,
      status: "Preparing",
      estimatedTime: "30 mins",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      items: ["Spaghetti Carbonara", "Tiramisu"],
      totalPrice: 21.98,
      status: "On the Way",
      estimatedTime: "20 mins",
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      items: ["Grilled Salmon", "Caesar Salad"],
      totalPrice: 27.98,
      status: "Delivered",
      estimatedTime: "0 mins",
    },
  ];

  return (
    <div className="animate-fadeIn rounded-lg shadow-md max-w-6xl mt-6 ms-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Customer Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Preparing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "On the Way"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.estimatedTime}
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
