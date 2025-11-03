import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Icons
import { Home, Box, ClipboardList, BarChart2, Users, Tag, Truck } from "lucide-react";
import LogoutButton from "../components/LogoutBtn";

const AdminSidebar = () => {
  // obtener posibles fuentes de información del usuario
  const auth = useAuth() || {};
  const { userData, user } = auth;

  // intenta leer userData desde localStorage si no hay en el context
  const tryLocalStorageUser = () => {
    try {
      const raw = localStorage.getItem("userData") || localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const parseJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch (e) {
      return null;
    }
  };

  const normalize = (v) => (v ? String(v).trim().toLowerCase() : "");

  const isAdminFromObject = (obj) => {
    if (!obj) return false;
    // direct role string
    const roleStr = normalize(obj.role || obj.tipo || obj.rol || obj.role_name || obj.nombre_rol);
    if (roleStr === "admin" || roleStr === "administrator") return true;
    if (obj.is_admin === true) return true;
    // roles array (strings or objects)
    if (Array.isArray(obj.roles)) {
      return obj.roles.some(r => {
        if (!r) return false;
        if (typeof r === "string") return normalize(r) === "admin";
        return normalize(r.name || r.role || r.rol) === "admin";
      });
    }
    // permissions array
    if (Array.isArray(obj.permissions)) {
      return obj.permissions.some(p => normalize(p).includes("admin") || normalize(p).includes("users"));
    }
    return false;
  };

  // check token claims if present
  const token = localStorage.getItem("access_token");
  let tokenClaims = null;
  if (token) tokenClaims = parseJwt(token);

  const isAdmin = (
    isAdminFromObject(userData) ||
    isAdminFromObject(user) ||
    isAdminFromObject(tryLocalStorageUser()) ||
    // token claim checks
    (tokenClaims && (
      (normalize(tokenClaims.role) === "admin") ||
      (Array.isArray(tokenClaims.roles) && tokenClaims.roles.some(r => normalize(r) === "admin")) ||
      (tokenClaims.realm_access && Array.isArray(tokenClaims.realm_access.roles) && tokenClaims.realm_access.roles.some(r => normalize(r) === "admin")) ||
      tokenClaims.is_admin === true
    ))
  );

  // Clases actualizadas: usar tonos muy cercanos al fondo del sidebar (no blanco) y borde sutil
  const baseLink = "flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 focus:outline-none";
  // Active: fondo ligeramente distinto pero muy cercano al sidebar (bg-gray-50) + borde sutil gris para bajo contraste
  const activeLink = "border-l-2 border-gray-200";
  // Hover: sutil y poco contrastado (misma familia de grises)
  const inactiveLink = "text-gray-700 hover:bg-gray-50 hover:text-gray-800";

  return (
    <aside className="w-full bg-gray-900 text-white min-h-screen h-full p-5">
      <h2 className="text-xl font-bold mb-6">Panel de Administración</h2>
      <ul className="space-y-4">
        <li>
          <NavLink to="/admin" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Home className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Box className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Productos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/pedidos" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <ClipboardList className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Pedidos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/sales" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <BarChart2 className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Ventas</span>
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
              <Users className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
              <span>Usuarios</span>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/admin/categories" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Tag className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Categorías</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/proveedores" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Truck className="w-5 h-5 text-gray-300 opacity-70" aria-hidden="true" />
            <span>Proveedores</span>
          </NavLink>
        </li>
        <li>
          <LogoutButton/>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
