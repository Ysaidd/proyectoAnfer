import React from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { useCart } from "../context/CartContext";

const CartComponent = () => {
  const { cartItems, updateQuantity } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 h-[80vh]">
      <CartList cartItems={cartItems} updateQuantity={updateQuantity} />
      <CartSummary total={total} cartItems={cartItems} />
    </div>
  );
};

export default CartComponent;
