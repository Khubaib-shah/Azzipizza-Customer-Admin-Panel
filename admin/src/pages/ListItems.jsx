// src/pages/ListItems.js
import React from "react";

const ListItems = () => {
  // Dummy data for restaurant menu items
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil.",
      price: 12.99,
      category: "Pizza",
      image: "/Logo.jpg",
    },
    {
      id: 2,
      name: "Spaghetti Carbonara",
      description: "Pasta with creamy egg sauce, pancetta, and parmesan.",
      price: 14.99,
      category: "Pasta",
      image: "/Logo.jpg",
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan, and Caesar dressing.",
      price: 8.99,
      category: "Salad",
      image: "/Logo.jpg",
    },
    {
      id: 4,
      name: "Grilled Salmon",
      description:
        "Fresh salmon fillet grilled to perfection, served with veggies.",
      price: 18.99,
      category: "Seafood",
      image: "/Logo.jpg",
    },
    {
      id: 5,
      name: "Tiramisu",
      description:
        "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
      price: 6.99,
      category: "Dessert",
      image: "/Logo.jpg",
    },
  ];

  return (
    <div className="animate-fadeIn p-6 rounded-lg max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Menu Items</h2>
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
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
