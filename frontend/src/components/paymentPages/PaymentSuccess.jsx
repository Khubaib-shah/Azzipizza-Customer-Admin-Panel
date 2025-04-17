import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you! Your payment has been processed successfully.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
