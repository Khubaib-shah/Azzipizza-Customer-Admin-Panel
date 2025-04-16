// components/Modal.js
import { useEffect } from "react";

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  );
}
