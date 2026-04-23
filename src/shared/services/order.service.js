import apiClient from "./api-client";

/**
 * Service for managing customer orders.
 */
class OrderService {
  /**
   * Fetches all orders.
   */
  async getAllOrders() {
    return apiClient.get("/api/orders");
  }

  /**
   * Updates an order (e.g., ETA or status).
   * @param {string} id - Order ID.
   * @param {object} data - Data to update.
   */
  async updateOrder(id, data) {
    return apiClient.put(`/api/orders/${id}`, data);
  }

  /**
   * Deletes an order.
   * @param {string} id - Order ID.
   */
  async deleteOrder(id) {
    return apiClient.delete(`/api/orders/${id}`);
  }

  /**
   * Places a new order (Client side).
   * @param {object} orderData - Order details.
   */
  async placeOrder(orderData) {
    return apiClient.post("/api/orders", orderData);
  }
}

export const orderService = new OrderService();
export default orderService;
