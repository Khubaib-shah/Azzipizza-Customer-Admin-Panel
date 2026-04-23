export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "preparing":
      return "text-yellow-600";
    case "on the way":
    case "out for delivery":
      return "text-blue-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-orange-600";
  }
};
