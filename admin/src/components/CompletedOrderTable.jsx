import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

const CompletedOrderTable = ({ filteredOrders, handleSelectOrder }) => {
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

  return (
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
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </TableCell>
                <TableCell>€{order.totalPrice.toFixed(2)}</TableCell>
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
  );
};

export default CompletedOrderTable;
