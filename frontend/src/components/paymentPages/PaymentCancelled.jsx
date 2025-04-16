import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You have cancelled the payment. If this was a mistake, you can try
        again.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
      >
        Return to Home
      </button>
    </div>
  );
};

export default PaymentCancelled;
