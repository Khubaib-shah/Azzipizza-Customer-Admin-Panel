import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Phone, ArrowLeft } from "lucide-react";

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-['Poppins']">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden animate-shake">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>

        <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <XCircle size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-['Playfair_Display']">
          Payment Failed
        </h1>
        <p className="text-gray-500 mb-8">
          We encountered an error processing your payment. Please ensure your details are correct or try a different method.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all"
          >
            Return to Cart
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={16} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
