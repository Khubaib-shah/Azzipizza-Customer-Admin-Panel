// src/pages/Orders.js
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [getorders, setGetorders] = useState([])

  // Dummy data for customer orders
  // const orders = [
  //   {
  //     id: 1,
  //     customerName: "John Doe",
  //     items: ["Margherita Pizza", "Caesar Salad"],
  //     totalPrice: 21.98,
  //     status: "Preparing",
  //     estimatedTime: "30 mins",
  //   },
  //   {
  //     id: 2,
  //     customerName: "Jane Smith",
  //     items: ["Spaghetti Carbonara", "Tiramisu"],
  //     totalPrice: 21.98,
  //     status: "On the Way",
  //     estimatedTime: "20 mins",
  //   },
  //   {
  //     id: 3,
  //     customerName: "Alice Johnson",
  //     items: ["Grilled Salmon", "Caesar Salad"],
  //     totalPrice: 27.98,
  //     status: "Delivered",
  //     estimatedTime: "0 mins",
  //   },
  // ];

  useEffect(() => {

    const fetch = async () => {
      const response = await axios.get("http://localhost:5000/api/orders").then((res) => setGetorders(res.data)).catch((er) => console.log("error", er)
    )

}

fetch()
}, [])

console.log("orders", getorders);

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
          {getorders.map((order,index) => (
            <tr
              key={order._id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-sm text-gray-900">{index+1}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {order.deliveryAddress.city + ", " + order.deliveryAddress.street + ", " + order.deliveryAddress.zipCode}
              </td>
              {/* <td className="px-6 py-4 text-sm text-gray-900">
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>{item.customization}</li>
                  ))}
                </ul>
              </td> */}

<td className="px-6 py-4 text-sm text-gray-900">
              <ul className="list-disc list-inside">
                {order.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.quantity}x Item
                    {item.customizations && item.customizations.length > 0 && (
                      <ul className="list-circle list-inside ml-4">
                        {item.customizations.map((customization, customizationIndex) => (
                          <li key={customizationIndex}>{customization}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                ${order.totalPrice.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Preparing"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "On the Way"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {/* {order.estimatedTime} */}
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
