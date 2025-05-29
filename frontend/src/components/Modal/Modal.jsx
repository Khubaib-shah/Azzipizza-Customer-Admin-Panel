import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, className }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel
          className={`bg-orange-50 p-6 rounded-md w-full max-w-2xl relative max-h-[90vh] overflow-y-auto ${className}`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 hover:text-black/70 cursor-pointer"
          >
            <X />
          </button>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
