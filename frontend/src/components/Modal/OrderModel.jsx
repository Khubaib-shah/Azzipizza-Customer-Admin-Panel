import { Dialog } from "@headlessui/react";
import axios from "axios";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { isWithinOrderingHours } from "../../utils/isWithinOrderingHours";
import Button from "../ui/Button";

function OrderModal({
  isOpen,
  closeModal,
  totalPrice,
  cartItems,
  onOrderSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopTime, setShopTime] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        zipCode: "",
        customizations: "",
      });
      setFormErrors({});
      setShopTime(!isWithinOrderingHours());
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^(?:\+39)?\s?(?:0\d{1,4}|3\d{2})\s?\d{5,8}$/;
    const zipRegex = [
      40122, 40123, 40124, 40125, 40126, 40127, 40128, 40129, 40132, 40133,
      40134, 40135, 40136, 40137,
    ];

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!zipRegex.includes(Number(formData.zipCode)))
      errors.zipCode = "Invalid ZIP code";
    console.log(zipRegex.includes(Number(formData.zipCode)));
    console.log(formData.zipCode);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!cartItems?.length) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        menuItem: item._id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedIngredients: item.selectedIngredients?.map((ing) => ing) || [],
      }));

      const orderData = {
        items: formattedItems,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        customizations: formData.customizations || "",
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        total: totalPrice,
      };

      const response = await axios.post(
        "https://pizzeria-backend-production.up.railway.app/api/payments/pay-for-order",
        orderData
      );

      if (response.status === 200) {
        window.open(response.data.approvalUrl, "_self");
      }

      onOrderSuccess(response.data);
      closeModal();
    } catch (error) {
      console.error("Order error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashSubmit = async () => {
    if (!validateForm()) return;
    if (!cartItems?.length) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        menuItem: item._id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedIngredients: item.selectedIngredients?.map((ing) => ing) || [],
      }));

      const orderData = {
        items: formattedItems,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        customizations: formData.customizations || "",
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        total: totalPrice,
      };

      const response = await axios.post(
        "https://pizzeria-backend-production.up.railway.app/api/orders",
        orderData
      );

      setIsSubmitting(false);
      toast.success("🎉 Ordine effettuato! Lo stiamo preparando per te.", {
        position: "top-center",
      });

      // Call the success handler from parent
      onOrderSuccess(response.data);
      closeModal();
    } catch (error) {
      console.error("Order error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50">
        <div className="bg-orange-50 p-6 rounded-md max-w-lg w-full relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X />
          </button>

          {shopTime ? (
            <div className="text-center text-gray-700 py-10">
              <h2 className="text-2xl font-semibold mb-4">😴 We’re Closed!</h2>
              <p>
                Our ordering hours are between <strong>6:00 PM</strong> and{" "}
                <strong>10:30 PM</strong>.
              </p>

              <p>
                Please come back during that time to place your delicious order.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
                Place Your Order
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number *"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        formErrors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address *"
                    value={formData.street}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.street ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-400`}
                  />
                  {formErrors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.street}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400`}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code *"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        formErrors.zipCode
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-400`}
                    />
                    {formErrors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <textarea
                  name="customizations"
                  placeholder="Special Instructions (optional)"
                  value={formData.customizations}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  rows="3"
                />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-green-600">
                    €{totalPrice.toFixed(2)}
                  </span>
                </h3>
              </div>{" "}
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleCashSubmit}
                  disabled={isSubmitting}
                  className="bg-orange-500 text-white hover:bg-orange-500 text-xs"
                >
                  {isSubmitting ? "Processing..." : "Paga in contanti"}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white hover:bg-blue-500"
                >
                  {isSubmitting ? "Processing..." : "Paga con la carta"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default OrderModal;
