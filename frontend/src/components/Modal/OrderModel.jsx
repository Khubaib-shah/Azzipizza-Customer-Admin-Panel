import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

// Order Modal Component
function OrderModal({ isOpen, closeModal, placeOrder, totalPrice }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode
    ) {
      toast.error("Please fill in all required fields!", {
        position: "top-center",
      });
      return;
    }
    placeOrder(formData);
    toast.success("Order placed successfully!", { position: "top-center" });
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          🛍️ Place Your Order
        </h2>

        {/* Form Fields */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <textarea
            name="customizations"
            placeholder="Customizations (optional)"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Total Price */}
        <div className="mt-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total:{" "}
            <span className="text-green-600">${totalPrice.toFixed(2)}</span>
          </h3>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default OrderModal;
