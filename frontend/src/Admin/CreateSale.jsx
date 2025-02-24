import { useState } from "react";

const CreateSale = ({ onAddSale }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: 1,
    color: "",
    size: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    
    const newSale = {
      ...formData,
      id: Date.now(), // Generar un ID único
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    };
    
    onAddSale(newSale);
    setFormData({ name: "", price: "", quantity: 1, color: "", size: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🛒 Crear Venta</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="size"
          placeholder="Tamaño"
          value={formData.size}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Agregar Venta
        </button>
      </form>
    </div>
  );
};

export default CreateSale;
