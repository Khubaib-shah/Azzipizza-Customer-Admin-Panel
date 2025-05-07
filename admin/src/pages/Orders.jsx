import React, { useEffect, useState, useCallback, useReducer } from "react";
import { baseUri, URL } from "../config/config";
import io from "socket.io-client";
import OrderSideBar from "../components/OrderSideBar";
import {
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "../hooks/useNotifications";
import NotificationSound from "/notification-sound.wav";
import CompletedOrderTable from "../components/CompletedOrderTable";
import ActiveOrderTable from "../components/ActiveOrderTable";

const initialState = {
  loading: false,
  delLoading: false,
  upLoading: false,
  punchLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DEL_LOADING":
      return { ...state, delLoading: action.payload };
    case "SET_UP_LOADING":
      return { ...state, upLoading: action.payload };
    case "SET_PUNCH_LOADING":
      return { ...state, punchLoading: action.payload };
    default:
      return state;
  }
}
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { setNotifications } = useNotifications();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isUserInteracted, setIsUserInteracted] = useState(() => {
    // Initialize from localStorage
    const storedValue = localStorage.getItem("isUserInteracted");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const socket = io(URL);

  // Fetch Orders from API
  const fetchOrders = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await baseUri.get("/api/orders");
      setOrders(data);
      setFilteredOrders(data);
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Save isUserInteracted to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isUserInteracted", JSON.stringify(isUserInteracted));
  }, [isUserInteracted]);

  // Toggle sound notifications
  const toggleSoundNotifications = () => {
    const newValue = !isUserInteracted;
    localStorage.setItem("isUserInteracted", JSON.stringify(newValue));
    setIsUserInteracted(newValue);
  };

  // Play notification sound
  const playNotificationSound = async () => {
    if (!isUserInteracted) {
      alert("User has not interacted with the page yet. Sound is disabled.");
      return;
    }

    try {
      const audio = new Audio(NotificationSound);
      await audio.play();
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("latestOrders", (data) => {
      const reversedData = data.slice().reverse();
      setOrders(reversedData);
      const latestOrder = reversedData[0];

      if (!latestOrder || !latestOrder.items) return;

      const isNew = !orders.some((o) => o._id === latestOrder._id);
      if (!isNew) return;

      setNotifications((prev) => [
        ...prev,
        {
          id: latestOrder._id,
          message: "New order received!",
          items: latestOrder,
        },
      ]);

      playNotificationSound();
      setFilteredOrders(applyFilters(reversedData, searchTerm, statusFilter));
    });

    return () => {
      socket.off("latestOrders");
    };
  }, [fetchOrders, searchTerm, statusFilter]);

  useEffect(() => {
    setFilteredOrders(applyFilters(orders, searchTerm, statusFilter));
  }, [searchTerm, statusFilter, orders]);

  const applyFilters = (orders, search, status) => {
    let result = [...orders];

    if (search) {
      result = result.filter(
        (order) =>
          order.name.toLowerCase().includes(search.toLowerCase()) ||
          order._id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      result = result.filter((order) => order.orderStatus === status);
    }

    return result;
  };
  // Handle Order Selection
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    const remainingTime = order.eta
      ? Math.max(0, Math.floor((new Date(order.eta) - Date.now()) / 60000))
      : 0;
    setEtaMinutes(remainingTime);
  };

  // Handle ETA Update
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    dispatch({ type: "SET_UP_LOADING", payload: true });

    try {
      const etaTime = new Date(Date.now() + etaMinutes * 60000);
      const { data } = await baseUri.put(`/api/orders/${selectedOrder._id}`, {
        eta: etaTime,
      });

      // Update local order list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? { ...order, eta: etaTime } : order
        )
      );
      dispatch({ type: "SET_UP_LOADING", payload: false });

      console.log("Updated ETA:", data.updatedOrder.eta);
    } catch (error) {
      console.error("Failed to update order:", error);
      setError("Failed to update order ETA. Please try again.");
    }
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    dispatch({ type: "SET_UP_LOADING", payload: true });
    try {
      await baseUri.put(`/api/orders/${orderId}`, { orderStatus: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
      dispatch({ type: "SET_UP_LOADING", payload: false });
    } catch (error) {
      dispatch({ type: "SET_UP_LOADING", payload: false });

      console.error("Failed to update order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  // Handle Order Deletion
  const handleDeleteOrder = async (orderId) => {
    dispatch({ type: "SET_DEL_LOADING", payload: true });

    try {
      await baseUri.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
      dispatch({ type: "SET_DEL_LOADING", payload: false });
    } catch (error) {
      dispatch({ type: "SET_DEL_LOADING", payload: false });

      console.error("Failed to delete order:", error);
      setError("Failed to delete order. Please try again.");
    }
  };

  const statusOptions = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div
      className={`transition-all duration-300 ${
        selectedOrder ? "mr-80" : ""
      }overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage customer orders
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-9 w-full lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40 cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem>All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="cursor-pointer"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={refreshOrders}
              className={`${
                refreshing ? "animate-spin" : ""
              } hidden lg:flex items-center justify-center`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={toggleSoundNotifications}
              className="mb-4 cursor-pointer"
            >
              {isUserInteracted ? <Volume2 /> : <VolumeOff />}
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="cursor-pointer">
              Active Orders
            </TabsTrigger>
            <TabsTrigger value="completed" className="cursor-pointer">
              Completed Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {state.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredOrders?.filter(
                    (order) =>
                      order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled"
                  ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-6">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Filter className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No active orders
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm || statusFilter
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "There are no active orders at the moment."}
                    </p>
                  </div>
                ) : (
                  <ActiveOrderTable
                    filteredOrders={filteredOrders}
                    handleSelectOrder={handleSelectOrder}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {state.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredOrders.filter(
                    (order) =>
                      order.orderStatus === "Delivered" ||
                      order.orderStatus === "Cancelled"
                  ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-6">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Filter className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No completed orders
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm || statusFilter
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "There are no completed orders at the moment."}
                    </p>
                  </div>
                ) : (
                  <CompletedOrderTable
                    filteredOrders={filteredOrders}
                    handleSelectOrder={handleSelectOrder}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Sidebar */}
      <OrderSideBar
        selectedOrder={selectedOrder}
        etaMinutes={etaMinutes}
        setEtaMinutes={setEtaMinutes}
        setSelectedOrder={setSelectedOrder}
        handleUpdateOrder={handleUpdateOrder}
        handleStatusChange={handleStatusChange}
        handleDeleteOrder={handleDeleteOrder}
        state={state}
        dispatch={dispatch}
      />
    </div>
  );
};

export default Orders;
