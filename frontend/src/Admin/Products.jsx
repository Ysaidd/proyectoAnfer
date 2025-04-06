import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import VariantForm from "./VariantForm";
import FormEditPrincipal from "./FormEditPrincipal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const [isEditPrincipalOpen, setIsEditPrincipalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => {
        const sortedProducts = data.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
      })
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
      setFilteredProducts(products);
    }
  }, [search, products]);

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este producto y todas sus variantes?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      alert("✅ Producto eliminado correctamente.");
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo eliminar el producto.");
    }
  };

  const handleDeleteVariant = async (variantId, productId) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta variante?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/products/variant/${variantId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la variante");

      alert("✅ Variante eliminada correctamente.");
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, variants: product.variants.filter((v) => v.id !== variantId) }
            : product
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo eliminar la variante.");
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    setIsFormOpen(false);
  };

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
  <table className="w-full border-collapse border border-gray-600 shadow-md rounded-lg">
    <thead className="bg-blue-700 text-white">
      <tr>
        <th className="border border-gray-700 p-3">Imagen</th>
        <th className="border border-gray-700 p-3">Nombre</th>
        <th className="border border-gray-700 p-3">Descripción</th>
        <th className="border border-gray-700 p-3">Categoría</th>
        <th className="border border-gray-700 p-3">Talla</th>
        <th className="border border-gray-700 p-3">Color</th>
        <th className="border border-gray-700 p-3">Stock</th>
        <th className="border border-gray-700 p-3 bg-indigo-600">Acciones Principales</th>
        <th className="border border-gray-700 p-3 bg-yellow-600">Acciones de Variante</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.map((product, productIndex) =>
        product.variants.map((variant, index) => (
          <tr
            key={`${product.id}-${variant.id}`}
            className={`${(productIndex % 2 === 0) ? "bg-gray-100" : "bg-gray-200"} hover:bg-gray-300 transition`}
          >
            {/* ✅ Imagen, Nombre, Descripción y Categoría (Solo en la primera fila del producto) */}
            {index === 0 && (
              <>
                <td rowSpan={product.variants.length} className="border border-gray-700 p-3 align-middle">
                  {product.image_url ? (
                    <img
                      src={`http://localhost:8000/${product.image_url}`}
                      alt={product.name}
                      className="w-20 h-20 mx-auto rounded-md shadow-md object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td rowSpan={product.variants.length} className="border border-gray-700 p-3 align-middle font-semibold">
                  {product.name}
                </td>
                <td rowSpan={product.variants.length} className="border border-gray-700 p-3 align-middle text-gray-600">
                  {product.description}
                </td>
                <td rowSpan={product.variants.length} className="border border-gray-700 p-3 align-middle font-medium">
                  {product.category?.name || "Sin categoría"}
                </td>
              </>
            )}

            {/* ✅ Información de la Variante */}
            <td className="border border-gray-700 p-3">{variant.size}</td>
            <td className="border border-gray-700 p-3">{variant.color}</td>
            <td className="border border-gray-700 p-3 font-semibold text-blue-600">{variant.stock}</td>

            {/* ✅ Acciones Principales (Solo en la primera fila del producto) */}
            {index === 0 && (
              <td rowSpan={product.variants.length} className="border border-gray-700 p-3 align-middle">
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-indigo-500 px-3 py-1 text-white rounded-md shadow hover:bg-indigo-600 transition w-full"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditPrincipalOpen(true);
                    }}
                  >
                    ✏️ Editar Principal
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 text-white rounded-md shadow hover:bg-red-700 transition w-full"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    🗑️ Eliminar Principal
                  </button>
                </div>
              </td>
            )}

            {/* ✅ Acciones de la Variante */}
            <td className="border border-gray-700 p-3 align-middle">
              <div className="flex flex-col gap-2">
                <button
                  className="bg-yellow-500 px-3 py-1 text-white rounded-md shadow hover:bg-yellow-600 transition w-full"
                  onClick={() => {
                    setSelectedVariant(variant);
                    setIsVariantFormOpen(true);
                  }}
                >
                  ✏️ Editar Variante
                </button>
                <button
                  className="bg-red-500 px-3 py-1 text-white rounded-md shadow hover:bg-red-600 transition w-full"
                  onClick={() => handleDeleteVariant(variant.id, product.id)}
                >
                  🗑️ Eliminar Variante
                </button>
              </div>
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

      {/* Formularios */}
      {isFormOpen && <ProductForm product={selectedProduct} onClose={() => setIsFormOpen(false)} onSave={handleAddProduct} />}
      {isEditPrincipalOpen && selectedProduct && <FormEditPrincipal product={selectedProduct} onClose={() => setIsEditPrincipalOpen(false)} />}
      {isVariantFormOpen && selectedVariant && <VariantForm variant={selectedVariant} onClose={() => setIsVariantFormOpen(false)} />}
    </div>
  );
};

export default Products;
