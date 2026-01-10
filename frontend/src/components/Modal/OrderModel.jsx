import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { PaymentModal } from "../PaymentOptionButtons";
import { baseUri } from "../../config/config";
import { saveOrderToLocalStorage } from "../../utils/SavedOrderSucces";
import { useRestaurantStatus } from "../../utils/useRestaurantStatus";
import {
  User,
  Phone,
  MapPin,
  Clock,
  StickyNote,
  ShoppingBag,
  CreditCard,
  ChefHat,
  Building
} from "lucide-react";

// InputField defined outside to prevent re-renders losing focus
const InputField = ({ icon: Icon, name, placeholder, value, onChange, error, type = "text", className = "", ...props }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[var(--color-primary)]">
      <Icon size={16} className="text-gray-400 group-focus-within:text-[var(--color-primary)]" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-0 transition-all ${error
        ? "border-red-300 focus:border-red-500 bg-red-50 text-red-900"
        : "border-gray-200 focus:border-[var(--color-primary)] hover:border-gray-300"
        }`}
      {...props}
    />
    {error && <span className="absolute right-0 -bottom-4 text-[10px] text-red-500 font-medium whitespace-nowrap">{error}</span>}
  </div>
);

function OrderModal({ isOpen, closeModal, totalPrice, cartItems }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
    doorbellName: "",
    deliveryTime: "",
  });
  const { isOpen: restaurantOpen } = useRestaurantStatus();

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
        doorbellName: "",
        deliveryTime: "",
      });
      setFormErrors({});
      setIsTime(restaurantOpen);

      const now = new Date();
      now.setMinutes(now.getMinutes() + 40);

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const defaultTime = `${hours}:${minutes}`;

      setFormData((prev) => ({
        ...prev,
        deliveryTime: defaultTime,
      }));
    }
  }, [isOpen, restaurantOpen]);

  const validateDeliveryTime = (time) => {
    if (!time) return false;
    const [hour, minute] = time.split(":").map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hour, minute, 0, 0);

    const now = new Date();
    now.setMinutes(now.getMinutes() + 35);

    return selectedTime >= now;
  };
  const isFormValid = useMemo(() => {
    // Relaxed Phone: Allows + leading, then 8-15 digits
    const phoneRegex = /^\+?[\d\s]{8,15}$/;
    // Relaxed Zip: Allow any 5 digit number
    const zipRegex = /^\d{5}$/;

    return (
      formData.name.trim().length > 0 &&
      phoneRegex.test(formData.phoneNumber) &&
      formData.street.trim().length > 0 &&
      formData.city.trim().length > 0 &&
      zipRegex.test(formData.zipCode) &&
      formData.doorbellName.trim().length > 0 &&
      validateDeliveryTime(formData.deliveryTime)
    );
  }, [formData]);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^\+?[\d\s]{8,15}$/;
    const zipRegex = /^\d{5}$/;

    if (!formData.name.trim()) errors.name = "Required";
    if (!phoneRegex.test(formData.phoneNumber))
      errors.phoneNumber = "Invalid Number";
    if (!formData.street.trim()) errors.street = "Required";
    if (!formData.city.trim()) errors.city = "Required";
    if (!zipRegex.test(formData.zipCode))
      errors.zipCode = "Must be 5 digits";
    if (!formData.doorbellName.trim()) errors.doorbellName = "Required";

    // Time validation remains, but now invalid time will show explicit error below field
    if (!validateDeliveryTime(formData.deliveryTime)) {
      errors.deliveryTime = "Too soon";
    }

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
      name: item.name,
      price: Number(item.price).toFixed(2),
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
      doorbellName: formData.doorbellName,
      deliveryTime: formData.deliveryTime,
      paymentMethod: method,
      total: Number(totalPrice.toFixed(2)),
      customizations: formData.customizations || "",
    };

    try {
      let response;

      if (method === "paypal") {
        console.log("Order Data:", orderData);
        console.log("Base URI:", baseUri);
        response = await baseUri.post("/api/payment/create-payment", orderData);
        console.log("Response Data:", response.data);
        console.log("PayPal Response:", response);
        if (response.status >= 400) {
          toast.error(response.data.message, { position: "top-center" });
          setIsSubmitting(false);
          return;
        }
        if (response.status >= 200 && response.status < 300 && response.data.approvalUrl) {
          console.log("Redirecting to:", response.data.approvalUrl);
          window.location.href = response.data.approvalUrl;
          setIsSubmitting(false);
          return;
        } else {
          console.error("PayPal Error Condition Met:", response);
          toast.error("Failed to start direct paypal payment", {
            position: "top-center",
          });
          setIsSubmitting(false);
          return;
        }
      }

      if (["scan", "bancomat", "cash"].includes(method)) {
        response = await baseUri.post("/api/orders", orderData);
        if (response.status >= 200 && response.status < 300) {
          saveOrderToLocalStorage(response.data);
          closeModal();
          setTimeout(() => {
            navigate(
              `/order-success/${response.data._id}`
            );
          }, 50);
          return;
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error?.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      if (method !== "paypal") {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl">
      {!isTime ? (
        <div className="text-center py-20 px-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <ChefHat size={48} className="text-gray-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-[var(--color-text)]">
            Kitchen is Closed
          </h2>
          <p className="text-[var(--color-text-light)] text-xl mb-10 font-['Poppins'] max-w-md">
            We're currently taking a break. Come back later for the best pizza in town!
          </p>
          <button
            onClick={closeModal}
            className="px-8 py-3 bg-[var(--color-text)] text-white rounded-full hover:bg-black transition-colors font-medium text-lg"
          >
            I'll be back
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row h-full font-['Poppins'] overflow-hidden">
          {/* Left Column: Form */}
          <div className="flex-1 p-5 lg:p-6 overflow-y-auto max-h-[85vh] hide-scrollbar">
            <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-[var(--color-text)] font-['Playfair_Display']">
                Checkout
              </h2>
              <span className="text-xs text-gray-400">Fill details</span>
            </div>

            <div className="space-y-4">
              <section className="space-y-3">
                <h3 className="!text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Contact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    icon={User}
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={formErrors.name}
                  />
                  <InputField
                    icon={Phone}
                    name="phoneNumber"
                    type="tel"
                    placeholder="WhatsApp No."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={formErrors.phoneNumber}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="!text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} /> Delivery Address
                </h3>
                <div className="space-y-3">
                  <InputField
                    icon={MapPin}
                    name="street"
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleChange}
                    error={formErrors.street}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <InputField
                      icon={Building}
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      error={formErrors.city}
                    />
                    <InputField
                      icon={MapPin}
                      name="zipCode"
                      placeholder="ZIP"
                      value={formData.zipCode}
                      onChange={handleChange}
                      error={formErrors.zipCode}
                    />
                    <InputField
                      icon={User}
                      name="doorbellName"
                      placeholder="Doorbell"
                      value={formData.doorbellName}
                      onChange={handleChange}
                      error={formErrors.doorbellName}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="!text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} /> Time & Notes
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)]  h-[36px]">
                      <Clock className="w-[14px] h-[14px]" />
                    </div>
                    <input
                      type="time"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm transition-all ${formErrors.deliveryTime
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-[var(--color-primary)] hover:border-gray-300"
                        }`}
                    />
                  </div>

                  <div className="col-span-2 relative group">
                    <div className="absolute top-2.5 left-3 pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)]">
                      <StickyNote size={16} />
                    </div>
                    <textarea
                      name="customizations"
                      placeholder="Notes (buzzer, allergies...)"
                      value={formData.customizations}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 hover:border-gray-300 transition-all min-h-[42px] max-h-[80px] resize-none"
                      rows="1"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Validation Message Area */}
            <div className="h-4 mt-2">
              {Object.keys(formErrors).length > 0 && (
                <p className="text-red-500 text-xs text-center animate-pulse">
                  * Please check the highlighted fields
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="w-full lg:w-80 bg-[var(--color-primary)]/5 border-t lg:border-t-0 lg:border-l border-[var(--color-primary)]/10 p-5 lg:p-6 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-bold font-['Playfair_Display'] text-[var(--color-text)] mb-3 flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--color-primary)]" />
                Summary
              </h3>

              <div className="bg-white p-3 rounded-lg shadow-sm border border-[var(--color-primary)]/10 text-sm">
                <div className="flex justify-between items-center text-gray-600 mb-1">
                  <span>Items ({cartItems.length})</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span>Delivery</span>
                  <span className="text-[var(--color-basil)] font-medium">Free</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-end">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-[var(--color-primary)] font-['Playfair_Display']">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <CreditCard size={16} /> Payment
              </h4>
              <PaymentModal
                totalPrice={totalPrice}
                isSubmitting={isSubmitting}
                handleOrderSubmit={handleOrderSubmit}
                isFormValid={isFormValid}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default OrderModal;
