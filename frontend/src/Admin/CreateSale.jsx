import { useState, useEffect } from "react";

const CreateSale = ({ onAddSale }) => {
  const [customerPhone, setCustomerPhone] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error cargando productos:", error));
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [search, products]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch("");
    setFilteredProducts([]);

    if (!product.variants || product.variants.length === 0) {
      // 🔹 Si el producto NO tiene variantes, se añade automáticamente
      setSelectedItems((prevItems) => [
        ...prevItems,
        {
          variant_id: null,
          name: product.name,
          size: "N/A",
          color: "N/A",
          quantity: 1,
          stock: 1,
          price: product.price,
        },
      ]);
      setSelectedProduct(null);
    } else if (product.variants.length === 1) {
      // 🔹 Si el producto tiene solo una variante, seleccionarla automáticamente
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const handleVariantChange = (e) => {
    const variant = selectedProduct.variants.find((v) => v.id === parseInt(e.target.value));
    setSelectedVariant(variant);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    if (selectedProduct.variants.length > 1 && !selectedVariant) {
      alert("Seleccione una variante antes de agregar el producto.");
      return;
    }

    const newItem = {
      variant_id: selectedVariant ? selectedVariant.id : null,
      name: selectedProduct.name,
      size: selectedVariant ? selectedVariant.size : "N/A",
      color: selectedVariant ? selectedVariant.color : "N/A",
      quantity: 1,
      stock: selectedVariant ? selectedVariant.stock : 1,
      price: selectedProduct.price,
    };

    setSelectedItems((prevItems) => [...prevItems, newItem]);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const updateQuantity = (index, quantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = quantity;
    setSelectedItems(updatedItems);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerPhone || selectedItems.length === 0) {
      alert("Ingrese el teléfono del cliente y seleccione al menos un producto.");
      return;
    }

    const saleData = {
      customer_phone: customerPhone,
      items: selectedItems.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) throw new Error("Error al registrar la venta");

      alert("✅ Venta registrada con éxito.");
      onAddSale({ id: Date.now(), products: selectedItems });
      setCustomerPhone("");
      setSelectedItems([]);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo registrar la venta.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🛒 Registrar Venta</h1>

      {/* Teléfono del Cliente */}
      <input
        type="text"
        placeholder="📞 Teléfono del Cliente"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-3"
      />

      {/* Buscador de Productos */}
      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-3"
      />

      {/* Lista de productos filtrados */}
      {filteredProducts.length > 0 && (
        <ul className="bg-white border rounded shadow-md mt-2 max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="p-3 border-b hover:bg-gray-200 cursor-pointer"
            >
              <strong>{product.name}</strong> - ${product.price}
              <p className="text-sm text-gray-600">{product.description}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Selección de variantes */}
      {selectedProduct && selectedProduct.variants.length > 1 && (
        <div className="mt-3">
          <label className="block text-gray-700">Seleccionar Variante:</label>
          <select
            onChange={handleVariantChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
          >
            <option value="">Selecciona una variante</option>
            {selectedProduct.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.size} - {variant.color} (Stock: {variant.stock})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botón para agregar el producto */}
      {selectedProduct && (
        <button
          type="button"
          onClick={handleAddProduct}
          className="w-full bg-green-600 text-white py-2 rounded-md mb-3"
        >
          ➕ Agregar Producto
        </button>
      )}

      {/* Lista de productos seleccionados */}
      {selectedItems.length > 0 && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h2 className="text-lg font-bold mb-2">🛍️ Productos Seleccionados</h2>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index} className="p-2 border-b flex justify-between">
                <span>
                  {item.name} ({item.size} - {item.color}) - ${item.price} x {item.quantity}
                </span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  max={item.stock}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                  className="w-16 border p-1 rounded text-center"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Total de la compra */}
      <h3 className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</h3>

      {/* Botón de Confirmar Venta */}
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">
        ✅ Confirmar Venta
      </button>
    </div>
  );
};

export default CreateSale;
