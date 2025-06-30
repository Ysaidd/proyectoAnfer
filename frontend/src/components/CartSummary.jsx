import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

const CartSummary = () => {
  const { cartItems, clearCart } = useCart();
  const { cedula, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.precio || 0) * (item.quantity || 0),
    0
  );

  const handleCheckout = async () => {
    if (!cedula) {
      setMessage({ type: "error", text: "Debes iniciar sesión para comprar" });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ type: "error", text: "El carrito está vacío." });
      return;
    }

    const saleData = {
      cedula_cliente: cedula,
      estado: "pendiente",
      detalles: cartItems.map((item) => ({
        variante_id: Number(item.variant_id),
        cantidad: Number(item.quantity),
        precio_unitario: Number(item.precio),
      })),
    };

    try {
      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem('access_token');
      const response = await fetch("http://localhost:8000/sales/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(saleData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || "Error al procesar la compra");
      }

      const orden = {
        codigo: responseData.codigo,
        fecha: new Date().toLocaleString(),
        productos: cartItems,
        total,
        cliente: userData?.nombre || "Cliente",
        direccion: userData?.direccion || "No especificada"
      };

      setOrderData(orden);
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      setMessage({
        type: "error",
        text: `${error.message || "Error al procesar la compra"}`
      });
    } finally {
      setLoading(false);
    }
  };

 const handleGeneratePDF = async () => {
  if (!orderData) return;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = 680;

  const drawText = (text, x = 50, size = fontSize) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    y -= size + 6;
  };

  drawText("TIENDA ANFER", 50, 18);
  drawText(`Fecha: ${orderData.fecha}`);
  drawText(`Código: #${orderData.codigo}`);
  drawText(`Cédula: ${cedula}`); // 👈 Aquí se agrega
  drawText(`Dirección: ${orderData.direccion}`);

  drawText("--------------------------------------------------");
  drawText("Producto         Cant   P.Unit   Total");

  orderData.productos.forEach(item => {
    const nombre = item.nombre?.substring(0, 15).padEnd(15);
    const cantidad = String(item.quantity).padEnd(5);
    const precio = `$${item.precio.toFixed(2)}`.padEnd(8);
    const totalItem = `$${(item.precio * item.quantity).toFixed(2)}`;
    drawText(`${nombre} ${cantidad} ${precio} ${totalItem}`);
  });

  drawText("--------------------------------------------------");
  drawText(`TOTAL: $${orderData.total.toFixed(2)}`, 50, 14);
  drawText("Gracias por su compra.");
  drawText("Presentar este recibo para cambios.");

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `Recibo_${orderData.codigo}.pdf`, "application/pdf");
};


  return (
    <div className="bg-white shadow-md rounded-lg p-5 mt-6">
      <h3 className="text-xl font-bold mb-3">Resumen de Compra</h3>

      <div className="space-y-2 mb-4">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </p>
        <p className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </p>
      </div>

      {message && (
        <div className={`mt-3 p-3 rounded-md ${
          message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className={`w-full py-3 px-4 rounded-md mt-4 font-medium transition-colors ${
          loading || cartItems.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          "Confirmar Compra"
        )}
      </button>

      {showSuccessModal && orderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-2">¡Compra realizada con éxito!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Código de orden: <span className="font-bold">{orderData.codigo}</span>
              </p>
            </div>

            <div className="mt-4 flex justify-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setShowSuccessModal(false)}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleGeneratePDF}
              >
                Descargar Recibo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
