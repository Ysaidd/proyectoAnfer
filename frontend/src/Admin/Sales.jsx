// Archivo: Sales.jsx

import { useState, useEffect } from "react";
import CreateSale from "./CreateSale";
// --- ¡NUEVO! Importar las bibliotecas para generar PDF ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CAMBIO AQUÍ: Importamos la función

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/sales`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSales(data);
    } catch (err) {
      console.error("Error cargando ventas:", err);
      setError("No se pudieron cargar las ventas. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const addSale = () => {
    fetchSales();
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + " " + date.toLocaleTimeString('es-ES');
  };

  const handleUpdateSaleStatus = async (saleCode, newStatus) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${newStatus} la venta con código ${saleCode}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sales/${saleCode}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error al actualizar la venta: ${response.status}`);
      }
      
      alert(`✅ Venta ${saleCode} actualizada a '${newStatus}' correctamente.`);
      fetchSales();

    } catch (err) {
      console.error(`Error al actualizar la venta ${saleCode} a ${newStatus}:`, err);
      alert(`❌ Error al actualizar la venta: ${err.message}`);
    }
  };

  // --- ¡FUNCIÓN generatePDF ACTUALIZADA! ---
  // Ahora recibe el objeto 'sale' completo en lugar del 'saleId'
  const generatePDF = (sale) => {
    // 1. Crear una nueva instancia de jsPDF
    const doc = new jsPDF();

    // 2. Definir el contenido del PDF
    // Título
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`Recibo de Venta: #${sale.codigo}`, 14, 22);

    // Información general de la venta
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente ID: ${sale.cliente_id}`, 14, 35);
    doc.text(`Fecha: ${formatDate(sale.fecha_creacion)}`, 14, 42);
    doc.text(`Estado: ${sale.estado.charAt(0).toUpperCase() + sale.estado.slice(1)}`, 14, 49);

    // 3. Preparar los datos para la tabla de productos
    const tableColumn = ["Producto (Variante ID)", "Cantidad", "Precio Unitario", "Subtotal"];
    const tableRows = [];

    sale.detalles.forEach(item => {
      const subtotal = (item.cantidad * (item.precio_unitario || 0)).toFixed(2);
      const itemData = [
        item.variante_id,
        item.cantidad,
        `$${(item.precio_unitario || 0).toFixed(2)}`,
        `$${subtotal}`
      ];
      tableRows.push(itemData);
    });

    // 4. Añadir la tabla al documento usando autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60, // Posición vertical donde empieza la tabla
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Color del encabezado (opcional)
    });

    // 5. Añadir el total al final
    const finalY = doc.lastAutoTable.finalY; // Obtenemos la posición final de la tabla
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${(sale.total || 0).toFixed(2)}`, 14, finalY + 15);

    // 6. Guardar el PDF con un nombre de archivo dinámico
    doc.save(`venta_${sale.codigo}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">💰 Gestión de Ventas</h1>
      <p className="text-gray-600 mb-4">Registro y control de todas las transacciones de venta.</p>

      <CreateSale onAddSale={addSale} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">📋 Listado de Ventas</h2>
        {loading && <div className="text-center p-4 text-blue-600">Cargando ventas...</div>}
        {error && <div className="text-center p-4 text-red-600">{error}</div>}
        {!loading && !error && sales.length === 0 ? (
          <div className="text-center p-4 text-gray-600">No hay ventas registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              {/* ... Thead sin cambios ... */}
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-gray-200">Venta #</th>
                  <th className="py-3 px-6 border-b border-gray-200">Cliente ID</th>
                  <th className="py-3 px-6 border-b border-gray-200">Fecha</th>
                  <th className="py-3 px-6 border-b border-gray-200">Estado</th>
                  <th className="py-3 px-6 border-b border-gray-200">Código</th>
                  <th className="py-3 px-6 border-b border-gray-200">Productos (Detalles)</th>
                  <th className="py-3 px-6 border-b border-gray-200">Total</th>
                  <th className="py-3 px-6 border-b border-gray-200 text-center">Acciones</th>
                  <th className="py-3 px-6 border-b border-gray-200 text-center">PDF</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{sale.id}</td>
                    <td className="py-3 px-6 text-left">{sale.cliente_id}</td>
                    <td className="py-3 px-6 text-left">{formatDate(sale.fecha_creacion)}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sale.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                        sale.estado === 'confirmada' ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {sale.estado.charAt(0).toUpperCase() + sale.estado.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{sale.codigo}</td>
                    <td className="py-3 px-6 text-left">
                      <ul className="list-disc pl-5">
                        {sale.detalles?.length > 0 ? (
                          sale.detalles.map((item, index) => (
                            <li key={item.id || index}>
                              Variante ID: <strong>{item.variante_id}</strong>
                              <br />
                              Cantidad: {item.cantidad} x ${item.precio_unitario?.toFixed(2) || 'N/A'}
                              <br />
                              <strong>Subtotal: ${(item.cantidad * (item.precio_unitario || 0)).toFixed(2)}</strong>
                            </li>
                          ))
                        ) : (
                          <li>No hay detalles de productos para esta venta.</li>
                        )}
                      </ul>
                    </td>
                    <td className="py-3 px-6 text-left font-bold text-green-600">
                      ${sale.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {sale.estado === 'pendiente' && (
                        <div className="flex item-center justify-center space-x-2">
                          <button
                            onClick={() => handleUpdateSaleStatus(sale.codigo, 'confirmada')}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-xs transition-colors duration-200"
                            title="Confirmar Venta"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleUpdateSaleStatus(sale.codigo, 'cancelada')}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs transition-colors duration-200"
                            title="Cancelar Venta"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      {sale.estado !== 'pendiente' && (
                        <span className="text-gray-500 text-xs">No hay acciones</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {/* --- ¡CAMBIO IMPORTANTE! Pasamos el objeto 'sale' completo --- */}
                        <button
                            onClick={() => generatePDF(sale)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                            title="Descargar PDF de la Venta"
                        >
                            📄 PDF
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;