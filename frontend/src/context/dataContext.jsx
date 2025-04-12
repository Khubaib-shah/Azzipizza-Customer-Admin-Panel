import { createContext, useState, useEffect } from "react";
import { baseUri } from "../config/config";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const fetchMenu = async () => {
    try {
      const { data } = await baseUri.get("/api/menu");
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

  // Add item to cart with selected ingredients
  const addToCart = (item, selectedIngredients = []) => {
    setCartItems((prevCart) => {
      // Check if the same item with the same ingredients already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem._id === item._id &&
          JSON.stringify(cartItem.selectedIngredients) ===
            JSON.stringify(selectedIngredients)
      );

      if (existingItemIndex >= 0) {
        // If exists, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // If new, add to cart with ingredients
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            selectedIngredients,
            totalPrice: calculateTotalPrice(item.price, selectedIngredients),
          },
        ];
      }
    });
  };

  // Calculate total price including ingredients
  const calculateTotalPrice = (basePrice, ingredients) => {
    const ingredientsTotal = ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.price || 0),
      0
    );
    return basePrice + ingredientsTotal;
  };

  // Decrease item quantity
  const CartDecrement = (itemId) => {
    setCartItems((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem._id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.totalPrice || item.price) * item.quantity,
    0
  );

  return (
    <Context.Provider
      value={{
        items,
        cartItems,
        addToCart,
        removeFromCart,
        CartDecrement,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
