import { useState } from "react";

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState(
    product || { name: "", price: "", stock: "", image: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{product ? "✏️ Editar Producto" : "➕ Agregar Producto"}</h2>

        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        <label className="block text-gray-700">Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        <label className="block text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min={1}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        <label className="block text-gray-700">Imagen (URL)</label>
        <input
          type="file"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            ❌ Cancelar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            ✅ Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
