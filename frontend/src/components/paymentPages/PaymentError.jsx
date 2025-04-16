import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! Something went wrong while processing your payment.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default PaymentError;
