import React, { useState } from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";


const CartComponent = () => {
  const [cartItems, setCartItems]= useState([
    {
      id: 1,
      name: "Calzado Dama Style D-7545-2 - 38, Beige",
      price: 30.00,
      quantity: 1,
      image: "/images/prueba.jpg",
    },
    {
      id: 2,
      name: "Calzado Dama Style D-7545-2 - 36, Beige",
      price: 30.00,
      quantity: 1,
      image: "/images/prueba.jpg",
    },
    {
      id: 3,
      name: "Calzado Dama Style D-7545-2 - 36, Beige",
      price: 30.00,
      quantity: 1,
      image: "/images/prueba.jpg",
    },
    
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CartList cartItems={cartItems} updateQuantity={updateQuantity} />
      <CartSummary total={total} />
    </div>
  );
};

export default CartComponent;
