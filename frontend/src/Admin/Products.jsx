import { useState, useEffect, useCallback } from "react";
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
  const [categoriesMap, setCategoriesMap] = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("🧪 Productos desde API (Recargado):", data);
      const sortedProducts = data.sort((a, b) => a.id - b.id);
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/categorias");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const map = {};
      data.forEach((cat) => {
        map[cat.id] = cat.name;
      });
      console.log("🗺️ Mapa de Categorías:", map);
      setCategoriesMap(map);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (search) {
      setFilteredProducts(
        products.filter((product) =>
          product.nombre.toLowerCase().includes(search.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
          categoriesMap[product.categoria?.id]?.toLowerCase().includes(search.toLowerCase()) ||
          product.proveedor?.nombre?.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [search, products, categoriesMap]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto y todas sus variantes?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }
      alert("✅ Producto eliminado correctamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("❌ No se pudo eliminar el producto.");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta variante?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/products/variants/${variantId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la variante");
      }
      alert("✅ Variante eliminada correctamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error eliminando variante:", error);
      alert("❌ No se pudo eliminar la variante.");
    }
  };

  const openAddProductModal = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleProductSave = () => {
    fetchProducts();
    setIsFormOpen(false);
    setIsEditPrincipalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Título principal de la página */}
      <h1 className="text-2xl font-bold mb-2">📦 Productos</h1>
      <p className="text-gray-600 mb-4">
        Administra todos los productos de la tienda.
      </p>

      {/* Buscador de productos */}
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
              <th className="border border-gray-700 p-3">Proveedor</th>
              <th className="border border-gray-700 p-3">Talla</th>
              <th className="border border-gray-700 p-3">Color</th>
              <th className="border border-gray-700 p-3">Stock</th>
              <th className="border border-gray-700 p-3 bg-indigo-600">
                Acciones Principales
              </th>
              <th className="border border-gray-700 p-3 bg-yellow-600">
                Acciones de Variante
              </th>
            </tr>
          </thead>
          <tbody>
            {(filteredProducts || []).map((product, productIndex) =>
              (product.variantes || []).map((variant, index) => (
                <tr
                  key={`${product.id}-${variant.id}`}
                  className={`${
                    productIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  } hover:bg-gray-300 transition`}
                >
                  {index === 0 && (
                    <>
                      <td
                        rowSpan={product.variantes?.length || 1}
                        className="border border-gray-700 p-3 align-middle"
                      >
                        {/* Espacio para la imagen */}
                        <span className="text-gray-500">Sin imagen</span>
                      </td>
                      <td
                        rowSpan={product.variantes?.length || 1}
                        className="border border-gray-700 p-3 align-middle font-semibold"
                      >
                        {product.nombre}
                      </td>
                      <td
                        rowSpan={product.variantes?.length || 1}
                        className="border border-gray-700 p-3 align-middle text-gray-600"
                      >
                        {product.descripcion}
                      </td>
                      <td
                        rowSpan={product.variantes?.length || 1}
                        className="border border-gray-700 p-3 align-middle font-medium"
                      >
                        {categoriesMap[product.categoria?.id] || "Sin categoría"}
                      </td>
                      <td
                        rowSpan={product.variantes?.length || 1}
                        className="border border-gray-700 p-3 align-middle font-medium"
                      >
                        {product.proveedor?.nombre || "Sin proveedor"}
                      </td>
                    </>
                  )}

                  <td className="border border-gray-700 p-3">
                    {variant.talla}
                  </td>
                  <td className="border border-gray-700 p-3">
                    {variant.color}
                  </td>
                  <td className="border border-gray-700 p-3 font-semibold text-blue-600">
                    {variant.stock}
                  </td>
                  {index === 0 && (
                    <td rowSpan={product.variantes?.length || 1} className="border border-gray-700 p-3 align-middle">
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

      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-lg w-full"
        onClick={openAddProductModal}
      >
        ➕ Agregar Producto
      </button>

      {isFormOpen && (
        <ProductForm 
          product={selectedProduct} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleProductSave} 
        />
      )}
      {isEditPrincipalOpen && selectedProduct && (
        <FormEditPrincipal 
          product={selectedProduct} 
          onClose={() => setIsEditPrincipalOpen(false)} 
          onSave={handleProductSave} 
        />
      )}
      {isVariantFormOpen && selectedVariant && (
        <VariantForm 
          variant={selectedVariant} 
          onClose={() => setIsVariantFormOpen(false)} 
          onSave={handleProductSave} 
        />
      )}
    </div>
  );
};

export default Products;