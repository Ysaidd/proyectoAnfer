import { useState, useEffect } from "react";

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState(
    product || {
      name: "",
      description: "",
      price: 0,
      category_id: "",
      variants: [],
    }
  );

  const [categories, setCategories] = useState([]); // Lista de categorías
  const [search, setSearch] = useState(""); // Búsqueda de categoría
  const [filteredCategories, setFilteredCategories] = useState([]); // Categorías filtradas
  const [variant, setVariant] = useState({ size: "", color: "", stock: "" });

  useEffect(() => {
    // Cargar categorías desde la API
    fetch("http://localhost:8000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error cargando categorías:", error));
  }, []);

  useEffect(() => {
    // Filtrar categorías en tiempo real
    if (search) {
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCategories([]);
    }
  }, [search, categories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, category_id: category.id });
    setSearch(category.name); // Mostrar el nombre en el input
    setFilteredCategories([]); // Ocultar lista
  };

  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  const addVariant = () => {
    if (!variant.size || !variant.color || !variant.stock) {
      alert("Completa todos los campos de la variante.");
      return;
    }
    setFormData({ ...formData, variants: [...formData.variants, variant] });
    setVariant({ size: "", color: "", stock: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Selecciona una categoría.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar el producto");

      alert("✅ Producto guardado con éxito.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo guardar el producto.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {product ? "✏️ Editar Producto" : "➕ Agregar Producto"}
        </h2>

        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        <label className="block text-gray-700">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        ></textarea>

        <label className="block text-gray-700">Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        {/* Buscador de categorías */}
        <label className="block text-gray-700">Categoría</label>
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        {/* Lista de categorías filtradas */}
        {filteredCategories.length > 0 && (
          <ul className="bg-white border rounded shadow-md mt-2 max-h-40 overflow-y-auto">
            {filteredCategories.map((category) => (
              <li
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}

        {/* Agregar variantes */}
        <h3 className="text-lg font-bold mt-4">Variantes</h3>
        <div className="flex gap-2">
          <input
            type="text"
            name="size"
            placeholder="Talla"
            value={variant.size}
            onChange={handleVariantChange}
            className="w-1/3 p-2 border border-gray-300 rounded-md mb-3"
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={variant.color}
            onChange={handleVariantChange}
            className="w-1/3 p-2 border border-gray-300 rounded-md mb-3"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={variant.stock}
            onChange={handleVariantChange}
            className="w-1/3 p-2 border border-gray-300 rounded-md mb-3"
          />
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="w-full bg-green-500 text-white py-2 rounded-md mb-3"
        >
          ➕ Agregar Variante
        </button>

        {/* Lista de variantes agregadas */}
        {formData.variants.length > 0 && (
          <ul className="bg-gray-100 p-3 rounded">
            {formData.variants.map((v, index) => (
              <li key={index} className="p-1 border-b">
                {v.size} - {v.color} - Stock: {v.stock}
              </li>
            ))}
          </ul>
        )}

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            ❌ Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            ✅ Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
