import { useState } from "react";

const FormEditPrincipal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    category_id: product.category.id,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al actualizar el producto");
      alert("✅ Producto actualizado correctamente.");
      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar el producto.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">✏️ Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border mb-3" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border mb-3" />
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

export default FormEditPrincipal;
