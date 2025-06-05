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
  const status = order.orderStatus.toLowerCase();
  return status !== "delivered" && status !== "cancelled";
};

const getTimeLeft = (order) => {
  const status = order.orderStatus.toLowerCase();
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";

  const now = new Date();
  let targetTime;

  if (order.eta) {
    targetTime = new Date(order.eta);
  } else {
    const createdAt = new Date(order.createdAt);
    targetTime = new Date(createdAt.getTime() + 20 * 60000);
  }

  const remainingMs = targetTime - now;

  if (remainingMs <= 0) {
    return "Time expired";
  }

  const remainingMin = Math.ceil(remainingMs / 60000);
  return `${remainingMin} min remaining`;
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "preparing":
      return "text-yellow-600";
    case "on the way":
    case "out for delivery":
      return "text-blue-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
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
      const activeOrders = parsed.filter(isOrderActive);
      setOrders(activeOrders);
    }

    const onConnect = () => {
      setSocketConnected(true);
      console.log("Connected to socket server");
    };

    const onDisconnect = () => {
      setSocketConnected(false);
      console.log("Disconnected from socket server");
    };

    const handleNewOrder = (newOrder) => {
      if (!isOrderActive(newOrder)) return;

      setOrders((prev) => {
        const exists = prev.some((o) => o._id === newOrder._id);
        return exists ? prev : [newOrder, ...prev];
      });

      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);
      const existsInStorage = parsed.some((o) => o._id === newOrder._id);

      if (!existsInStorage) {
        localStorage.setItem(
          "orderHistory",
          JSON.stringify([newOrder, ...parsed])
        );
      }
    };

    const handleOrderUpdate = (updatedOrder) => {
      setOrders((prev) => {
        if (!isOrderActive(updatedOrder)) {
          return prev.filter((o) => o._id !== updatedOrder._id);
        }

        return prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      });

      const stored = localStorage.getItem("orderHistory") || "[]";
      let parsed = JSON.parse(stored);

      parsed = parsed.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );

      localStorage.setItem("orderHistory", JSON.stringify(parsed));
    };

    const handleOrderDelete = (deletedOrderId) => {
      setOrders((prev) => prev.filter((o) => o._id !== deletedOrderId));

      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored).filter((o) => o._id !== deletedOrderId);
      localStorage.setItem("orderHistory", JSON.stringify(parsed));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("order:new", handleNewOrder);
    socket.on("order:update", handleOrderUpdate);
    socket.on("order:delete", handleOrderDelete);

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpandedOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("order:new", handleNewOrder);
      socket.off("order:update", handleOrderUpdate);
      socket.off("order:delete", handleOrderDelete);
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
                                ?.map((ing) => ing.name)
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
