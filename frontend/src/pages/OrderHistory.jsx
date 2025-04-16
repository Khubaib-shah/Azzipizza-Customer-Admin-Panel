import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  MapPin,
  ShoppingBag,
  ChevronLeft,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import Context from "../context/dataContext";
import { baseUri } from "../config/config";

function OrderHistory() {
  const { cartItems } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const id = [cartItems._id];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await baseUri.get(`/api/orders/${id}`);
        const ordersArray = Array.isArray(data) ? data : [data];
        setOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-amber-500" />
      </div>
    );
  }
  const handleDelete = async (orderId) => {
    try {
      await baseUri.delete(`/api/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8 \">
        <Link
          to="/"
          className="flex items-center text-amber-600 hover:text-amber-700 transition-colors "
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back to Home</span>
        </Link>
        <h1 className="text-sm md:text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="text-amber-600" />
          Your Order History
        </h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center transition-all duration-300">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4 transition-transform duration-300 hover:scale-110" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-gray-500">
            You haven't placed any orders. Ready to order something delicious?
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md relative"
            >
              <button
                className="absolute right-4 top-4"
                onClick={() => handleDelete(order._id)}
              >
                X
              </button>
              <button
                onClick={() => toggleOrder(order._id)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full transition-colors duration-300 ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Order #{order._id.substring(18, 24).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="font-medium">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      expandedOrder === order._id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedOrder === order._id
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-amber-600" />
                        Delivery Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {order.name}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {order.phoneNumber}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {order.deliveryAddress.street},{" "}
                          {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.zipCode}
                        </p>
                        {order.customizations && (
                          <p>
                            <span className="font-medium">Notes:</span>{" "}
                            {order.customizations}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-amber-600" />
                        Order Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Payment Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs transition-colors duration-300 ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Order Date:</span>{" "}
                          {formatDate(order.createdAt)}
                        </p>
                        <p>
                          <span className="font-medium">Last Updated:</span>{" "}
                          {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start transition-opacity duration-300"
                        >
                          <div>
                            <p className="font-medium">{item.menuItem.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            €{(item.menuItem.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>€{order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Delivery Fee</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-3">
                        <span>Total</span>
                        <span>€{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
