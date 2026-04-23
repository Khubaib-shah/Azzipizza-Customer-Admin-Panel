import {
  useEffect,
  useState,
  useCallback,
  useReducer,
  useMemo,
  useRef,
} from "react";
import { orderService } from "@shared/services";
import { URL as BASE_URL } from "@shared/config/api"; // Keep for socket
import io from "socket.io-client";
import OrderSideBar from "../components/OrderSideBar";
import { Search, RefreshCw, ShoppingBag, Loader2 } from "lucide-react";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { useNotifications } from "../hooks/useNotifications";
import NotificationSound from "/notification-sound.wav";
import CompletedOrderTable from "../components/CompletedOrderTable";
import ActiveOrderTable from "../components/ActiveOrderTable";
import { reducer } from "@shared/utils/reducer";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setNotifications } = useNotifications();
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const audio = useRef(new Audio(NotificationSound)).current;
  const socketRef = useRef(null);

  // Prime audio on first interaction to bypass autoplay policies
  useEffect(() => {
    const primeAudio = () => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("[Audio]: Primed successfully");
      }).catch(() => {
        console.log("[Audio]: Waiting for interaction to prime");
      });
      window.removeEventListener("click", primeAudio);
    };
    window.addEventListener("click", primeAudio);
    return () => window.removeEventListener("click", primeAudio);
  }, [audio]);

  const playAlert = useCallback(async () => {
    try {
      audio.volume = 1.0;
      audio.currentTime = 0;
      await audio.play();
      setIsAudioBlocked(false);
    } catch (err) {
      console.error("[Audio Playback Error]:", err);
      setIsAudioBlocked(true);
    }
  }, [audio]);

  useEffect(() => {
    if (ENABLE_SOCKET && !socketRef.current) {
      socketRef.current = io(BASE_URL, { transports: ["websocket"] });
      socketRef.current.on("connect", () => console.log("[Socket Connected]:", socketRef.current.id));
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
      const response = await orderService.getAllOrders();
      const sortedData = [...response.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedData);
    } catch (error) {
      console.error("[Orders Fetch Error]:", error);
      setError("Failed to load orders.");
      toast.error("Could not sync with the engine.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
    toast.info("Order list updated.", { autoClose: 1000 });
  };

  useEffect(() => {
    fetchOrders();

    if (ENABLE_SOCKET && socketRef.current) {
      const handleNewOrder = (newOrder) => {
        if (!newOrder?._id) return;
        setOrders((prev) => {
          if (prev.some(o => o._id === newOrder._id)) return prev;
          return [newOrder, ...prev];
        });

        // Side effects outside of setOrders
        setNotifications((n) => {
          if (n.some(item => item.id === newOrder._id)) return n;
          return [...n, { id: newOrder._id, message: "New Order!", items: newOrder }];
        });
        playAlert();
        toast.success("New order received!");
      };

      const handleOrderUpdate = (updated) => {
        setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
        if (selectedOrder?._id === updated._id) setSelectedOrder(updated);
      };

      const handleOrderDelete = (id) => {
        setOrders(prev => prev.filter(o => o._id !== id));
        if (selectedOrder?._id === id) setSelectedOrder(null);
      };

      socketRef.current.on("order:new", handleNewOrder);
      socketRef.current.on("order:update", handleOrderUpdate);
      socketRef.current.on("order:delete", handleOrderDelete);

      return () => {
        socketRef.current?.off("order:new", handleNewOrder);
        socketRef.current?.off("order:update", handleOrderUpdate);
        socketRef.current?.off("order:delete", handleOrderDelete);
      };
    }
  }, [fetchOrders, setNotifications, playAlert]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(o => (o.name?.toLowerCase().includes(s) || o._id.toLowerCase().includes(s)));
    }
    if (statusFilter && statusFilter !== "All Statuses") {
      result = result.filter(o => o.orderStatus === statusFilter);
    }
    return result;
  }, [orders, searchTerm, statusFilter]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    if (order.eta) {
      setEtaMinutes(Math.max(0, Math.floor((new Date(order.eta) - Date.now()) / 60000)));
    } else {
      setEtaMinutes(20);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    dispatch({ type: "SET_UP_LOADING", payload: true });
    try {
      const etaTime = new Date(Date.now() + etaMinutes * 60000);
      const response = await orderService.updateOrder(selectedOrder._id, { eta: etaTime });

      setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, eta: etaTime } : o));
      setSelectedOrder(prev => ({ ...prev, eta: etaTime }));

      socketRef.current?.emit("order:update", { ...response.data.updatedOrder, eta: etaTime });
      toast.success("Order ETA updated.");
    } catch (err) {
      toast.error("Failed to update ETA.");
    } finally {
      dispatch({ type: "SET_UP_LOADING", payload: false });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    dispatch({ type: "SET_UP_LOADING", payload: true });
    try {
      const response = await orderService.updateOrder(orderId, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));

      socketRef.current?.emit("order:update", { ...response.data.updatedOrder, orderStatus: newStatus });
      toast.success(`Order status: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      dispatch({ type: "SET_UP_LOADING", payload: false });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    dispatch({ type: "SET_DEL_LOADING", payload: true });
    try {
      await orderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
      socketRef.current?.emit("order:delete", orderId);
      toast.success("Order removed.");
    } catch (err) {
      toast.error("Failed to delete order.");
    } finally {
      dispatch({ type: "SET_DEL_LOADING", payload: false });
    }
  };

  const statusOptions = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className={`transition-all duration-500 ${selectedOrder ? "xl:mr-96" : ""} min-h-screen bg-slate-50/50 p-4 md:p-8`}>
      <AnimatePresence>
        {isAudioBlocked && (
          <motion.div
            key="audio-blocked-alert"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            onClick={playAlert}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-red-700 transition-colors border-2 border-white/20 backdrop-blur-md"
          >
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-wider">Audio Alerts Blocked</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Click anywhere to enable kitchen sound</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black !text-slate-900 tracking-tight">
              Order <span className="text-red-600 underline underline-offset-8 decoration-slate-200">Management</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">Manage and track all incoming customer orders.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">

            <div className="flex items-center gap-4">
              <div className="relative group flex-1 md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <Input
                  type="search"
                  placeholder="Track any order..."
                  className="pl-12 w-full bg-slate-50 border-none rounded-xl focus-visible:ring-red-600/10 font-bold h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshOrders}
                className={`rounded-xl border-slate-100 h-12 w-12 hover:bg-slate-50 transition-all ${refreshing ? "animate-spin" : ""}`}
              >
                <RefreshCw className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-50 border-none rounded-xl focus:ring-red-600/10 font-bold text-slate-700 h-12 px-6">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                <SelectItem value="All Statuses" className="font-bold cursor-pointer h-10">All Orders</SelectItem>
                {statusOptions.map(s => <SelectItem key={s} value={s} className="font-medium cursor-pointer h-10">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </header>

        <Tabs defaultValue="active" className="w-full" variant="line">
          <TabsList className="grid grid-cols-1 md:grid-cols-2 w-full md:w-fit h-auto gap-2 md:gap-0 mb-4 md:mb-8 p-1.5 bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-50">
            {["active", "completed"].map(t => (
              <TabsTrigger key={t} value={t} className="px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-slate-950 data-[state=active]:text-white data-[state=active]:shadow-2xl">
                {t} Orders
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key="active-tabs" value="active" className="focus-visible:outline-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
                <Card className="border-none shadow-premium rounded-4xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-10">
                    <CardTitle className="text-xl font-serif font-black text-slate-800">Cooking Queue</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {state.loading ? (
                      <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Loading orders...</p>
                      </div>
                    ) : filteredOrders.filter(o => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled").length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-96 p-10 text-center">
                        <ShoppingBag className="h-16 w-16 text-slate-100 mb-6" />
                        <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">No Active Orders</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">New orders will appear here as soon as they are placed.</p>
                      </div>
                    ) : (
                      <ActiveOrderTable filteredOrders={filteredOrders} handleSelectOrder={handleSelectOrder} />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent key="completed-tabs" value="completed" className="focus-visible:outline-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
                <Card className="border-none shadow-premium rounded-4xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-10">
                    <CardTitle className="text-xl font-serif font-black text-slate-800">Order History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {state.loading ? (
                      <div className="flex items-center justify-center h-96">
                        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
                      </div>
                    ) : filteredOrders.filter(o => o.orderStatus === "Delivered" || o.orderStatus === "Cancelled").length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-96 p-10 text-center">
                        <ShoppingBag className="h-16 w-16 text-slate-100 mb-6" />
                        <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">No History</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">Completed or cancelled orders will be archived here.</p>
                      </div>
                    ) : (
                      <CompletedOrderTable filteredOrders={filteredOrders} handleSelectOrder={handleSelectOrder} />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

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
