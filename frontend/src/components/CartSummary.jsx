import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartSummary = () => {
  const { cartItems, clearCart } = useCart();
  const { cedula } = useAuth(); // Corregido: useAuth es una función que debe ser invocada
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage({ type: "error", text: "🛒 El carrito está vacío." });
      return;
    }
  
    const saleData = {
      cedula_cliente: cedula,
      estado: "pendiente",
      detalles: cartItems.map((item) => ({
        variante_id: item.variant_id,
        cantidad: item.quantity,
        precio_unitario: item.precio // Añadido el precio unitario requerido
      }))
    };
  
    console.log("📤 Enviando orden:", saleData);
  
    if (saleData.detalles.some(item => item.variante_id === null || isNaN(item.variante_id))) {
      setMessage({ type: "error", text: "❌ Error: Producto sin ID válido." });
      return;
    }
  
    try {
      setLoading(true);
      setMessage(null);
      
      const response = await fetch("http://localhost:8000/sales/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}` // Asegúrate de incluir el token si es necesario
        },
        body: JSON.stringify(saleData),
      });
  
      const responseData = await response.json();
      console.log("📥 Respuesta API:", responseData);
  
      if (!response.ok) {
        // Mejor manejo de errores para mostrar detalles específicos
        const errorMsg = Array.isArray(responseData.detail) 
          ? responseData.detail.map(err => err.msg).join(', ')
          : responseData.detail || "No se pudo completar la compra";
        throw new Error(errorMsg);
      }
  
      setMessage({ type: "success", text: `✅ Compra realizada con éxito.` });
      clearCart();
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage({ 
        type: "error", 
        text: `Error: ${error.message}` 
      });
    } finally {
      setLoading(false);
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

      {message && (
        <div className={`mt-3 p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "⏳ Procesando..." : "✅ Confirmar Compra"}
      </button>
    </div>
  );
};

export default CartSummary;