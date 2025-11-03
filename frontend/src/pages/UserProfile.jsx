// Archivo: ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, CreditCard, ShoppingBag, DollarSign, Package, Calendar, Download } from 'lucide-react';

// --- Funciones de Utilidad (Placeholders) ---
// Reemplaza esta lógica con la tuya para determinar el color según el estado de la venta.
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completado':
      return 'bg-green-100 text-green-800';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Reemplaza esta función con tu lógica para generar y descargar un PDF.
const handleGeneratePDF = (venta) => {
  console.log('Generando PDF para la venta:', venta.codigo);
  alert(`Funcionalidad de PDF para la compra #${venta.codigo} no implementada.`);
};


// --- Componente Principal de la Página de Perfil ---
const ProfilePage = ({ cliente, ventas, onProfileUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    cedula: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga los datos del cliente en el formulario cuando se abre el modal
  useEffect(() => {
    if (cliente && editOpen) {
      setProfileForm({
        full_name: cliente.full_name || '',
        email: cliente.email || '',
        cedula: cliente.cedula || '',
        password: '',
        confirm_password: '',
      });
    }
  }, [cliente, editOpen]);

  const handleOpenEdit = () => {
    setError(null); // Limpia errores anteriores al abrir
    setEditOpen(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario para actualizar el perfil del usuario.
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación simple de contraseñas
    if (profileForm.password && profileForm.password !== profileForm.confirm_password) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    // Construye el objeto user_data con los campos del formulario
    const userData = {
      full_name: profileForm.full_name,
      email: profileForm.email,
      cedula: profileForm.cedula,
    };

    // Añade la contraseña solo si el usuario ha escrito una nueva
    if (profileForm.password) {
      userData.password = profileForm.password;
    }

    // Construye el payload final que se enviará a la API
    const payload = {
      user_id: cliente.id, // Asegúrate de que cliente.id exista
      user_data: userData,
    };

    try {
      // **IMPORTANTE**: Reemplaza '/api/user/update' con el endpoint real de tu API.
      const response = await fetch('/api/user/update', {
        method: 'PUT', // o 'PATCH'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'No se pudo actualizar el perfil.');
      }

      const updatedUserData = await response.json();

      // Notifica al componente padre sobre la actualización exitosa
      if (onProfileUpdate) {
        onProfileUpdate(updatedUserData);
      }

      alert('¡Perfil actualizado con éxito!');
      setEditOpen(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1: Información Personal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Información Personal</h2>
              </div>

              {cliente ? (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button
                      onClick={handleOpenEdit}
                      className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                    >
                      ✏️ Editar perfil
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre completo</p>
                      <p className="font-semibold text-gray-900">{cliente.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Correo electrónico</p>
                      <p className="font-semibold text-gray-900">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Cédula</p>
                      <p className="font-semibold text-gray-900">{cliente.cedula}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-indigo-600">{ventas.length}</p>
                        <p className="text-sm text-gray-600">Compras</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          ${ventas.reduce((sum, v) => sum + v.total, 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total gastado</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay datos de usuario disponibles</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Columna 2: Historial de Compras */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-8">
                <ShoppingBag className="w-8 h-8 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">Historial de Compras</h2>
              </div>

              {ventas.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay compras registradas</h3>
                  <p className="text-gray-600 mb-8">Cuando realices tu primera compra, aparecerá aquí.</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/products" className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                      <span>Explorar Productos</span>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {ventas.map((venta, index) => (
                      <motion.div
                        key={venta.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-gray-900">Compra #{venta.codigo}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(venta.estado)}`}>
                                {venta.estado}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(venta.fecha_creacion).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-indigo-600">${venta.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Total</p>
                            </div>
                            <motion.button
                              onClick={() => handleGeneratePDF(venta)}
                              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Download className="w-4 h-4" />
                              <span>PDF</span>
                            </motion.button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Package className="w-5 h-5" />
                            <span>Productos ({venta.detalles.length})</span>
                          </h4>
                          <div className="grid gap-3">
                            {venta.detalles.map((detalle) => (
                              <div key={detalle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{detalle.variante.producto.nombre}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <span>Talla: {detalle.variante.talla}</span>
                                    <span>Color: {detalle.variante.color}</span>
                                    <span>Cantidad: {detalle.cantidad}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">${detalle.precio_unitario.toFixed(2)}</p>
                                  <p className="text-sm text-gray-500">c/u</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal de Edición de Perfil */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">✏️ Editar Perfil</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input name="full_name" value={profileForm.full_name} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cédula</label>
                <input name="cedula" value={profileForm.cedula} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva contraseña (opcional)</label>
                <input name="password" type="password" placeholder="Dejar en blanco para no cambiar" value={profileForm.password} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                <input name="confirm_password" type="password" placeholder="Repetir la nueva contraseña" value={profileForm.confirm_password} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;