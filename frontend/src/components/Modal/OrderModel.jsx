import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { isWithinOrderingHours } from "../../utils/isWithinOrderingHours";
import { PaymentModal } from "../PaymentOptionButtons";
import { baseUri } from "../../config/config";
import { saveOrderToLocalStorage } from "../../utils/SavedOrderSucces";

function OrderModal({ isOpen, closeModal, totalPrice, cartItems }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isTime, setIsTime] = useState(false);

  const navigate = useNavigate();

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
      // setIsTime(!isWithinOrderingHours());
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
    if (!phoneRegex.test(formData.phoneNumber))
      errors.phoneNumber = "Invalid phone number";
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!zipRegex.includes(Number(formData.zipCode)))
      errors.zipCode = "Invalid ZIP code";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOrderSubmit = async (method) => {
    if (!validateForm()) return;

    if (!cartItems?.length) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    const formattedItems = cartItems.map((item) => ({
      menuItem: item._id,
      quantity: item.quantity,
      selectedIngredients: item.selectedIngredients || [],
    }));

    const orderData = {
      items: formattedItems,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
      },
      paymentMethod: method,
      total: totalPrice,
      customizations: formData.customizations || "",
    };

    try {
      let response;

      if (method === "satispay") {
        response = await baseUri.post(
          "/api/payment/create-checkout",
          orderData
        );
        if (response.status === 200 && response.data.redirectUrl) {
          saveOrderToLocalStorage(response.data);

          window.location.href = response.data.redirectUrl;
          return;
        } else {
          toast.error("Failed to start direct Satispay payment", {
            position: "top-center",
          });
          return;
        }
      }

      if (["scan", "bancomat", "cash"].includes(method)) {
        response = await baseUri.post("/api/orders", orderData);

        if (response.status >= 200 && response.status < 300) {
          saveOrderToLocalStorage(response.data);

          toast.success("🎉 Ordine effettuato! Lo stiamo preparando per te.", {
            position: "top-center",
          });

          closeModal();

          setTimeout(() => navigate("/order-success"), 50);
          return;
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error?.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      if (method !== "satispay") {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {isTime ? (
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
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
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
                <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>
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
                  <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
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
                    formErrors.zipCode ? "border-red-500" : "border-gray-300"
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
              <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
            </h3>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <PaymentModal
              totalPrice={totalPrice}
              isSubmitting={isSubmitting}
              handleOrderSubmit={handleOrderSubmit}
            />
          </div>
        </>
      )}
    </Modal>
  );
}

export default OrderModal;
