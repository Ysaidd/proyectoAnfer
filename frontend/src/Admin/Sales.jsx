import { useState, useEffect } from "react";
import CreateSale from "./CreateSale";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para indicar carga
  const [error, setError] = useState(null);   // Nuevo estado para errores

  const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API
  // Función para cargar las ventas desde la API
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

  // Cargar ventas al montar el componente (y cada vez que se necesite refrescar)
  useEffect(() => {
    fetchSales();
  }, []); // El array vacío significa que se ejecuta solo una vez al montar

  const addSale = (newSale) => {
    // Al añadir una nueva venta, la agregamos al estado y luego refrescamos la lista completa
    // para asegurarnos de que todo esté sincronizado (incluyendo IDs generados por backend, etc.)
    // Opcionalmente, podrías solo agregar newSale al estado y hacer un fetch más tarde si el ID es crucial.
    // Para simplificar, haremos un fetch completo aquí para asegurar la consistencia.
    fetchSales();
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    // Asegurarse de que la fecha sea válida antes de formatear
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Función para actualizar el estado de una venta (CONFIRMAR/CANCELAR)
  const handleUpdateSaleStatus = async (saleCode, newStatus) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${newStatus} la venta con código ${saleCode}?`)) {
      return; // El usuario canceló
    }

    try {
      const response = await fetch(`${API_URL}/sales/${saleCode}/status`, {
        method: 'PATCH', // Usamos PATCH según tu backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Mostrar el mensaje de error que viene del backend
        throw new Error(errorData.detail || `Error al actualizar la venta: ${response.status}`);
      }

      // Si la actualización fue exitosa, volvemos a cargar las ventas
      // para que la UI se actualice con el nuevo estado
      alert(`✅ Venta ${saleCode} actualizada a '${newStatus}' correctamente.`);
      fetchSales(); // Vuelve a cargar todas las ventas para reflejar el cambio

    } catch (err) {
      console.error(`Error al actualizar la venta ${saleCode} a ${newStatus}:`, err);
      alert(`❌ Error al actualizar la venta: ${err.message}`);
    }
  };

  const generatePDF = async (saleId) => {
    try {
      const response = await fetch(`${API_URL}/orders/orders/${saleId}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
          const errorText = await response.text(); // Leer el cuerpo de la respuesta de error
          throw new Error(`Error al generar PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `venta_${saleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert("PDF generado y descargado con éxito.");
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert(`❌ Error descargando PDF: ${error.message}`);
    }
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
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-gray-200">Venta #</th>
                  <th className="py-3 px-6 border-b border-gray-200">Cliente CD</th>
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
                        <button
                            onClick={() => generatePDF(sale.id)}
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