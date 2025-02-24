import { useState } from "react";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 1200, stock: 15, image: "https://via.placeholder.com/100" },
    { id: 2, name: "Smartphone", price: 800, stock: 25, image: "https://via.placeholder.com/100" },
    { id: 3, name: "Auriculares", price: 150, stock: 50, image: "https://via.placeholder.com/100" },
  ]);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-center hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <img src={product.image} alt={product.name} className="w-12 h-12 mx-auto rounded-md" />
                </td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">${product.price}</td>
                <td className="border border-gray-300 p-2">{product.stock}</td>
                <td className="border border-gray-300 p-2 flex justify-center gap-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 text-white rounded-md"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsFormOpen(true);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button className="bg-red-500 px-3 py-1 text-white rounded-md">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
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
