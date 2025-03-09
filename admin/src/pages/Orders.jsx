import React, { useEffect, useState, useCallback, useContext } from "react";
import { baseUri } from "../config/config";
import io from "socket.io-client";
import OrderSideBar from "../components/OrderSideBar";
import { Search, Filter, Clock, AlertCircle, RefreshCw } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "../hooks/useNotifications";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { setNotifications } = useNotifications();

  const socket = io("http://localhost:5000", { transports: ["websocket"] });

  // Fetch Orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await baseUri.get("/api/orders");
      setOrders(data);
      setFilteredOrders(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  }, []);

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle real-time order updates
  useEffect(() => {
    fetchOrders();

    socket.on("latestOrders", (data) => {
      const reversedData = data.slice().reverse();
      setOrders(reversedData);
      console.log("Latest Orders:", reversedData);

      const latestOrder = reversedData[0];

      if (!latestOrder || !latestOrder.items) return;

      setNotifications((prev) => {
        const alreadyExists = prev.some((n) => n.id === latestOrder.id);
        if (alreadyExists) return prev;

        return [
          ...prev,
          {
            id: latestOrder._id,
            message: "New order received!",
            items: latestOrder,
          },
        ];
      });

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

      console.log("Updated ETA:", data.updatedOrder.eta);
    } catch (error) {
      console.error("Failed to update order:", error);
      setError("Failed to update order ETA. Please try again.");
    }
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
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
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  // Handle Order Deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      await baseUri.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      setError("Failed to delete order. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-white";
      case "Out for Delivery":
        return "bg-yellow-500 text-white";
      case "Preparing":
        return "bg-blue-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
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
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
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
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders
                          .filter(
                            (order) =>
                              order.orderStatus !== "Delivered" &&
                              order.orderStatus !== "Cancelled"
                          )
                          .map((order) => (
                            <TableRow
                              key={order._id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSelectOrder(order)}
                            >
                              <TableCell className="font-mono">
                                #{order._id.slice(-5)}
                              </TableCell>
                              <TableCell>{order.name}</TableCell>
                              <TableCell>
                                {order.items.reduce(
                                  (acc, item) => acc + item.quantity,
                                  0
                                )}
                              </TableCell>
                              <TableCell>
                                ${order.totalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {order.eta ? (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                    <span>
                                      {Math.max(
                                        0,
                                        Math.floor(
                                          (new Date(order.eta) - Date.now()) /
                                            60000
                                        )
                                      )}{" "}
                                      min
                                    </span>
                                  </div>
                                ) : (
                                  "Not Set"
                                )}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    order.orderStatus
                                  )}`}
                                >
                                  {order.orderStatus}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-primary/80"
                                >
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
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
                {loading ? (
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders
                          .filter(
                            (order) =>
                              order.orderStatus === "Delivered" ||
                              order.orderStatus === "Cancelled"
                          )
                          .map((order) => (
                            <TableRow
                              key={order._id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSelectOrder(order)}
                            >
                              <TableCell className="font-mono">
                                #{order._id.slice(-5)}
                              </TableCell>
                              <TableCell>{order.name}</TableCell>
                              <TableCell>
                                {order.items.reduce(
                                  (acc, item) => acc + item.quantity,
                                  0
                                )}
                              </TableCell>
                              <TableCell>
                                ${order.totalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    order.orderStatus
                                  )}`}
                                >
                                  {order.orderStatus}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-primary/80"
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
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
      />
    </div>
  );
};

export default Orders;
