import Modal from "./Modal";

export default function QrCodeModal({ setQrCodeModal, totalPrice }) {
  return (
    <Modal isOpen={true} onClose={() => setQrCodeModal(false)} className="max-w-md bg-white border border-gray-100 mt-4 animate-fade-in text-center shadow-lg relative z-10 mx-auto">
      <div className="flex flex-col items-center p-8 bg-white rounded-3xl text-center relative z-10 w-full mx-auto">
        <h3 className="font-serif font-black text-3xl mb-2 text-slate-800 tracking-tight">
          Scan to Pay
        </h3>
        <p className="text-sm text-slate-600 mb-6 px-4">
          Open your Satispay app and scan the code below.
        </p>

        <div className="bg-white p-2 rounded-2xl mb-6 shadow-sm border border-gray-50">
          <img
            src="/QrCode.jpeg"
            alt="Satispay QR Code"
            className="w-56 h-auto object-contain rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <p className="font-bold text-slate-800 text-xl">
            Amount: <span className="text-red-600">€{totalPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
