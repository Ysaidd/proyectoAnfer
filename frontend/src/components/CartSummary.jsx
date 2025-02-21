import React from "react";
import BtnViaWhatsapp from "./BtnVIaWhatsapp";

const CartSummary = ({ total }) => {
  
  
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
        <BtnViaWhatsapp whatsappLink="https://wa.me/573204518163?text=Hola,%20quiero%20comprar%20los%20siguientes%20productos:%20"/>
    </div>
  );
};

export default CartSummary;
