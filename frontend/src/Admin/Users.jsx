import { useState } from "react";

const Users = () => {
  // Datos simulados de productos
  const [users, setUsers] = useState([
    { id: 1, name: "Said", rol: "Administrador", stock: 15, image: "/images/prueba.jpg" },
    { id: 2, name: "Leo", rol: "Administrador", stock: 25, image: "/images/prueba.jpg" },
    { id: 3, name: "Prato", rol: "Administrador", stock: 50, image: "/images/prueba.jpg" },
    { id: 4, name: "Soto", rol: "Administrador", stock: 50, image: "/images/prueba.jpg" },
    
  ]);

  const [search, setSearch] = useState("");

  // Filtrar productos por búsqueda
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📦 Usuarios</h1>
      <p className="text-gray-600 mb-4">Administra todos los usuarios de la tienda.</p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar usuarios..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Imagen</th>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <img src={user.image} alt={user.name} className="w-12 h-12 mx-auto rounded-md" />
                </td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">${user.rol}/</td>
                <td className="border border-gray-300 p-2">{user.stock}</td>
                <td className="border border-gray-300 p-2 flex justify-center gap-2">
                  <button className="bg-yellow-400 px-3 py-1 text-white rounded-md">✏️ Editar</button>
                  <button className="bg-red-500 px-3 py-1 text-white rounded-md">🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón de agregar producto */}
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-lg w-full">
        ➕ Agregar Producto
      </button>
    </div>
  );
};

export default Users;
