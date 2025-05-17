import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, className }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-orange-50 p-6 rounded-md max-w-full w-full relative">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-40
             ${className}
            `}
          >
            <X />
          </button>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
