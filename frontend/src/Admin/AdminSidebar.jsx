import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutBtn";

const AdminSidebar = () => {
  return (
    <aside className="w-full bg-gray-900 text-white min-h-screen h-full p-5">
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
          <Link to={`/admin/sales`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Ventas
          </Link>
        </li>
        <li>
          <Link to={`/admin/categories`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Categorias
          </Link>
        </li>
        <li>
          <Link to={`/admin/proveedores`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Proveedores
          </Link>
        </li>
         <li>
          <Link to={`/admin/pedidos`} className="block p-2 hover:bg-gray-700 rounded">
            💰 Pedidos
          </Link>
        </li>
        <li>
          <LogoutButton/>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
