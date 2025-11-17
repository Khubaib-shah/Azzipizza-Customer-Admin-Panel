const getTimeLeft = (order) => {
  const status = order?.orderStatus?.toLowerCase();
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";

  const now = new Date();
  let targetTime = order.eta
    ? new Date(order.eta)
    : new Date(new Date(order.createdAt).getTime() + 40 * 60000);

  const remainingMs = targetTime - now;

  if (remainingMs <= 0) return "Time expired";
  return `${Math.ceil(remainingMs / 60000)} min remaining`;
};

export default getTimeLeft;
