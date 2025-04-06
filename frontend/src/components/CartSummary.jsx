import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartSummary = () => {
  const { cartItems, clearCart } = useCart();
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerPhone.trim()) {
      setMessage({ type: "error", text: "📞 Ingresa un número de teléfono válido." });
      return;
    }
    if (cartItems.length === 0) {
      setMessage({ type: "error", text: "🛒 El carrito está vacío." });
      return;
    }
  
    const saleData = {
      customer_phone: "123456789",
      items: cartItems.map((item) => ({
        variant_id: item.variant_id,  // Usar el ID correcto
        quantity: item.quantity
      }))
    };
  
    console.log("📤 Enviando orden:", saleData ); // 📌 Verificar datos antes de enviar
  
    if (saleData.items.some(item => item.variant_id === null || isNaN(item.variant_id))) {
      setMessage({ type: "error", text: "❌ Error: Producto sin ID válido." });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
  
      const responseData = await response.json();
      console.log("📥 Respuesta API:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.detail || "No se pudo completar la compra.");
      }
  
      setMessage({ type: "success", text: `✅ Compra realizada con éxito.` });
  
      clearCart();
      setCustomerPhone("");
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage({ type: "error", text: error.message });
    }
  };
  
  

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mt-6">
      <h3 className="text-xl font-bold mb-3">🛍️ Resumen de Compra</h3>

      <p className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </p>
      <p className="flex justify-between font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </p>

      <input
        type="text"
        placeholder="📞 Teléfono del Cliente"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mt-4"
      />

      {message && (
        <div className={`mt-3 p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "⏳ Procesando..." : "✅ Confirmar Compra"}
      </button>
    </div>
  );
};

export default CartSummary;
