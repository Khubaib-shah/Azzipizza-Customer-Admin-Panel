import React, { useEffect, useState, useRef, useCallback } from "react";
import { baseUri } from "../config/config";
import {
  CrossCircledIcon,
  EyeOpenIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import OrderModal from "../components/OrderModal";
const statusOptions = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const tableHeaders = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "eta", label: "ETA" },
  { key: "actions", label: "Actions" },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [etas, setEtas] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const intervalRef = useRef(null);

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

  const calculateEtas = useCallback(() => {
    const now = new Date();
    const newEtas = {};

    orders.forEach((order) => {
      if (!order?.createdAt || !order.items.length) return;

      const createdAt = new Date(order.createdAt);
      const category = order.items[0]?.menuItem?.category;
      const preparationTimes = {
        pizza: 30,
        pasta: 20,
        default: 15,
      };

      const preparationTime =
        preparationTimes[category] || preparationTimes.default;
      const estimatedTime = new Date(
        createdAt.getTime() + preparationTime * 60000
      );
      let remainingTime = Math.max(
        0,
        Math.round((estimatedTime - now) / 60000)
      );

      if (order.orderStatus === "Out for Delivery") {
        remainingTime = Math.min(remainingTime, 20);
      }
      if (
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Cancelled"
      ) {
        remainingTime = 0;
      }

      newEtas[order._id] =
        remainingTime > 0 ? `${remainingTime} min left` : "Order Ready!";
    });

    setEtas((prev) =>
      JSON.stringify(prev) === JSON.stringify(newEtas) ? prev : newEtas
    );
  }, [orders]);

  useEffect(() => {
    calculateEtas();
    if (!intervalRef.current) {
      intervalRef.current = setInterval(calculateEtas, 60000);
    }
    return () => clearInterval(intervalRef.current);
  }, [calculateEtas]);

  const handleStatusUpdate = useCallback(async (orderId, newStatus) => {
    try {
      await baseUri.put(`/api/orders/${orderId}`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }, []);

  const handleDelete = useCallback(async (orderId) => {
    try {
      await baseUri.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      setEtas((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 p-6 border-b border-gray-200">
          Active Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  eta={etas[order._id]}
                  onView={() => setOrderDetails(order)}
                  onEdit={setSelectedOrder}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orderDetails && (
        <OrderModal
          order={orderDetails}
          eta={etas[orderDetails._id]}
          onClose={() => setOrderDetails(null)}
        />
      )}

      {selectedOrder && (
        <StatusEditModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const OrderRow = React.memo(
  ({ order, eta, onView, onEdit, onDelete, onStatusChange }) => {
    const statusColor = {
      Pending: "bg-yellow-100 text-yellow-800",
      Preparing: "bg-blue-100 text-blue-800",
      "Out for Delivery": "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    }[order.orderStatus];

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
          #{order._id.slice(-5)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{order.name}</div>
          <div className="text-sm text-gray-500">
            {order.deliveryAddress.city}
          </div>
        </td>
        <td className="px-6 py-4 max-w-xs">
          <div className="text-sm text-gray-900 space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-medium">{item.quantity}x</span>
                <span>{item.menuItem?.name}</span>
              </div>
            ))}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${order.totalPrice.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {order.orderStatus}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {eta || "Calculating..."}
        </td>
        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
          <button
            onClick={() => onEdit(order)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit status"
          >
            <Pencil1Icon className="w-5 h-5" />
          </button>
          <button
            onClick={onView}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="View details"
          >
            <EyeOpenIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(order._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete order"
          >
            <CrossCircledIcon className="w-5 h-5" />
          </button>
        </td>
      </tr>
    );
  }
);

const StatusEditModal = ({ order, onClose, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);

  const handleSave = () => {
    onSave(order._id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Order Status</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
