import ReactDOM from "react-dom";
import QrCodeImage from "../../../public/QrCode.jpeg";
import Button from "../ui/Button";

export default function QrCodeModal({ setQrCodeModal, totalPrice }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4 text-center relative">
        <p className="text-lg font-medium">
          Scansiona questo QR code con l'app Satispay
        </p>
        <img
          src={QrCodeImage}
          alt="QR Code"
          className="mx-auto rounded-2xl my-4"
        />
        <div className="flex justify-between items-center px-4 mt-4">
          <h3 className="text-lg font-semibold">
            Totale:{" "}
            <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
          </h3>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => setQrCodeModal(false)}
          >
            Ho Pagato
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("qr-code-portal")
  );
}
