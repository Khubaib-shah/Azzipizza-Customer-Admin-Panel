import {
  useEffect,
  useState,
  useCallback,
  useReducer,
  useMemo,
  useRef,
} from "react";
import { baseUri, URL } from "../config/config";
import io from "socket.io-client";
import OrderSideBar from "../components/OrderSideBar";
import { Search, Filter, AlertCircle, RefreshCw } from "lucide-react";
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
import { reducer } from "../utils/reducer";

const ENABLE_SOCKET = import.meta.env.VITE_ENABLE_SOCKET === "true";

const initialState = {
  loading: false,
  delLoading: false,
  upLoading: false,
  punchLoading: false,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { setNotifications } = useNotifications();
  const [state, dispatch] = useReducer(reducer, initialState);
  const audio = useRef(new Audio(NotificationSound)).current;

  const socketRef = useRef(null);

  useEffect(() => {
    if (ENABLE_SOCKET && !socketRef.current) {
      socketRef.current = io(URL, { transports: ["websocket"] });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log(" Socket disconnected");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await baseUri.get("/api/orders");

      const sortedData = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedData);
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

  useEffect(() => {
    fetchOrders();

    if (ENABLE_SOCKET && socketRef.current) {
      const handleNewOrder = (newOrder) => {
        console.log("📦 New order received via socket:", newOrder);

        setOrders((prevOrders) => {
          const exists = prevOrders.some(
            (order) => order._id.toString() === newOrder._id.toString()
          );
          if (!exists) {
            setNotifications((prev) => [
              ...prev,
              {
                id: newOrder._id,
                message: "New order received!",
                items: newOrder,
              },
            ]);
            audio.play();
            return [newOrder, ...prevOrders];
          }
          return prevOrders;
        });
      };

      const handleOrderUpdate = (updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );

        if (selectedOrder?._id === updatedOrder._id) {
          setSelectedOrder(updatedOrder);
        }
      };

      const handleOrderDelete = (deletedOrderId) => {
        setOrders((prev) =>
          prev.filter((order) => order._id !== deletedOrderId)
        );

        if (selectedOrder?._id === deletedOrderId) {
          setSelectedOrder(null);
        }
      };

      socketRef.current.on("order:new", handleNewOrder);
      socketRef.current.on("order:update", handleOrderUpdate);
      socketRef.current.on("order:delete", handleOrderDelete);

      return () => {
        if (socketRef.current) {
          socketRef.current.off("order:new", handleNewOrder);
          socketRef.current.off("order:update", handleOrderUpdate);
          socketRef.current.off("order:delete", handleOrderDelete);
        }
      };
    }
  }, [fetchOrders, selectedOrder, setNotifications, audio]);

  const applyFilters = useCallback((orders, search, status) => {
    let result = [...orders];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (order) =>
          order.name?.toLowerCase().includes(searchLower) ||
          order._id.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== "All Statuses") {
      result = result.filter((order) => order.orderStatus === status);
    }

    return result;
  }, []);

  const filteredOrders = useMemo(() => {
    return applyFilters(orders, searchTerm, statusFilter);
  }, [orders, searchTerm, statusFilter, applyFilters]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);

    if (order.eta) {
      const remainingTime = Math.max(
        0,
        Math.floor((new Date(order.eta) - Date.now()) / 60000)
      );
      setEtaMinutes(remainingTime);
    } else {
      setEtaMinutes(20);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    dispatch({ type: "SET_UP_LOADING", payload: true });

    try {
      const etaTime = new Date(Date.now() + etaMinutes * 60000);

      const { data } = await baseUri.put(`/api/orders/${selectedOrder._id}`, {
        eta: etaTime,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id ? { ...order, eta: etaTime } : order
        )
      );

      if (selectedOrder._id === data.updatedOrder._id) {
        setSelectedOrder((prev) => ({ ...prev, eta: etaTime }));
      }

      if (ENABLE_SOCKET && socketRef.current) {
        socketRef.current.emit("order:update", {
          ...data.updatedOrder,
          eta: etaTime,
        });
      }

      dispatch({ type: "SET_UP_LOADING", payload: false });
    } catch (error) {
      console.error("Failed to update order:", error);
      setError("Failed to update order ETA. Please try again.");
      dispatch({ type: "SET_UP_LOADING", payload: false });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    dispatch({ type: "SET_UP_LOADING", payload: true });

    try {
      const { data } = await baseUri.put(`/api/orders/${orderId}`, {
        orderStatus: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }

      if (ENABLE_SOCKET && socketRef.current) {
        socketRef.current.emit("order:update", {
          ...data.updatedOrder,
          orderStatus: newStatus,
        });
      }

      dispatch({ type: "SET_UP_LOADING", payload: false });
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status. Please try again.");
      dispatch({ type: "SET_UP_LOADING", payload: false });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    dispatch({ type: "SET_DEL_LOADING", payload: true });

    try {
      await baseUri.delete(`/api/orders/${orderId}`);

      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }

      if (ENABLE_SOCKET && socketRef.current) {
        socketRef.current.emit("order:delete", orderId);
      }

      dispatch({ type: "SET_DEL_LOADING", payload: false });
    } catch (error) {
      console.error("Failed to delete order:", error);
      setError("Failed to delete order. Please try again.");
      dispatch({ type: "SET_DEL_LOADING", payload: false });
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
      } overflow-hidden`}
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
                <SelectItem value="All Statuses">All Statuses</SelectItem>
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
                ) : filteredOrders.filter(
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
      ;
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
