import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-full bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-6">Panel de Administración</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/" className="block p-2 hover:bg-gray-700 rounded">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="block p-2 hover:bg-gray-700 rounded">
            📦 Productos
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
            👥 Usuarios
          </Link>
        </li>
        <li>
          <Link to={`/admin/createSales`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Crear Venta
          </Link>
        </li>
        <li>
          <Link to={`/admin/sales`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Ventas
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
