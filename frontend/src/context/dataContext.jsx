import { createContext, useState, useEffect } from "react";
import { baseUri } from "../config/config";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await baseUri.get("/api/menu");
      setItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError(error.message || "Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, selectedIngredients = [], customizations = "") => {
    setCartItems((prevCart) => {
      const ingredientsKey = JSON.stringify(
        [...selectedIngredients].sort((a, b) => a.name.localeCompare(b.name))
      );

      const existingItemIndex = prevCart.findIndex((cartItem) => {
        const existingIngredientsKey = JSON.stringify(
          [...cartItem.selectedIngredients].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        return (
          cartItem._id === item._id &&
          existingIngredientsKey === ingredientsKey &&
          cartItem.customizations === customizations
        );
      });

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
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

  const CartDecrement = (itemId) => {
    setCartItems((prevCart) =>
      prevCart
        .map((cartItem) => {
          if (cartItem._id === itemId) {
            const ingredientsPerPortion = cartItem.selectedIngredients.slice(
              0,
              cartItem.selectedIngredients.length / cartItem.quantity
            );

            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
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

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const prepareOrderData = (customerInfo) => {
    return {
      ...customerInfo,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,

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

  const cartTotal = cartItems.reduce((total, item) => {
    const discountedPrice =
      item.price - (item.discount ? (item.price * item.discount) / 100 : 0);

    const ingredientsTotal =
      item.selectedIngredients?.reduce((sum, ing) => sum + ing.price, 0) || 0;

    return total + (discountedPrice + ingredientsTotal) * item.quantity;
  }, 0);

  const refreshMenu = async () => {
    await fetchMenu();
  };

  return (
    <Context.Provider
      value={{
        items,
        cartItems,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        CartDecrement,
        clearCart,
        cartTotal,
        prepareOrderData,
        refreshMenu,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
