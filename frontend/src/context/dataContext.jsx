import { createContext, useState, useEffect } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Menu Items
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  ); // Cart Items

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/menu");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add item to cart
  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );
      return existingItem
        ? prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];
    });
  };
  const CartDecrement = (item) => {
    setCartItems((prevCart) => {
      return prevCart
        .map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  return (
    <Context.Provider
      value={{
        items,
        cartItems,
        addToCart,
        removeFromCart,
        // placeOrder,
        CartDecrement,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
