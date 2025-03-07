import React, { useEffect, useState, useCallback } from "react";
import { baseUri } from "../config/config";
import io from "socket.io-client";

const statusOptions = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [etas, setEtas] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(0);

  const socket = io("http://localhost:5000");

  useEffect(() => {
    socket.on("latestOrders", (data) => {
      setOrders(data.reverse())
    });

    return () => {
      socket.off("latestOrders");
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await baseUri.get("/api/orders");
      setOrders(data.reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Order Select (Open Sidebar)
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    const timeLeft = order.eta
      ? Math.max(0, Math.floor((new Date(order.eta) - Date.now()) / 60000))
      : 0;
    setEtaMinutes(timeLeft);
  };

  // Handle Status and ETA Update
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      const etaTime = new Date(Date.now() + etaMinutes * 60000);
      const updatedOrder = await baseUri.put(
        `/api/orders/${selectedOrder._id}`,
        { eta: etaTime }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id ? { ...order, eta: etaTime } : order
        )
      );
      setEtas((prev) => ({ ...prev, [selectedOrder.eta]: etaMinutes }));
      console.log(updatedOrder.data.updatedOrder.eta);

      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };
  return (
    <div className="flex">
      {/* Orders Table */}
      <div
        className={`transition-all duration-300 ${
          selectedOrder ? "w-1/2" : "w-full"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 p-6 border-b border-gray-200">
            Active Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    ETA
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSelectOrder(order)}
                    >
                      <td className="px-4 py-2 font-mono text-sm text-gray-600">
                        #{order._id.slice(-5)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {order.name}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {order.eta
                          ? `${Math.max(
                              0,
                              Math.floor(
                                (new Date(order.eta) - Date.now()) / 60000
                              )
                            )} min`
                          : "Not Set"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button className="text-blue-600 hover:underline">
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Sidebar */}
      {selectedOrder && (
        <div className="w-1/2 fixed right-0 top-0 h-full bg-white shadow-lg p-6 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">Manage Order</h2>
          <p className="text-gray-700 mb-2">
            Order ID: #{selectedOrder._id.slice(-5)}
          </p>
          <p className="text-gray-700 mb-2">Customer: {selectedOrder.name}</p>
          <p className="text-gray-700 mb-4">ETA: {etaMinutes} min</p>

          {/* ETA Adjust Buttons */}
          <div className="flex items-center gap-4">
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => setEtaMinutes((prev) => Math.max(0, prev - 5))}
            >
              -5 min
            </button>
            <span className="text-lg font-semibold">{etaMinutes} min</span>
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => setEtaMinutes((prev) => prev + 5)}
            >
              +5 min
            </button>
          </div>

          {/* Update & Close Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleUpdateOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update ETA
            </button>
            <button
              onClick={() => setSelectedOrder(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
