import React, { useEffect, useState } from "react";
import { baseUri } from "../config/config";
import { CrossCircledIcon } from "@radix-ui/react-icons";

const ListItems = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await baseUri.get("/api/menu");
        setList(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  const handleDelete = async (id) => {
    try {
      await baseUri.delete(`/api/menu/${id}`);

      setList((prevList) => prevList.filter((list) => list._id !== id));

      console.log(`Order ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  return (
    <div className="animate-fadeIn p-6 rounded-lg max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Menu Items</h2>
      <div className="space-y-4">
        {list.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative capitalize"
          >
            <button
              onClick={() => handleDelete(item._id)}
              className="absolute top-4 right-6"
            >
              <CrossCircledIcon className="size-5 hover:text-red-800 transition-all duration-300 cursor-pointer" />
            </button>
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListItems;
