import { useState, useEffect } from "react";

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || {
      name: "",
      description: "",
      price: 0,
      category_id: "",
      proveedor_id: "",
      variants: [],
      // image: null, // <--- ELIMINADO
    }
  );

  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [providers, setProviders] = useState([]);
  const [searchProvider, setSearchProvider] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);

  const [variant, setVariant] = useState({ size: "", color: "", stock: "" });

  useEffect(() => {
    // Cargar categorías desde la API
    fetch("http://localhost:8000/categorias")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (product && product.categoria && data.length > 0) {
          const initialCategory = data.find(cat => cat.id === product.categoria.id);
          if (initialCategory) {
            setSearchCategory(initialCategory.name);
            setFormData(prev => ({ ...prev, category_id: initialCategory.id }));
          }
        }
      })
      .catch((error) => console.error("Error cargando categorías:", error));
  }, [product]);

  useEffect(() => {
    // Cargar proveedores desde la API
    fetch("http://localhost:8000/proveedores")
      .then((response) => response.json())
      .then((data) => {
        setProviders(data);
        if (product && product.proveedor && data.length > 0) {
          const initialProvider = data.find(prov => prov.id === product.proveedor.id);
          if (initialProvider) {
            setSearchProvider(initialProvider.nombre);
            setFormData(prev => ({ ...prev, proveedor_id: initialProvider.id }));
          }
        }
      })
      .catch((error) => console.error("Error cargando proveedores:", error));
  }, [product]);

  useEffect(() => {
    // Filtrar categorías en tiempo real
    if (searchCategory) {
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchCategory.toLowerCase())
        )
      );
    } else {
      setFilteredCategories([]);
    }
  }, [searchCategory, categories]);

  useEffect(() => {
    // Filtrar proveedores en tiempo real
    if (searchProvider) {
      setFilteredProviders(
        providers.filter((prov) =>
          prov.nombre.toLowerCase().includes(searchProvider.toLowerCase())
        )
      );
    } else {
      setFilteredProviders([]);
    }
  }, [searchProvider, providers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, category_id: category.id });
    setSearchCategory(category.name);
    setFilteredCategories([]);
  };

  const handleSelectProvider = (provider) => {
    setFormData({ ...formData, proveedor_id: provider.id });
    setSearchProvider(provider.nombre);
    setFilteredProviders([]);
  };

  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // const handleImageChange = (e) => { // <--- ELIMINADO
  //   setFormData({ ...formData, image: e.target.files[0] }); // <--- ELIMINADO
  // }; // <--- ELIMINADO

  const addVariant = () => {
    if (!variant.size || !variant.color || !variant.stock) {
      alert("Completa todos los campos de la variante.");
      return;
    }
    setFormData({ 
      ...formData, 
      variants: [...formData.variants, { 
        talla: variant.size,
        color: variant.color, 
        stock: parseInt(variant.stock)
      }] 
    });
    setVariant({ size: "", color: "", stock: "" });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || formData.price <= 0 || !formData.category_id || !formData.proveedor_id) {
        alert("Por favor, rellena todos los campos obligatorios (Nombre, Descripción, Precio, Categoría, Proveedor).");
        return;
    }
    if (formData.variants.length === 0) {
        alert("Debes agregar al menos una variante.");
        return;
    }
    
    // Aquí el FormData cambia porque ya no enviamos un archivo de imagen.
    // Si tu backend espera un JSON, entonces deberíamos enviar un JSON.
    // Basándome en el formato JSON que me diste al principio, voy a asumir
    // que el backend espera un JSON.
    const productData = {
        nombre: formData.name,
        descripcion: formData.description,
        precio: parseFloat(formData.price), // Asegurar que sea float
        categoria_id: parseInt(formData.category_id), // Asegurar que sea int
        proveedor_id: parseInt(formData.proveedor_id), // Asegurar que sea int
        variantes: formData.variants, // Ya es un array de objetos
    };

    try {
        const url = product 
            ? `http://localhost:8000/products/${product.id}`
            : "http://localhost:8000/products";

        const method = product ? "PUT" : "POST";
        
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json", // <--- ¡IMPORTANTE! Enviamos JSON
            },
            body: JSON.stringify(productData), // <--- Enviamos el objeto como JSON string
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al ${product ? "editar" : "crear"} el producto: ${errorText}`);
        }

        alert(`✅ Producto ${product ? "editado" : "creado"} correctamente.`);
        if (onSave) {
            onSave();
        }
        onClose();
    } catch (error) {
        console.error("Error:", error);
        alert(`❌ No se pudo ${product ? "editar" : "crear"} el producto. ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product ? "✏️ Editar Producto" : "➕ Agregar Producto"}
        </h2>

        {/* --- CAMPOS PRINCIPALES --- */}
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

        {/* --- Buscador de categorías --- */}
        <label className="block text-gray-700">Categoría</label>
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
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

        {/* --- Buscador de proveedores --- */}
        <label className="block text-gray-700 mt-3">Proveedor</label>
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={searchProvider}
          onChange={(e) => setSearchProvider(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        {/* Lista de proveedores filtrados */}
        {filteredProviders.length > 0 && (
          <ul className="bg-white border rounded shadow-md mt-2 max-h-40 overflow-y-auto">
            {filteredProviders.map((provider) => (
              <li
                key={provider.id}
                onClick={() => handleSelectProvider(provider)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {provider.nombre}
              </li>
            ))}
          </ul>
        )}

        {/* <label className="block text-gray-700 mt-3">Imagen</label> */} {/* <--- ELIMINADO */}
        {/* <input type="file" onChange={handleImageChange} className="w-full p-2 border mb-3" /> */} {/* <--- ELIMINADO */}


        {/* --- AGREGAR VARIANTES --- */}
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
                {v.talla} - {v.color} - Stock: {v.stock}
              </li>
            ))}
          </ul>
        )}

        {/* --- BOTONES --- */}
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