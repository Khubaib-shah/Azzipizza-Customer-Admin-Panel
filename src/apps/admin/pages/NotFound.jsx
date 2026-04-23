import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* Emoji Icon */}
        <div className="text-8xl animate-bounce">🚀</div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-800">404</h1>

        {/* Message */}
        <p className="text-gray-600 text-xl">
          Oops! The page you're looking for is out of orbit.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 bg-gray-800 text-white rounded-lg 
          text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
