import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e) => {
    let newQuantity = Math.max(1, parseInt(e.target.value));
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  console.log("Imagen del producto:", item.image);
  return (
    <tr className="border-b text-center">
      {/* ❌ Botón para eliminar */}
      <td>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 size={18} />
        </button>
      </td>

      {/* 🖼️ Imagen + Nombre del producto */}
      <td className="flex items-center space-x-3 py-3">
        <img
          src={`http://localhost:8000/static/${item.image}`} // ✅ Asegúrate de que `item.image` contiene la URL correcta
          alt={item.name}
          className="w-16 h-16 object-cover"
        />
        <div>
          <p className="text-blue-600 font-semibold">{item.name}</p>
          <p className="text-sm text-gray-500">
            <strong>Talla:</strong> {item.talla} | <strong>Color:</strong> {item.color}
          </p>
        </div>
      </td>

      {/* 💲 Precio unitario */}
      <td className="text-gray-700">${item.precio}</td>

      {/* 🔄 Modificar cantidad */}
      <td>
        <input
          type="number"
          className="w-16 border rounded text-center"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
        />
      </td>

      {/* 🛒 Subtotal */}
      <td className="text-gray-700 font-semibold">
        ${(item.precio * quantity).toFixed(2)}
      </td>
    </tr>
  );
};

export default CartItem;
