import { useEffect, useRef, useState } from "react";

const isWithin40Minutes = (timestamp) => {
  const created = new Date(timestamp);
  const now = new Date();
  const diff = now - created;
  return diff <= 40 * 60 * 1000;
};

const getTimeLeft = (timestamp) => {
  const created = new Date(timestamp);
  const now = new Date();
  const passed = Math.floor((now - created) / 60000);
  const remaining = 40 - passed;
  return remaining > 0 ? `${remaining} min remaining` : "Delivered";
};

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const wrapperRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("orderHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      const recentOrders = parsed.filter((order) =>
        isWithin40Minutes(order.createdAt)
      );
      setOrders(recentOrders);
    }

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpandedOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!orders.length) return null;

  return (
    <div className="sticky bottom-0 left-0 w-full z-50 pb-safe bg-orange-50 border-t-4 border-amber-500 shadow-lg rounded-tr-3xl rounded-tl-3xl">
      <div
        ref={wrapperRef}
        className="mx-auto max-w-screen-md rounded-tr-3xl rounded-tl-3xl overflow-hidden"
      >
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;

          return (
            <div
              key={order._id}
              className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                isExpanded ? "max-h-[999px]" : "max-h-[64px]"
              }`}
            >
              <div
                className="flex justify-between items-center px-4 py-3 cursor-pointer bg-orange-100 sm:px-6"
                onClick={() =>
                  setExpandedOrderId(isExpanded ? null : order._id)
                }
              >
                <p className="text-orange font-semibold text-sm  text-orange-400 sm:text-base">
                  {order.name}, order is {order.orderStatus}
                </p>
                <span className="text-xs sm:text-sm text-black/50 border-b">
                  {getTimeLeft(order.createdAt)}
                </span>
              </div>

              {isExpanded && (
                <div className="px-4 py-3 bg-orange-50 text-sm sm:px-6 sm:text-base">
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
                          <span className="text-xs sm:text-sm">
                            Ingredients:{" "}
                            {item.selectedIngredients
                              .map((ing) => ing.name)
                              .join(", ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-medium text-gray-800">
                    Total: €{order.totalPrice}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackOrder;
