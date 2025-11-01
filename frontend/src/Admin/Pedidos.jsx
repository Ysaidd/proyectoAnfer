import { useState, useEffect } from "react";
import CreateOrder from "./CreateOrder"; // Asegúrate de que la ruta de importación sea correcta

const Pedidos = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); // Para almacenar el pedido que se está editando

  // Función para cargar los pedidos desde la API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/pedidos/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("No se pudieron cargar los pedidos. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrUpdateOrder = () => {
    fetchOrders(); // Refrescar la lista completa después de crear o actualizar
    setShowForm(false); // Cerrar el formulario
    setEditingOrder(null); // Limpiar el pedido en edición
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Función para actualizar el estado de un pedido (CONFIRMADO/CANCELADO)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    let confirmationMessage = "";
    if (newStatus === "confirmado") {
      confirmationMessage = "¿Estás seguro de que deseas CONFIRMAR este pedido? Esto aumentará el stock de los productos.";
    } else if (newStatus === "cancelado") {
      confirmationMessage = "¿Estás seguro de que deseas CANCELAR este pedido? No se modificará el stock.";
    }

    if (!window.confirm(confirmationMessage)) {
      return; // El usuario canceló
    }

    try {
      const response = await fetch(`${API_URL}/pedidos/${orderId}/estado`, {
        method: 'PATCH', // Usamos PATCH para actualizar parcialmente (solo el estado)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error al actualizar el pedido: ${response.status}`);
      }

      alert(`✅ Pedido ${orderId} actualizado a '${newStatus}' correctamente.`);
      fetchOrders(); // Vuelve a cargar todos los pedidos para reflejar el cambio y el stock
    } catch (err) {
      console.error(`Error al actualizar el pedido ${orderId} a ${newStatus}:`, err);
      alert(`❌ Error al actualizar el pedido: ${err.message}`);
    }
  };

  // Función para eliminar un pedido
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR este pedido? Solo se pueden eliminar pedidos pendientes.")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pedidos/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error al eliminar el pedido: ${response.status}`);
      }

      alert(`✅ Pedido ${orderId} eliminado correctamente.`);
      fetchOrders(); // Refrescar la lista
    } catch (err) {
      console.error(`Error al eliminar el pedido ${orderId}:`, err);
      alert(`❌ Error al eliminar el pedido: ${err.message}`);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">🚚 Gestión de Pedidos a Proveedores</h1>
      <p className="text-gray-600 mb-4">Crea, visualiza y gestiona los pedidos realizados a tus proveedores para reponer stock.</p>

      <button
        onClick={() => {
          setEditingOrder(null); // Asegura que es un nuevo pedido
          setShowForm(true);
        }}
        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out mb-6"
      >
        ➕ Nuevo Pedido
      </button>

      {showForm && (
        <CreateOrder
          onAddOrder={handleAddOrUpdateOrder}
          initialOrder={editingOrder}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">📋 Listado de Pedidos</h2>
        {loading && <div className="text-center p-4 text-blue-600">Cargando pedidos...</div>}
        {error && <div className="text-center p-4 text-red-600">{error}</div>}
        {!loading && !error && orders.length === 0 ? (
          <div className="text-center p-4 text-gray-600">No hay pedidos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-gray-200">Pedido #</th>
                  <th className="py-3 px-6 border-b border-gray-200">Proveedor</th>
                  <th className="py-3 px-6 border-b border-gray-200">Fecha</th>
                  <th className="py-3 px-6 border-b border-gray-200">Estado</th>
                  <th className="py-3 px-6 border-b border-gray-200">Detalles de Productos</th>
                  <th className="py-3 px-6 border-b border-gray-200">Total Estimado</th>
                  <th className="py-3 px-6 border-b border-gray-200 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                    <td className="py-3 px-6 text-left">{order.proveedor?.nombre || 'Proveedor Desconocido'}</td>
                    <td className="py-3 px-6 text-left">{formatDate(order.fecha)}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                        order.estado === 'confirmado' ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <ul className="list-disc pl-5">
                        {order.detalles?.length > 0 ? (
                          order.detalles.map((item, index) => (
                            <li key={item.id || index}>
                              {item.variante?.producto?.nombre || 'Producto Desconocido'} (
                              {item.variante?.talla || 'N/A'}, {item.variante?.color || 'N/A'})
                              <br />
                              Cant: {item.cantidad} x ${item.precio_unitario?.toFixed(2) || 'N/A'}
                              <br />
                              <strong>Subtotal: ${(item.cantidad * (item.precio_unitario || 0)).toFixed(2)}</strong>
                            </li>
                          ))
                        ) : (
                          <li>No hay detalles de productos para este pedido.</li>
                        )}
                      </ul>
                    </td>
                    <td className="py-3 px-6 text-left font-bold text-purple-600">
                      ${
                        order.detalles?.reduce((sum, item) => sum + (item.cantidad * (item.precio_unitario || 0)), 0).toFixed(2)
                        || '0.00'
                      }
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {order.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => {
                                setEditingOrder(order);
                                setShowForm(true);
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs transition-colors duration-200"
                              title="Editar Pedido"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'confirmado')}
                              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-xs transition-colors duration-200"
                              title="Marcar como Recibido (Confirmar)"
                            >
                              ✅ Recibido
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelado')}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs transition-colors duration-200"
                              title="Cancelar Pedido"
                            >
                              ❌ Cancelar
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-xs transition-colors duration-200"
                              title="Eliminar Pedido"
                            >
                              🗑️ Eliminar
                            </button>
                          </>
                        )}
                        {order.estado !== 'pendiente' && (
                          <span className="text-gray-500 text-xs">Sin acciones disponibles</span>
                        )}
                      </div>
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

export default Pedidos;