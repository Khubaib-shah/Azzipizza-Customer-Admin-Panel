export const saveOrderToLocalStorage = (order) => {
  console.log(order);
  try {
    const existingOrders =
      JSON.parse(localStorage.getItem("orderHistory")) || [];
    const updatedOrders = [...existingOrders, order];

    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
  } catch (error) {
    console.error("Error saving order:", error);
  }
};
