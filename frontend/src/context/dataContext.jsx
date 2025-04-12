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
  const addToCart = (item, selectedIngredients = [], customizations = "") => {
    setCartItems((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItemIndex >= 0) {
        // If exists, increment quantity AND ingredients
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
          // Scale up ingredients by adding them again
          selectedIngredients: [
            ...updatedCart[existingItemIndex].selectedIngredients,
            ...selectedIngredients,
          ],
        };
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            selectedIngredients,
            customizations,
          },
        ];
      }
    });
  };

  // Decrease item quantity (and remove corresponding ingredients)
  const CartDecrement = (itemId) => {
    setCartItems((prevCart) =>
      prevCart
        .map((cartItem) => {
          if (cartItem._id === itemId) {
            // Get the ingredients for one portion
            const ingredientsPerPortion = cartItem.selectedIngredients.slice(
              0,
              cartItem.selectedIngredients.length / cartItem.quantity
            );

            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              // Remove one portion's worth of ingredients
              selectedIngredients: cartItem.selectedIngredients.slice(
                0,
                cartItem.selectedIngredients.length -
                  ingredientsPerPortion.length
              ),
            };
          }
          return cartItem;
        })
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

  // Prepare order data in the required format
  const prepareOrderData = (customerInfo) => {
    return {
      ...customerInfo,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        // Group ingredients by name and count
        selectedIngredients: item.selectedIngredients.reduce((acc, ing) => {
          const existing = acc.find((i) => i.name === ing.name);
          if (existing) {
            existing.quantity++;
          } else {
            acc.push({ ...ing, quantity: 1 });
          }
          return acc;
        }, []),
        customizations: item.customizations || "",
      })),
      paymentStatus: "Pending",
      orderStatus: "Preparing",
    };
  };

  // Calculate cart total (ingredients included)
  const cartTotal = cartItems.reduce((total, item) => {
    const ingredientsTotal =
      item.selectedIngredients?.reduce((sum, ing) => sum + ing.price, 0) || 0;
    return (
      total + (item.price + ingredientsTotal / item.quantity) * item.quantity
    );
  }, 0);

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
        prepareOrderData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
