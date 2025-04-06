import React from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { useCart } from "../context/CartContext";

const CartComponent = () => {
  const { cartItems, confirmation } = useCart();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[80vh] relative">
      {/* ✅ Mensaje de confirmación */}
      {confirmation && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {confirmation}
        </div>
      )}
      <CartList cartItems={cartItems} />
      <CartSummary total={total} cartItems={cartItems} />
    </div>
  );
};

export default CartComponent;
