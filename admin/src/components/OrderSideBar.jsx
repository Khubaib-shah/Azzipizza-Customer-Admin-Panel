import React from "react";
import {
  X,
  Clock,
  Trash2,
  Save,
  MapPin,
  Phone,
  User,
  ChevronUp,
  ChevronDown,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { pdf } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";
import { saveAs } from "file-saver";

const statusOptions = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const OrderSideBar = ({
  selectedOrder,
  etaMinutes,
  setEtaMinutes,
  setSelectedOrder,
  handleUpdateOrder,
  handleDeleteOrder,
  handleStatusChange,
  state,
  dispatch,
}) => {
  if (!selectedOrder) return null;

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

  const handlePrinterAnOrder = async () => {
    dispatch({ type: "SET_PUNCH_LOADING", payload: true });

    const blob = await pdf(<ReceiptDocument order={selectedOrder} />).toBlob();
    saveAs(blob, "receipt.pdf");
    dispatch({ type: "SET_PUNCH_LOADING", payload: false });
  };
  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 pt-16 transition-transform duration-300 flex flex-col z-10">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedOrder(null)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="font-mono font-medium">
                #{selectedOrder._id.slice(-5)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  selectedOrder.orderStatus
                )}`}
              >
                {selectedOrder.orderStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-medium">
                ${selectedOrder.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              Customer Information
            </h3>
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedOrder.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {selectedOrder.phoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-sm">
                    {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.zipCode}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Order Items</h3>
            <Card>
              <CardContent className="p-3 space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-2 last:border-0"
                  >
                    <div className="flex justify-between items-start border-gray-100 last:border-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {item.quantity}x
                          </span>
                          <span className="text-sm">{item.menuItem?.name}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        €{(item.menuItem?.price).toFixed(2)}
                      </span>
                    </div>
                    {item.selectedIngredients &&
                      item.selectedIngredients.length > 0 && (
                        <div className="flex flex-col gap-1 w-full">
                          {item.selectedIngredients.map((ing, index) => (
                            <div className="flex justify-between ps-5">
                              <span key={index} className="text-xs">
                                x {ing.name}
                              </span>
                              <span key={index} className="text-xs">
                                €{ing.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
                {selectedOrder.items[0].customizations && (
                  <u className="text-sm">
                    Note : {selectedOrder.items[0].customizations}
                  </u>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Update Status</h3>
            <Select
              value={selectedOrder.orderStatus}
              onValueChange={(value) =>
                handleStatusChange(selectedOrder._id, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Estimated Time of Arrival
            </h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEtaMinutes((prev) => Math.max(0, prev - 5))}
                disabled={etaMinutes === 0}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-medium">{etaMinutes}</span>
                  <span className="text-sm text-gray-500">min</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEtaMinutes((prev) => prev + 5)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button className="w-full" onClick={handleUpdateOrder}>
          <Save className="h-4 w-4 mr-2" />

          {state.upLoading ? "Updating...." : "Update Order"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePrinterAnOrder}
        >
          <Printer className="h-4 w-4 mr-2" />
          {state.punchLoading ? "Punching..." : "Punch Order"}
        </Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => handleDeleteOrder(selectedOrder._id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {state.delLoading ? "Deleting..." : "Delete Order"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSideBar;
