import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/products") // Ajusta la URL según tu backend
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error cargando productos:", error));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📦 Productos</h1>
      <p className="text-gray-600 mb-4">Administra todos los productos de la tienda.</p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Imagen</th>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Descripción</th>
              <th className="border border-gray-300 p-2">Categoría</th>
              <th className="border border-gray-300 p-2">Talla</th>
              <th className="border border-gray-300 p-2">Color</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) =>
              product.variants.map((variant, index) => (
                <tr key={`${product.id}-${variant.id}`} className="text-center hover:bg-gray-50">
                  {index === 0 && (
                    <>
                      <td rowSpan={product.variants.length} className="border border-gray-300 p-2">
                        <img src={product.image || "https://via.placeholder.com/100"} alt={product.name} className="w-12 h-12 mx-auto rounded-md" />
                      </td>
                      <td rowSpan={product.variants.length} className="border border-gray-300 p-2">{product.name}</td>
                      <td rowSpan={product.variants.length} className="border border-gray-300 p-2">{product.description}</td>
                      <td rowSpan={product.variants.length} className="border border-gray-300 p-2">{product.category?.name || "Sin categoría"}</td>
                    </>
                  )}
                  <td className="border border-gray-300 p-2">{variant.size}</td>
                  <td className="border border-gray-300 p-2">{variant.color}</td>
                  <td className="border border-gray-300 p-2">{variant.stock}</td>
                  <td className="border border-gray-300 p-2 flex justify-center gap-2">
                    <button className="bg-yellow-400 px-3 py-1 text-white rounded-md">✏️ Editar</button>
                    <button className="bg-red-500 px-3 py-1 text-white rounded-md">🗑️ Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botón de agregar producto */}
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-lg w-full"
        onClick={() => {
          setSelectedProduct(null);
          setIsFormOpen(true);
        }}
      >
        ➕ Agregar Producto
      </button>

      {/* Mostrar el formulario cuando isFormOpen sea true */}
      {isFormOpen && (
        <ProductForm product={selectedProduct} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default Products;
