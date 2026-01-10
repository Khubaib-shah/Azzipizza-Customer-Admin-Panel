import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import Context from "../context/dataContext";
import OrderModal from "../components/Modal/OrderModel";

function Cart() {
  const { cartItems, addToCart, removeFromCart, CartDecrement } =
    useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (item, action) => {
    if (action === "increase") {
      addToCart(item, item.selectedIngredients, item.customizations);
    } else if (action === "decrease" && item.quantity > 1) {
      CartDecrement(item);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in relative z-10">
      <div className="flex items-center gap-4 mb-10 border-b border-[var(--color-accent)] pb-4">
        <div className="bg-[var(--color-cream)] p-3 rounded-full">
          <ShoppingBag size={32} className="text-[var(--color-primary)]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] font-['Playfair_Display']">
          Your Cart
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border-2 border-dashed border-[var(--color-accent)] animate-scale-in glass">
          <div className="mx-auto w-28 h-28 bg-[var(--color-cream)] rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-sm)] animate-float">
            <ShoppingBag size={48} className="text-[var(--color-accent)]" />
          </div>
          <p className="text-2xl text-[var(--color-text)] font-['Playfair_Display'] mb-2 font-semibold">
            Your cart is currently empty
          </p>
          <p className="text-[var(--color-text-light)] mb-8 font-['Poppins'] max-w-md mx-auto">
            Looks like you haven't made your choice yet. Browse our delicious menu and find something you love.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const uniqueKey = `${item._id}-${JSON.stringify(
                item.selectedIngredients.map((ing) => ing.name).sort()
              )}-${item.customizations || ""}`;
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={uniqueKey}
                  className="card-premium p-6 flex flex-col sm:flex-row gap-6 relative group bg-white"
                >
                  <div className="w-full sm:w-36 h-36 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)] shadow-sm relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-[var(--color-basil)] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        {item.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--color-text)] leading-tight">
                          {item.name}
                        </h3>
                        <div className="text-right flex flex-col items-end">
                          <p className="font-['Playfair_Display'] font-bold text-xl text-[var(--color-primary)]">
                            €{itemTotal.toFixed(2)}
                          </p>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <p className="text-sm text-[var(--color-text-lighter)] line-through">
                                €{(item.originalPrice * item.quantity).toFixed(2)}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="text-sm text-[var(--color-text-light)] font-['Poppins'] mb-3 flex items-center gap-2">
                        <span className="bg-[var(--color-background)] px-2 py-0.5 rounded text-xs border border-[var(--color-cream)]">
                          €{item.price.toFixed(2)} each
                        </span>
                      </div>

                      {item.selectedIngredients?.length > 0 && (
                        <div className="mt-3 p-3 bg-[var(--color-background)] rounded-[var(--radius-sm)] border border-[var(--color-cream)]">
                          <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Plus size={10} /> Extras
                          </p>
                          <ul className="space-y-1">
                            {item.selectedIngredients.map((ing, i) => (
                              <li key={i} className="flex justify-between text-sm text-[var(--color-text)]">
                                <span>{ing.name}</span>
                                <span className="font-medium text-[var(--color-accent-dark)]">
                                  +€{(ing.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
                      <div className="flex items-center bg-[var(--color-background)] rounded-full border border-[var(--color-cream)] p-1 shadow-inner">
                        <button
                          onClick={() => handleQuantityChange(item, "decrease")}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[var(--color-text)] shadow-sm"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-semibold text-[var(--color-text)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, "increase")}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm shadow-[var(--color-accent)]/30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-primary)]/5 text-sm font-medium group/delete"
                        aria-label="Remove item from cart"
                      >
                        <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="glass p-6 md:p-8 rounded-[var(--radius-lg)] sticky top-24 shadow-[var(--shadow-lg)] border-t-4 border-t-[var(--color-accent)] bg-white/90 backdrop-blur-sm">
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8 font-['Poppins']">
                <div className="flex justify-between text-[var(--color-text-light)]">
                  <span>Subtotal <span className="text-xs">({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span></span>
                  <span className="font-medium text-[var(--color-text)]">€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-light)]">
                  <span>Delivery</span>
                  <span className="font-medium text-[var(--color-basil)] flex items-center gap-1">
                    Free
                  </span>
                </div>
                <div className="decorative-line my-6 opacity-30"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-[var(--color-text)]">Total</span>
                  <span className="font-['Playfair_Display'] font-bold text-3xl text-[var(--color-primary)] drop-shadow-sm">
                    €{cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-light)] italic">
                  *Taxes included where applicable
                </p>
              </div>

              <button
                onClick={openModal}
                className="btn-primary w-full flex items-center justify-center gap-3 group py-4 text-lg"
              >
                <span>Proceed to Checkout</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                </div>
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder icons for payment methods could go here */}
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        totalPrice={cartTotal}
        cartItems={cartItems}
      />
    </div>
  );
}

export default Cart;
