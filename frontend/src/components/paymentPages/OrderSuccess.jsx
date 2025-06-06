import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../../context/dataContext";

const OrderSuccess = () => {
  const { clearCart } = useContext(Context);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared && orderId) {
      setCleared(true);
      setLoading(false);
      clearCart();
    } else if (!orderId) {
      setLoading(false);
    }
  }, [orderId, clearCart, cleared]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      {loading ? (
        <div className="text-lg font-medium text-gray-700 animate-pulse">
          Finalizing your order...
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Order Successful
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Order placed successfully!
          </p>
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

export default OrderSuccess;
