import { useState } from "react";

const Sales = () => {
  const [sales, setSales] = useState([
    { id: 1, name: "camisa", price: 1200, quantity: 2, color: "Gris", size: "S" },
    { id: 2, name: "pantalon", price: 800, quantity: 3, color: "Negro", size: "M" },
    { id: 3, name: "Short", price: 150, quantity: 5, color: "Blanco", size: "L" },
  ]);

  // Calcular el total de todas las ventas
  const total = sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">💰 Ventas</h1>
      <p className="text-gray-600 mb-4">Listado de productos vendidos y su información.</p>

      {/* Tabla de ventas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Cantidad</th>
              <th className="border border-gray-300 p-2">Color</th>
              <th className="border border-gray-300 p-2">Tamaño</th>
              <th className="border border-gray-300 p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="text-center hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{sale.name}</td>
                <td className="border border-gray-300 p-2">${sale.price}</td>
                <td className="border border-gray-300 p-2">{sale.quantity}</td>
                <td className="border border-gray-300 p-2">{sale.color}</td>
                <td className="border border-gray-300 p-2">{sale.size}</td>
                <td className="border border-gray-300 p-2 font-bold">
                  ${sale.price * sale.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total de ventas */}
      <div className="mt-6 text-right">
        <h2 className="text-xl font-bold">Total: <span className="text-green-600">${total}</span></h2>
      </div>
    </div>
  );
};

export default Sales;
