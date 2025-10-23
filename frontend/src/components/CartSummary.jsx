import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

const CartSummary = ({ total, cartItems }) => {
  const { clearCart } = useCart();
  const { cedula, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

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
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <div className="flex items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="text-2xl mr-3">💰</span>
          Resumen de Compra
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-lg">${total.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
          loading || cartItems.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl"
        }`}
        whileHover={!loading && cartItems.length > 0 ? { scale: 1.02 } : {}}
        whileTap={!loading && cartItems.length > 0 ? { scale: 0.98 } : {}}
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
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Confirmar Compra
          </span>
        )}
      </motion.button>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && orderData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Compra realizada con éxito!</h3>
                <p className="text-gray-600">
                  Código de orden: <span className="font-bold text-indigo-600">{orderData.codigo}</span>
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <motion.button
                  type="button"
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                  onClick={handleGeneratePDF}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Recibo
                  </span>
                </motion.button>
                
                <motion.button
                  type="button"
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
                  onClick={() => setShowSuccessModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartSummary;
