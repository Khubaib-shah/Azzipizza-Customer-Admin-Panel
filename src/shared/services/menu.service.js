import apiClient from "./api-client";

/**
 * Service for managing menu items and categories.
 * Encapsulates all API logic for the menu component.
 */
class MenuService {
  /**
   * Fetches all menu items.
   */
  async getAllItems() {
    return apiClient.get("/api/menu");
  }

  /**
   * Adds a new menu item.
   * @param {FormData} formData - FormData containing item details and an image.
   */
  async addItem(formData) {
    return apiClient.post("/api/menu", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Deletes a menu item by ID.
   * @param {string} id - The ID of the item to delete.
   */
  async deleteItem(id) {
    return apiClient.delete(`/api/menu/${id}`);
  }

  /**
   * Updates an existing menu item.
   * @param {string} id - The ID of the item to update.
   * @param {FormData} formData - Updated item data.
   */
  async updateItem(id, formData) {
    return apiClient.put(`/api/menu/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const menuService = new MenuService();
export default menuService;
