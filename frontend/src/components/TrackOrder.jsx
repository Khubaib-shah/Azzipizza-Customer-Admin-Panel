import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { URL } from "../config/config";

const SOCKET_URL = URL;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const isOrderActive = (order) => {
  return order.orderStatus.toLowerCase() !== "delivered";
};

const getTimeLeft = (order) => {
  if (order.orderStatus.toLowerCase() === "delivered") {
    return "Delivered";
  }

  const now = new Date();

  if (order.eta) {
    const eta = new Date(order.eta);
    const remainingMs = eta - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    return remainingMin > 0
      ? `${remainingMin} min remaining`
      : "Less than 1 min remaining";
  }

  const created = new Date(order.createdAt);
  const passed = Math.floor((now - created) / 60000);
  const remaining = 20 - passed;

  return remaining > 0
    ? `${remaining} min remaining`
    : "Less than 1 min remaining";
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "preparing":
      return "text-yellow-600";
    case "on the way":
      return "text-blue-600";
    case "delivered":
      return "text-green-600";
    default:
      return "text-orange-600";
  }
};

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("orderHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      const recent = parsed.filter((order) => isOrderActive(order));
      setOrders(recent);
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Disconnected from socket server");
    });

    socket.on("order:new", (newOrder) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o._id === newOrder._id);
        return exists ? prev : [newOrder, ...prev];
      });

      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);
      localStorage.setItem(
        "orderHistory",
        JSON.stringify([newOrder, ...parsed])
      );
    });

    socket.on("order:update", (updatedOrder) => {
      setOrders((prev) => {
        const updated = prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );

        return updated.filter(
          (order) => order.orderStatus.toLowerCase() !== "delivered"
        );
      });

      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);
      const updatedStorage = parsed.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      localStorage.setItem("orderHistory", JSON.stringify(updatedStorage));
    });

    socket.on("order:delete", (deletedOrderId) => {
      setOrders((prev) => prev.filter((o) => o._id !== deletedOrderId));

      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);
      localStorage.setItem(
        "orderHistory",
        JSON.stringify(parsed.filter((o) => o._id !== deletedOrderId))
      );
    });

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpandedOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order:new");
      socket.off("order:update");
      socket.off("order:delete");
    };
  }, []);

  if (!orders.length) return null;

  return (
    <div className="w-full fixed bottom-0 left-0 z-50 pb-safe bg-orange-50 border-t-4 border-amber-500 shadow-lg rounded-tr-3xl rounded-tl-3xl">
      <div className="mx-auto max-w-screen-md">
        <div
          ref={wrapperRef}
          className="rounded-tr-3xl rounded-tl-3xl overflow-hidden"
        >
          <div className="px-4 py-2 bg-amber-500 text-white text-center text-sm font-medium">
            {socketConnected
              ? "Live order tracking active"
              : "Connection lost - attempting to reconnect..."}
          </div>

          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const statusColor = getStatusColor(order.orderStatus);

            return (
              <div
                key={order._id}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-[999px]" : "max-h-[64px]"
                } border-b border-orange-200 last:border-b-0`}
              >
                <div
                  className="flex justify-between items-center px-4 py-3 cursor-pointer bg-orange-100 hover:bg-orange-200 transition-colors sm:px-6"
                  onClick={() =>
                    setExpandedOrderId(isExpanded ? null : order._id)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-semibold ${statusColor}`}>
                      {order.orderStatus}
                    </span>
                    <p className="text-orange font-semibold text-sm text-gray-800 sm:text-base">
                      {order.name}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm text-black/50">
                    {getTimeLeft(order)}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-4 py-3 bg-orange-50 text-sm sm:px-6 sm:text-base">
                    <div className="mb-3">
                      <p className="text-gray-700">
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <p className="text-gray-700">
                        <strong>Placed at:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.eta && (
                        <p className="text-gray-700">
                          <strong>Estimated time:</strong>{" "}
                          {new Date(order.eta).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-700">
                      <strong>Delivery:</strong> {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city} -{" "}
                      {order.deliveryAddress.zipCode}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Phone:</strong> {order.phoneNumber}
                    </p>

                    <div className="text-gray-700 mb-2">
                      <strong>Items:</strong>
                      <ul className="list-disc ml-6 mt-1">
                        {order.items.map((item) => (
                          <li key={item._id} className="mb-1">
                            {item.customizations} (x{item.quantity})<br />
                            <span className="text-xs sm:text-sm text-gray-500">
                              Ingredients:{" "}
                              {item.selectedIngredients
                                .map((ing) => ing.name)
                                .join(", ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <p className="font-medium text-gray-800">
                        Total: €{order.totalPrice.toFixed(2)}
                      </p>
                      {order.orderStatus.toLowerCase() === "on the way" && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Driver en route
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
