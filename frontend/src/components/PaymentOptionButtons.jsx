import { useEffect, useState } from "react";
import QrCodeModal from "./Modal/QrCodeModal";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

export function PaymentModal({ isSubmitting, handleOrderSubmit, totalPrice }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);

  const paymentOptions = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "scan", label: "Satispay", icon: Smartphone },
    { value: "bancomat", label: "Card", icon: CreditCard },
    { value: "paypal", label: "Online", icon: CreditCard },
  ];

  console.log('handleOrderSubmit', handleOrderSubmit)
  useEffect(() => {
    if (paymentMethod === "scan") {
      setQrCodeModal(true);
    } else {
      setQrCodeModal(false);
    }
  }, [paymentMethod]);
  console.log('paymentMethod', paymentMethod)

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setPaymentMethod(option.value)}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 relative cursor-pointer h-16 ${isSelected
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] shadow-sm"
                : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                }`}
              title={option.label}
            >
              <Icon size={18} className={`mb-1 ${isSelected ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
              <span className="font-medium text-[10px] leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Show QR Code Inline if Satispay is selected */}
      {qrCodeModal && (
        <QrCodeModal totalPrice={totalPrice} setQrCodeModal={setQrCodeModal} />
      )}

      <button
        onClick={() => handleOrderSubmit(paymentMethod)}
        disabled={isSubmitting || !paymentMethod}
        className={`w-full py-3 text-white font-bold text-base rounded-lg shadow-md transition-all transform active:scale-95 cursor-pointer ${isSubmitting || !paymentMethod
          ? "bg-gray-300 cursor-not-allowed shadow-none"
          : "btn-primary hover:-translate-y-0.5"
          }`}
        title=""
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Confirm - €${totalPrice.toFixed(2)}`
        )}
      </button>
    </div>
  );
}
