import { useState, useEffect } from "react";
import CreateSale from "./CreateSale";

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/orders")
      .then((response) => response.json())
      .then((data) => setSales(data))
      .catch((error) => console.error("Error cargando ventas:", error));
  }, []);

  const addSale = (newSale) => {
    setSales([...sales, newSale]);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">💰 Ventas</h1>
      <p className="text-gray-600 mb-4">Listado de ventas registradas.</p>

      <CreateSale onAddSale={addSale} />

      <div className="overflow-x-auto mt-6">
      <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 p-2">Venta #</th>
              <th className="border border-gray-300 p-2">Cliente</th>
              <th className="border border-gray-300 p-2">Fecha</th>
              <th className="border border-gray-300 p-2">Productos</th>
              <th className="border border-gray-300 p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 text-center">
                <td className="border border-gray-300 p-2">#{sale.id}</td>
                <td className="border border-gray-300 p-2">{sale.customer_phone}</td>
                <td className="border border-gray-300 p-2">{formatDate(sale.created_at)}</td>
                <td className="border border-gray-300 p-2 text-left">
                  <ul className="list-disc pl-5">
                    {sale.items?.map((item, index) => (
                      <li key={index}>
                        <strong>{item.product_name}</strong> ({item.size}, {item.color})  
                        <br />
                        Cantidad: {item.quantity} x ${item.price}  
                        <br />
                        <strong>Subtotal: ${item.quantity * item.price}</strong>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 p-2 font-bold text-green-600">${sale.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
