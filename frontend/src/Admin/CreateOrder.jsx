import { useState, useEffect } from "react";

const CreateOrder = ({ onAddOrder, initialOrder, onClose }) => {
  // Estados principales del formulario de pedido
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(initialOrder?.proveedor?.id || ""); // O initialOrder?.proveedor_id
  const [orderStatus, setOrderStatus] = useState(initialOrder?.estado || "pendiente");
  const [selectedItems, setSelectedItems] = useState(initialOrder?.detalles?.map(detalle => ({
    variant_id: detalle.variante_id,
    product_name: detalle.variante?.producto?.nombre || 'Producto Desconocido', // Asume que la variante tiene un producto
    size: detalle.variante?.talla || 'N/A',
    color: detalle.variante?.color || 'N/A',
    quantity: detalle.cantidad,
    unit_price: detalle.precio_unitario,
    // No necesitamos stock_available para pedidos
  })) || []);

  // Estados para la búsqueda y selección de productos/variantes
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Cargar proveedores y productos al iniciar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Proveedores
        const proveedoresResponse = await fetch("http://localhost:8000/proveedores/"); // Tu ruta de API de proveedores
        if (!proveedoresResponse.ok) throw new Error(`Error al cargar proveedores: ${proveedoresResponse.status}`);
        const proveedoresData = await proveedoresResponse.json();
        setProveedores(proveedoresData);

        // Cargar Productos (con variantes)
        const productsResponse = await fetch("http://localhost:8000/products"); // Tu ruta de API de productos
        if (!productsResponse.ok) throw new Error(`Error al cargar productos: ${productsResponse.status}`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

      } catch (error) {
        console.error("Error cargando datos:", error);
        alert(`Error al cargar datos necesarios: ${error.message}`);
      }
    };
    fetchData();

    // Si estamos editando un pedido existente, precargamos los datos
    if (initialOrder) {
      setSelectedProveedor(initialOrder.proveedor_id);
      setOrderStatus(initialOrder.estado);
      setSelectedItems(initialOrder.detalles.map(detalle => ({
        // Asegúrate de que los detalles tengan la información de la variante anidada
        variant_id: detalle.variante_id,
        product_name: detalle.variante?.producto?.nombre || 'Producto Desconocido',
        size: detalle.variante?.talla || 'N/A',
        color: detalle.variante?.color || 'N/A',
        quantity: detalle.cantidad,
        unit_price: detalle.precio_unitario,
      })));
    }
  }, [initialOrder]);

  // Filtrar productos cuando cambia el término de búsqueda o la lista de productos
  useEffect(() => {
    if (search.trim()) {
      setFilteredProducts(
        products.filter((product) =>
          product.nombre.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [search, products]);

  // Manejar la selección de un producto del listado de búsqueda
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch("");
    setFilteredProducts([]);

    if (product.variantes && product.variantes.length > 0) {
      if (product.variantes.length === 1) {
        const variant = product.variantes[0];
        const newItem = {
          product_id: product.id,
          variant_id: variant.id,
          product_name: product.nombre,
          size: variant.talla,
          color: variant.color,
          quantity: 1, // Cantidad inicial para un pedido
          unit_price: product.precio, // Precio de compra, asumiendo el mismo que de venta por ahora
        };
        addItemToSelectedItems(newItem);
        setSelectedProduct(null);
      } else {
        setSelectedVariant(null); // Resetear variante si hay múltiples
      }
    } else {
      // Si el producto no tiene variantes
      const newItem = {
        product_id: product.id,
        variant_id: null,
        product_name: product.nombre,
        size: "N/A",
        color: "N/A",
        quantity: 1,
        unit_price: product.precio,
      };
      addItemToSelectedItems(newItem);
      setSelectedProduct(null);
    }
  };

  // Manejar la selección de una variante en el dropdown
  const handleVariantChange = (e) => {
    const variantId = parseInt(e.target.value);
    const variant = selectedProduct.variantes.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  // Función auxiliar para añadir un ítem a la lista de seleccionados y manejar duplicados
  const addItemToSelectedItems = (newItem) => {
    const existingItemIndex = selectedItems.findIndex(
      (item) => item.product_id === newItem.product_id && item.variant_id === newItem.variant_id
    );

    if (existingItemIndex > -1) {
      alert("Este producto/variante ya ha sido añadido a la lista del pedido.");
    } else {
      setSelectedItems((prevItems) => [...prevItems, newItem]);
    }
  };

  // Añadir el producto/variante seleccionado al "carrito" del pedido
  const handleAddProductToOrder = () => {
    if (!selectedProduct) return;

    if (selectedProduct.variantes && selectedProduct.variantes.length > 1 && !selectedVariant) {
      alert("Por favor, seleccione una variante antes de añadir.");
      return;
    }

    let itemToAddVariant = null;
    if (selectedProduct.variantes && selectedProduct.variantes.length === 1) {
      itemToAddVariant = selectedProduct.variantes[0];
    } else if (selectedVariant) {
      itemToAddVariant = selectedVariant;
    }

    const newItem = {
      product_id: selectedProduct.id,
      variant_id: itemToAddVariant?.id || null,
      product_name: selectedProduct.nombre,
      size: itemToAddVariant?.talla || "N/A",
      color: itemToAddVariant?.color || "N/A",
      quantity: 1, // Cantidad inicial de 1 para el pedido
      unit_price: selectedProduct.precio, // Precio de la variante o producto
    };

    addItemToSelectedItems(newItem);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Actualizar la cantidad de un ítem en el "carrito"
  const updateQuantity = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    const item = updatedItems[index];

    let quantityToSet = parseInt(newQuantity);
    if (isNaN(quantityToSet) || quantityToSet < 1) {
      quantityToSet = 1;
    }

    item.quantity = quantityToSet;
    setSelectedItems(updatedItems);
  };

  // Eliminar un ítem del "carrito"
  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // Calcular el total del pedido
  const total = selectedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  // Manejador principal para enviar el formulario del pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProveedor) {
      alert("Por favor, seleccione un proveedor.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Seleccione al menos un producto para registrar el pedido.");
      return;
    }

    const detallesParaAPI = selectedItems.map((item) => ({
      variante_id: item.variant_id,
      cantidad: item.quantity,
      precio_unitario: item.unit_price,
    }));

    const orderData = {
      proveedor_id: selectedProveedor,
      fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      estado: orderStatus,
      detalles: detallesParaAPI,
    };

    try {
      const method = initialOrder ? "PUT" : "POST";
      const url = initialOrder ? `http://localhost:8000/pedidos/${initialOrder.id}` : "http://localhost:8000/pedidos/";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        let errorMessage = `Error al ${initialOrder ? 'actualizar' : 'registrar'} el pedido: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorDetail);
          errorMessage = `Error al ${initialOrder ? 'actualizar' : 'registrar'} el pedido: ${errorJson.detail || JSON.stringify(errorJson)}`;
        } catch (parseError) {
          errorMessage += ` - ${errorDetail}`;
        }
        throw new Error(errorMessage);
      }

      const registeredOrder = await response.json();
      alert(`✅ Pedido ${initialOrder ? 'actualizado' : 'registrado'} con éxito.`);
      onAddOrder(registeredOrder); // O onUpdateOrder
      onClose(); // Cerrar el modal/formulario después de la operación exitosa

      // Resetear estados del formulario después de un registro exitoso (solo si es CREATE)
      if (!initialOrder) {
        setSelectedProveedor("");
        setSelectedItems([]);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setOrderStatus("pendiente");
        setSearch("");
      }

    } catch (error) {
      console.error(`Error al ${initialOrder ? 'actualizar' : 'registrar'} el pedido:`, error);
      alert(`❌ No se pudo ${initialOrder ? 'actualizar' : 'registrar'} el pedido. Detalles: ${error.message}`);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${initialOrder ? 'animate-fade-in' : ''}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          {initialOrder ? '✏️ Editar Pedido a Proveedor' : '➕ Registrar Nuevo Pedido a Proveedor'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Sección: Proveedor */}
          <div className="mb-4">
            <label htmlFor="proveedorSelect" className="block text-gray-700 text-sm font-bold mb-2">
              Proveedor:
            </label>
            <select
              id="proveedorSelect"
              value={selectedProveedor}
              onChange={(e) => setSelectedProveedor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={initialOrder && initialOrder.estado !== "pendiente"} // Deshabilitar si no está pendiente
            >
              <option value="">-- Selecciona un proveedor --</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre} ({prov.correo})
                </option>
              ))}
            </select>
          </div>

          {/* Sección: Estado del Pedido (editable solo en modo creación o pendiente) */}
          <div className="mb-4">
            <label htmlFor="orderStatus" className="block text-gray-700 text-sm font-bold mb-2">Estado del Pedido:</label>
            <select
              id="orderStatus"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={initialOrder && initialOrder.estado !== "pendiente"} // Solo editable si está pendiente
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Sección: Búsqueda y Selección de Productos (deshabilitar si no es pendiente) */}
          <div className={`mb-6 border-t pt-4 ${initialOrder && initialOrder.estado !== "pendiente" ? 'opacity-50 pointer-events-none' : ''}`}>
            <label htmlFor="productSearch" className="block text-gray-700 text-sm font-bold mb-2">Buscar Producto para Pedir:</label>
            <input
              id="productSearch"
              type="text"
              placeholder="🔍 Buscar producto por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
              disabled={initialOrder && initialOrder.estado !== "pendiente"}
            />

            {/* Resultados de la búsqueda */}
            {filteredProducts.length > 0 && (
              <ul className="bg-white border rounded shadow-md mt-2 max-h-40 overflow-y-auto z-10 relative">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="p-3 border-b hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-gray-900">{product.nombre}</strong> - ${product.precio.toFixed(2)}
                      <p className="text-sm text-gray-600">{product.descripcion}</p>
                    </div>
                    {product.variantes && product.variantes.length > 0 && (
                      <span className="text-xs font-semibold text-blue-600 px-2 py-1 bg-blue-100 rounded-full">
                        {product.variantes.length} variantes
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Sección de selección de variantes */}
            {selectedProduct && selectedProduct.variantes && selectedProduct.variantes.length > 1 && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fade-in">
                <label htmlFor="variantSelect" className="block text-gray-700 text-sm font-bold mb-2">
                  Seleccionar Variante para "{selectedProduct.nombre}":
                </label>
                <select
                  id="variantSelect"
                  onChange={handleVariantChange}
                  className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedVariant?.id || ""}
                  disabled={initialOrder && initialOrder.estado !== "pendiente"}
                >
                  <option value="">-- Selecciona una variante --</option>
                  {selectedProduct.variantes.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      Talla: {variant.talla} - Color: {variant.color} (Stock actual: {variant.stock})
                    </option>
                  ))}
                </select>
                {selectedVariant && (
                  <p className="text-sm text-gray-600 mt-2">
                    Variante seleccionada: <span className="font-semibold">{selectedVariant.talla}</span> - <span className="font-semibold">{selectedVariant.color}</span> (Stock actual: <span className="font-semibold">{selectedVariant.stock}</span>)
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleAddProductToOrder}
                  disabled={!selectedVariant || (initialOrder && initialOrder.estado !== "pendiente")}
                  className={`w-full py-2 rounded-md mt-4 text-lg font-semibold transition-colors duration-200 ${
                    (!selectedVariant || (initialOrder && initialOrder.estado !== "pendiente")) ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  ➕ Añadir Variante al Pedido
                </button>
              </div>
            )}

            {selectedProduct && (!selectedProduct.variantes || selectedProduct.variantes.length <= 1) && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-green-50 text-center animate-fade-in">
                <p className="text-gray-700 font-semibold mb-3">
                  "{selectedProduct.nombre}" (sin variantes o variante única) ha sido añadido directamente.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Cerrar mensaje
                </button>
              </div>
            )}
          </div>

          {/* Sección: Ítems del Pedido Seleccionados */}
          {selectedItems.length > 0 && (
            <div className="bg-gray-100 p-4 rounded mt-6 border border-gray-300">
              <h3 className="text-lg font-bold mb-3 text-gray-800">📦 Ítems a Pedir ({selectedItems.length})</h3>
              <ul className="space-y-3">
                {selectedItems.map((item, index) => (
                  <li
                    key={`${item.variant_id || 'no-variant'}-${index}`}
                    className="p-3 border border-gray-200 rounded-md bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <span className="font-semibold text-gray-900">{item.product_name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({item.size !== "N/A" ? item.size : 'Talla Única'}, {item.color !== "N/A" ? item.color : 'Color Único'})
                      </span>
                      <br />
                      <span className="text-sm text-gray-700">
                        Precio Unitario de Compra: <span className="font-bold">${item.unit_price?.toFixed(2) || 'N/A'}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`quantity-${index}`} className="sr-only">Cantidad</label>
                      <input
                        id={`quantity-${index}`}
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md text-center text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                        aria-label={`Cantidad de ${item.product_name}`}
                        disabled={initialOrder && initialOrder.estado !== "pendiente"} // Deshabilitar si no es pendiente
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                        aria-label={`Remover ${item.product_name}`}
                        disabled={initialOrder && initialOrder.estado !== "pendiente"} // Deshabilitar si no es pendiente
                      >
                        ❌
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Total del pedido */}
          <div className="text-right mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-md">
            <h3 className="text-2xl font-bold text-purple-800">Total Estimado del Pedido: ${total.toFixed(2)}</h3>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-200 text-lg font-semibold"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={!selectedProveedor || selectedItems.length === 0 || (initialOrder && initialOrder.estado !== "pendiente")}
              className={`px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200 ${
                (!selectedProveedor || selectedItems.length === 0 || (initialOrder && initialOrder.estado !== "pendiente"))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {initialOrder ? '✅ Guardar Cambios' : '➕ Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;