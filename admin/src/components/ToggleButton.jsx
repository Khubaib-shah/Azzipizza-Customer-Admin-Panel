import { ToggleLeft, ToggleRight } from "lucide-react";

const ToggleButton = ({ restaurantOpen, toggleStatus }) => {
  return (
    <button
      onClick={toggleStatus}
      className="relative w-12 h-7 rounded-full bg-gray-300 focus:outline-none"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-7 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-300 ${
          restaurantOpen ? "translate-x-4" : "translate-x-0"
        }`}
      >
        {restaurantOpen ? (
          <ToggleRight className="h-4 w-4 text-green-500" />
        ) : (
          <ToggleLeft className="h-4 w-4 text-gray-500" />
        )}
      </div>
    </button>
  );
};

export default ToggleButton;
