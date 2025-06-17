import { useState, useEffect } from "react";

const CreateSale = ({ onAddSale }) => {
  // Estados principales del formulario de venta
  const [cedulaCliente, setCedulaCliente] = useState(""); // <-- Volvemos a un solo campo para la cédula
  const [saleStatus, setSaleStatus] = useState("pendiente");
  const [selectedItems, setSelectedItems] = useState([]);

  // Estados para la búsqueda y selección de productos/variantes
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 1. Cargar la lista de productos al iniciar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        alert("Error al cargar productos. Por favor, intente de nuevo más tarde.");
      }
    };
    fetchProducts();
  }, []);

  // 2. Filtrar productos cuando cambia el término de búsqueda o la lista de productos
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

  // 3. Manejar la selección de un producto del listado de búsqueda
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
          quantity: 1,
          stock_available: variant.stock,
          unit_price: product.precio,
        };
        addItemToSelectedItems(newItem);
        setSelectedProduct(null);
      } else {
        setSelectedVariant(null);
      }
    } else {
      const newItem = {
        product_id: product.id,
        variant_id: null,
        product_name: product.nombre,
        size: "N/A",
        color: "N/A",
        quantity: 1,
        stock_available: product.stock || 0,
        unit_price: product.precio,
      };
      addItemToSelectedItems(newItem);
      setSelectedProduct(null);
    }
  };

  // 4. Manejar la selección de una variante en el dropdown
  const handleVariantChange = (e) => {
    const variantId = parseInt(e.target.value);
    const variant = selectedProduct.variantes.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  // 5. Función auxiliar para añadir un ítem a la lista de seleccionados y manejar duplicados
  const addItemToSelectedItems = (newItem) => {
    const existingItemIndex = selectedItems.findIndex(
      (item) => item.product_id === newItem.product_id && item.variant_id === newItem.variant_id
    );

    if (existingItemIndex > -1) {
      alert("Este producto/variante ya ha sido añadido a la lista de venta.");
    } else {
      setSelectedItems((prevItems) => [...prevItems, newItem]);
    }
  };

  // 6. Añadir el producto/variante seleccionado al "carrito"
  const handleAddProductToCart = () => {
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

    let stockForNewItem = itemToAddVariant?.stock || selectedProduct.stock || 0;
    let priceForNewItem = selectedProduct.precio;

    const newItem = {
      product_id: selectedProduct.id,
      variant_id: itemToAddVariant?.id || null,
      product_name: selectedProduct.nombre,
      size: itemToAddVariant?.talla || "N/A",
      color: itemToAddVariant?.color || "N/A",
      quantity: 1,
      stock_available: stockForNewItem,
      unit_price: priceForNewItem,
    };

    addItemToSelectedItems(newItem);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // 7. Actualizar la cantidad de un ítem en el "carrito"
  const updateQuantity = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    const item = updatedItems[index];

    let quantityToSet = parseInt(newQuantity);
    if (isNaN(quantityToSet) || quantityToSet < 1) {
      quantityToSet = 1;
    }
    if (quantityToSet > item.stock_available) {
      alert(`No hay suficiente stock para "${item.product_name} (${item.size}, ${item.color})". Stock disponible: ${item.stock_available}`);
      quantityToSet = item.stock_available;
    }

    item.quantity = quantityToSet;
    setSelectedItems(updatedItems);
  };

  // 8. Eliminar un ítem del "carrito"
  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // 9. Calcular el total de la venta
  const total = selectedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  // 10. Manejador principal para enviar el formulario de la venta
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que la cédula no esté vacía
    if (!cedulaCliente.trim()) {
      alert("Por favor, ingrese la cédula del cliente.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Seleccione al menos un producto para registrar la venta.");
      return;
    }

    const detallesParaAPI = selectedItems.map((item) => ({
      variante_id: item.variant_id,
      cantidad: item.quantity,
      precio_unitario: item.unit_price,
    }));

    const saleData = {
      cedula_cliente: cedulaCliente, // <-- ENVIAMOS LA CÉDULA AL BACKEND
      estado: saleStatus,
      detalles: detallesParaAPI,
    };

    try {
      const response = await fetch("http://localhost:8000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        let errorMessage = `Error al registrar la venta: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorDetail);
          errorMessage = `Error al registrar la venta: ${errorJson.detail || JSON.stringify(errorJson)}`;
        } catch (parseError) {
          errorMessage += ` - ${errorDetail}`;
        }
        throw new Error(errorMessage);
      }

      const registeredSale = await response.json();
      alert("✅ Venta registrada con éxito.");
      onAddSale(registeredSale);

      // Resetear todos los estados del formulario después de un registro exitoso
      setCedulaCliente(""); // Limpiar cédula
      setSelectedItems([]);
      setSelectedProduct(null);
      setSelectedVariant(null);
      setSaleStatus("pendiente");
      setSearch("");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert(`❌ No se pudo registrar la venta. Detalles: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">🛒 Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        {/* Sección: Cédula del Cliente (¡Directo al grano!) */}
        <div className="mb-6">
          <label htmlFor="cedulaCliente" className="block text-gray-700 text-sm font-bold mb-2">Cédula del Cliente:</label>
          <input
            id="cedulaCliente"
            type="text" // Tipo texto para manejar guiones o puntos si los hay en la cédula
            placeholder="Ingrese la cédula del cliente"
            value={cedulaCliente}
            onChange={(e) => setCedulaCliente(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required // Campo obligatorio
          />
        </div>

        {/* Sección: Información Básica de la Venta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="saleStatus" className="block text-gray-700 text-sm font-bold mb-2">Estado de la Venta:</label>
            <select
              id="saleStatus"
              value={saleStatus}
              onChange={(e) => setSaleStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        {/* Sección: Búsqueda y Selección de Productos */}
        <div className="mb-6 border-t pt-4">
          <label htmlFor="productSearch" className="block text-gray-700 text-sm font-bold mb-2">Buscar Producto:</label>
          <input
            id="productSearch"
            type="text"
            placeholder="🔍 Buscar producto por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Resultados de la búsqueda */}
          {filteredProducts.length > 0 && (
            <ul className="bg-white border rounded shadow-md mt-2 max-h-60 overflow-y-auto z-10 relative">
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
              >
                <option value="">-- Selecciona una variante --</option>
                {selectedProduct.variantes.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    Talla: {variant.talla} - Color: {variant.color} (Stock: {variant.stock})
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
                onClick={handleAddProductToCart}
                disabled={!selectedVariant}
                className={`w-full py-2 rounded-md mt-4 text-lg font-semibold transition-colors duration-200 ${
                  !selectedVariant ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                ➕ Añadir Variante al Carrito
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

        {/* Sección: Carrito de Productos Seleccionados */}
        {selectedItems.length > 0 && (
          <div className="bg-gray-100 p-4 rounded mt-6 border border-gray-300">
            <h3 className="text-lg font-bold mb-3 text-gray-800">🛍️ Ítems en la Venta ({selectedItems.length})</h3>
            <ul className="space-y-3">
              {selectedItems.map((item, index) => (
                <li
                  key={`${item.product_id}-${item.variant_id || 'no-variant'}-${index}`}
                  className="p-3 border border-gray-200 rounded-md bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <span className="font-semibold text-gray-900">{item.product_name}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({item.size !== "N/A" ? item.size : 'Talla Única'}, {item.color !== "N/A" ? item.color : 'Color Único'})
                    </span>
                    <br />
                    <span className="text-sm text-gray-700">
                      Precio Unitario: <span className="font-bold">${item.unit_price.toFixed(2)}</span> | Stock disponible: {item.stock_available}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`quantity-${index}`} className="sr-only">Cantidad</label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      value={item.quantity}
                      min="1"
                      max={item.stock_available}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                      className="w-20 p-2 border border-gray-300 rounded-md text-center text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                      aria-label={`Cantidad de ${item.product_name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                      aria-label={`Remover ${item.product_name}`}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total de la compra */}
        <div className="text-right mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-md">
          <h3 className="text-2xl font-bold text-blue-800">Total: ${total.toFixed(2)}</h3>
        </div>

        {/* Botón de Confirmar Venta */}
        <button
          type="submit"
          // Deshabilitar si la cédula está vacía o si no hay productos en el carrito
          disabled={!cedulaCliente.trim() || selectedItems.length === 0}
          className={`w-full py-3 rounded-md mt-6 text-lg font-semibold transition-colors duration-200 ${
            !cedulaCliente.trim() || selectedItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          ✅ Confirmar Venta
        </button>
      </form>
    </div>
  );
};

export default CreateSale;