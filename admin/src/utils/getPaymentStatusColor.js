export const getPaymentStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 text-white";
    case "Pending":
      return "bg-blue-500 text-white";
  }
};
