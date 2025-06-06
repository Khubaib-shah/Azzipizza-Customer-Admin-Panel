import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Context from "../../context/dataContext";
import { baseUri } from "../../config/config";

const PaymentSuccess = () => {
  const { clearCart } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Finalizing your payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("paymentId");
    const PayerID = query.get("PayerID");
    const orderId = query.get("orderId");

    if (!paymentId || !PayerID || !orderId) {
      setStatus("Missing payment information.");
      setLoading(false);
      navigate("/payment-error", { replace: true });
      return;
    }

    const finalizePayment = async () => {
      try {
        setLoading(true);
        const res = await baseUri.post("/api/payment/success", {
          paymentId,
          PayerID,
          orderId,
        });

        console.log("Payment response:", res.data);

        if (res.data.success) {
          clearCart();
        } else {
          console.error("Payment failed", res.data);
          navigate("/payment-error", { replace: true });
        }
      } catch (err) {
        console.error("Payment execution failed", err);
        navigate("/payment-error", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    finalizePayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      {loading ? (
        <div className="text-lg font-medium text-gray-700 animate-pulse">
          {status}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Payment Successful
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Your payment has been processed successfully!
          </p>
          <p className="text-md text-gray-600 mb-6">
            Your order will be delivered in 35 to 40 minutes.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Go to Home
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
