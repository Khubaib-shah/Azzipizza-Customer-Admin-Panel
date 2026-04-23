import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

const CompletedOrderTable = ({ filteredOrders, handleSelectOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
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
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] py-5 pl-8">Order ID</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] hidden sm:table-cell">Items</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Revenue</TableHead>
            <TableHead className="font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right pr-8">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders
            .filter(
              (order) =>
                order.orderStatus === "Delivered" ||
                order.orderStatus === "Cancelled"
            )
            .map((order, index) => (
              <TableRow
                key={order._id || `comp-order-${index}`}
                className="cursor-pointer hover:bg-gray-50 transition-colors border-red-50/50 group"
                onClick={() => handleSelectOrder(order)}
              >
                <TableCell className="font-mono text-xs text-gray-400 font-bold pl-8">
                   #{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                   <div className="font-bold text-gray-900">{order.name}</div>
                   <div className="text-[10px] text-gray-400 font-medium">Archived Order</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} units
                  </span>
                </TableCell>
                <TableCell className="font-serif font-bold text-emerald-700 italic">
                   €{order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right pr-8">
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

export default CompletedOrderTable;
