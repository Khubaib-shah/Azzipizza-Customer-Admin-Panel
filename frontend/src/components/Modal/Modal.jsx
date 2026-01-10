import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, className }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel
          className={`bg-white p-0 rounded-[2rem] w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/5 ${className} animate-scale-in`}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-40 p-2 bg-white/80 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800 shadow-sm border border-gray-100 cursor-pointer"
          >
            <X size={20} />
          </button>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
