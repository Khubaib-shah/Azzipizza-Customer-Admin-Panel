export const saveOrderToLocalStorage = (order) => {
  try {
    const existingOrders =
      JSON.parse(localStorage.getItem("orderHistory")) || [];
    const updatedOrders = [...existingOrders, order];

    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("orderHistoryUpdated"));
  } catch (error) {
    console.error("Error saving order:", error);
  }
};
