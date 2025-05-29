import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../context/dataContext";

const PaymentSuccess = () => {
  const { clearCart } = useContext(Context);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Finalizing your order...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    localStorage.removeItem("orderData");
    setStatus("Order placed successfully!");
    setLoading(false);

    const timer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      {loading ? (
        <div className="text-lg font-medium text-gray-700 animate-pulse">
          {status}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Order Successful
          </h1>
          <p className="text-lg text-gray-700 mb-2">{status}</p>
          <p className="text-md text-gray-600 mb-6">
            Your order will be delivered in 35 to 40 minutes.
          </p>

          <button
            onClick={() => navigate("/")}
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
