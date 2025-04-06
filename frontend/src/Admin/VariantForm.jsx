import { useState } from "react";

const VariantForm = ({ variant, onClose }) => {
  const [formData, setFormData] = useState({
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/products/${variant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar la variante");

      alert("✅ Variante actualizada correctamente.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo actualizar la variante.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">✏️ Editar Variante</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700">Talla</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />

          <label className="block text-gray-700">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />

          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border rounded-md mb-3"
          />

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              ❌ Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              ✅ Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantForm;
