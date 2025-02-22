import React from "react";
import BtnViaWhatsapp from "./BtnVIaWhatsapp";

const CartSummary = ({ total, cartItems }) => {
  const buildWhatsappMessage = () => {
    let total = 0;
    let message = "Hola, quiero comprar los siguientes productos:%0A";
    cartItems.forEach(item => {
      message += `- ${item.name} (Cantidad: ${item.quantity})%0A  Subtotal: $${(item.price * item.quantity).toFixed(2)}%0A`;
      total += item.price * item.quantity;
    });

    message += `El total es: ${total.toFixed(2)}`;
    return message;
  };

  const whatsappLink = `https://wa.me/584247347724?text=${buildWhatsappMessage()}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mt-6">
      <h3 className="text-xl font-bold mb-3">Cart totals</h3>
      <div className="border-t pt-3">
        <p className="flex justify-between">
          <span>Subtotal</span> 
          <span className="font-semibold">${total.toFixed(2)}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>Total</span> 
          <span>${total.toFixed(2)}</span>
        </p>
      </div>
      <BtnViaWhatsapp whatsappLink={whatsappLink} />
    </div>
  );
};

export default CartSummary;
