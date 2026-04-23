import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Clock } from "lucide-react";
const ActiveOrderTable = ({ filteredOrders, handleSelectOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Preparing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="hover:bg-transparent border-red-50">
            <TableHead className="hidden md:table-cell font-bold text-gray-500 uppercase tracking-widest text-[10px] py-5 pl-2">Order ID</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] hidden sm:table-cell">Items</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Total</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] ">Time Left</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right pr-2">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders
            .filter(
              (order) =>
                order.orderStatus !== "Delivered" &&
                order.orderStatus !== "Cancelled"
            )
            .map((order, index) => (
              <TableRow
                key={order._id || `order-${index}`}
                className="cursor-pointer hover:bg-red-50/30 transition-colors border-red-50/50 group"
                onClick={() => handleSelectOrder(order)}
              >
                <TableCell className="hidden md:table-cell font-mono text-xs text-red-600 font-bold pl-2">
                  #{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-gray-900">{order.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">Standard Delivery</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} units
                  </span>
                </TableCell>
                <TableCell className="font-serif font-bold text-gray-900 italic">
                  €{order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="">
                  {order.eta ? (
                    <div className="flex items-center text-amber-600 font-bold text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-fit">
                      <Clock className="h-3 w-3 mr-1.5 animate-pulse" />
                      <span>
                        {Math.max(
                          0,
                          Math.floor((new Date(order.eta) - Date.now()) / 60000)
                        )}{" "}
                        min
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-300 italic text-xs">Waiting for ETA...</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-2">
                  <span
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border ${getStatusColor(
                      order.orderStatus
                    )} shadow-sm`}
                  >
                    {order.orderStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveOrderTable;
