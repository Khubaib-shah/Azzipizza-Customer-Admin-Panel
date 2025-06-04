import { useEffect, useState } from "react";
import Button from "./ui/Button";
import QrCodeModal from "./Modal/QrCodeModal";

export function PaymentModal({ isSubmitting, handleOrderSubmit, totalPrice }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);

  const paymentOptions = [
    { value: "cash", label: "Paga in contanti" },
    { value: "scan", label: "Scan to Pay (QR)" },
    { value: "bancomat", label: "Bancomat alla consegna" },
    { value: "paypal", label: "Paga con paypal" },
  ];

  useEffect(() => {
    if (paymentMethod === "scan") {
      setQrCodeModal(true);
    } else {
      setQrCodeModal(false);
    }
  }, [paymentMethod]);

  return (
    <div className="mt-6 flex flex-col gap-3 items-end">
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Seleziona un metodo di pagamento</option>
        {paymentOptions.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>

      {qrCodeModal && (
        <QrCodeModal totalPrice={totalPrice} setQrCodeModal={setQrCodeModal} />
      )}

      <div className="flex gap-3">
        <Button
          disabled={isSubmitting}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleOrderSubmit(paymentMethod)}
          disabled={
            isSubmitting || !paymentMethod || paymentMethod === "paypal"
          }
          className={`text-white ${
            isSubmitting || !paymentMethod || paymentMethod === "satispay"
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting
            ? "Processing..."
            : paymentMethod === "satispay"
            ? "Not Available yet"
            : "Conferma pagamento"}
        </Button>
      </div>
    </div>
  );
}
