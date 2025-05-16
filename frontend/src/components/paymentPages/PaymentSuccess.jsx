import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Context from "../../context/dataContext";

const PaymentSuccess = () => {
  const { clearCart } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Finalizing your order...");

  useEffect(() => {
    const finalizePayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get("paymentId");
      const PayerID = searchParams.get("PayerID");

      // 🚫 If no PayPal info: assume cash payment success
      if (!paymentId || !PayerID) {
        setStatus("Order placed successfully!");
        setLoading(false);
        return;
      }

      // ✅ Handle PayPal flow
      const orderData = JSON.parse(localStorage.getItem("orderData"));

      console.log(orderData);

      if (!orderData) {
        setStatus("No order data found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://pizzeria-backend-production.up.railway.app/api/payments/success",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId,
              PayerID,
              ...orderData,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment execution failed");
        }

        setStatus("Payment successful and order placed!");
        localStorage.removeItem("orderData");
      } catch (error) {
        console.error("Payment finalization error:", error);
        setStatus("Something went wrong while finalizing your payment.");
      } finally {
        setLoading(false);
      }
    };

    finalizePayment();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      {loading ? (
        <div className="text-lg font-medium text-gray-700 animate-pulse">
          {status}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            {status.includes("successful") || status.includes("placed")
              ? "Order Successful"
              : "Payment Status"}
          </h1>
          <p className="text-lg text-gray-700 mb-2">{status}</p>

          {status.includes("successful") || status.includes("placed") ? (
            <p className="text-md text-gray-600 mb-6">
              Your order will be delivered in 35 to 40 minutes.
            </p>
          ) : (
            <div className="mb-6" />
          )}

          <button
            onClick={() => {
              clearCart();
              navigate("/");
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Go to Home
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
