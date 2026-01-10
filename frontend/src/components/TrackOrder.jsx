import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { URL } from "../config/config";
import { getStatusColor } from "../utils/getStatusColor";
import getTimeLeft from "../utils/getTimeLeft";
import {
  ChevronUp,
  ChevronDown,
  Package,
  ChefHat,
  Truck,
  CheckCircle
} from "lucide-react";

const SOCKET_URL = URL;

const isOrderActive = (order) => {
  const status = order?.orderStatus?.toLowerCase();
  return status !== "delivered" && status !== "cancelled";
};

// Timeline Step Component
const TimelineStep = ({ active, completed, icon: Icon, label, last }) => (
  <div className="flex flex-col items-center flex-1 relative z-10">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mb-2 ${active || completed
        ? "bg-[var(--color-primary)] text-white shadow-lg scale-110"
        : "bg-gray-100 text-gray-400"
        }`}
    >
      <Icon size={14} />
    </div>
    <span className={`text-[10px] font-medium text-center transition-colors duration-300 ${active || completed ? "text-[var(--color-primary)]" : "text-gray-400"
      }`}>
      {label}
    </span>
    {!last && (
      <div
        className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-500 ${completed ? "bg-[var(--color-primary)]" : "bg-gray-100"
          }`}
      />
    )}
  </div>
);

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);

  const wrapperRef = useRef();

  useEffect(() => {
    const syncOrders = () => {
      const stored = localStorage.getItem("orderHistory");
      if (stored && stored !== "[]") {
        const activeOrders = JSON.parse(stored).filter(isOrderActive);
        setOrders(activeOrders);
        if (activeOrders.length > 0) setExpanded(false);
      }
    };

    syncOrders();
    window.addEventListener("orderHistoryUpdated", syncOrders);

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("order:update", (updatedOrder) => {
      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);

      // Only process if this order belongs to the current user
      if (!parsed.some((o) => o._id === updatedOrder._id)) return;

      setOrders((prev) => {
        if (!isOrderActive(updatedOrder)) {
          return prev.filter((o) => o._id !== updatedOrder._id);
        }
        return prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      });

      const updatedHistory = parsed.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));
    });

    socketInstance.on("order:delete", (deletedOrderId) => {
      const stored = localStorage.getItem("orderHistory") || "[]";
      const parsed = JSON.parse(stored);

      // Only process if this order belongs to the current user
      if (!parsed.some((o) => o._id === deletedOrderId)) return;

      setOrders((prev) => prev.filter((o) => o._id !== deletedOrderId));
      localStorage.setItem(
        "orderHistory",
        JSON.stringify(parsed.filter((o) => o._id !== deletedOrderId))
      );
    });

    return () => {
      socketInstance.disconnect();
      window.removeEventListener("orderHistoryUpdated", syncOrders);
    };
  }, []);

  if (!orders.length) return null;

  const currentOrder = orders[activeOrderIndex] || orders[0];

  // Helper to determine active step
  const getStepStatus = (status) => {
    const s = status.toLowerCase();
    if (s.includes("place") || s.includes("pending")) return 0;
    if (s.includes("confirm") || s.includes("prepar")) return 1;
    if (s.includes("bake") || s.includes("oven")) return 2;
    if (s.includes("way") || s.includes("dispatched")) return 3;
    if (s.includes("deliver")) return 4;
    return 0;
  };

  const currentStep = getStepStatus(currentOrder.orderStatus);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 font-['Poppins']">

      {/* Expanded Widget */}
      {expanded && (
        <div
          ref={wrapperRef}
          className="bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-[400px] overflow-hidden animate-scale-in origin-bottom-right border border-gray-100"
        >
          {/* Header */}
          <div className="bg-[var(--color-primary)] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <Package size={20} />
              </div>
              <span className="font-bold text-sm">Tracking {orders.length} Order{orders.length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setExpanded(false)} className="hover:bg-white/20 p-1 rounded-full transition"><ChevronDown size={20} /></button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 bg-gray-50 max-h-[60vh] overflow-y-auto">

            {/* Order Switcher if multiple */}
            {orders.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {orders.map((o, idx) => (
                  <button
                    key={o._id}
                    onClick={() => setActiveOrderIndex(idx)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${idx === activeOrderIndex
                      ? "bg-[var(--color-primary)] text-white shadow-md"
                      : "bg-white text-gray-500 border border-gray-200"
                      }`}
                  >
                    #{o._id.slice(-4)}
                  </button>
                ))}
              </div>
            )}

            {/* Status Badge */}
            <div className="text-center mb-6">
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(currentOrder.orderStatus)} bg-opacity-20`}>
                {currentOrder.orderStatus}
              </span>
              <p className="text-xs text-gray-400 mt-2">
                Estimated Delivery: <span className="font-bold text-gray-800">{getTimeLeft(currentOrder)}</span>
              </p>
            </div>

            {/* Timeline Visual */}
            <div className="flex justify-between items-start mb-8 px-2">
              <TimelineStep
                label="Received"
                icon={Package}
                active={currentStep === 0}
                completed={currentStep > 0}
              />
              <TimelineStep
                label="Kitchen"
                icon={ChefHat}
                active={currentStep === 1 || currentStep === 2}
                completed={currentStep > 2}
              />
              <TimelineStep
                label="Delivery"
                icon={Truck}
                active={currentStep === 3}
                completed={currentStep > 3}
              />
              <TimelineStep
                label="Enjoy"
                icon={CheckCircle}
                active={currentStep === 4}
                completed={false}
                last
              />
            </div>

            {/* Details Accordion */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-xs">{currentOrder._id}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">€{currentOrder.totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Delivering to:</p>
                <p className="text-gray-700 font-medium line-clamp-1">{currentOrder.deliveryAddress.street}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Collapsed Pill (Floating Action Button) */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="group flex items-center gap-3 bg-white text-gray-800 px-5 py-3 rounded-full shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-primary)] rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-primary)] rounded-full border-2 border-white"></span>
            <Package size={22} className="text-gray-700" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold leading-tight">Track Order</span>
            <span className="text-[10px] text-gray-400">{orders.length} active</span>
          </div>
          <ChevronUp size={16} className="text-gray-400 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

    </div>
  );
};

export default TrackOrder;
