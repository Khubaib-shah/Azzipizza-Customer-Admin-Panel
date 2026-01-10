import QrCodeImage from "../../../public/QrCode.jpeg";

export default function QrCodeModal({ setQrCodeModal, totalPrice }) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 animate-fade-in text-center">
      <h3 className="font-['Playfair_Display'] font-bold text-lg mb-2 text-[var(--color-primary)]">
        Scan to Pay
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Open your Satispay app and scan the code below.
      </p>

      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4">
        <img
          src={QrCodeImage}
          alt="Satispay QR Code"
          className="w-48 h-48 object-contain rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <p className="font-bold text-gray-800 text-lg">
          Amount: <span className="text-[var(--color-primary)]">€{totalPrice.toFixed(2)}</span>
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Click "Confirm Order" below once payment is sent.
        </p>
      </div>
    </div>
  );
}
