import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutBtn";

const Navbar = () => {
  const { cedula} = useAuth(); // Asegúrate de que tu AuthContext tenga una función logout
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para sincronizar el estado de autenticación
  useEffect(() => {
    // Simula una verificación inicial (opcional, depende de tu lógica de auth)
    setTimeout(() => setIsLoading(false), 500); // Solo para demostración
  }, [cedula]); // Se ejecuta cada vez que `cedula` cambia

  if (isLoading) {
    return null; // O un placeholder/skeleton loader
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-purple-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"}>
          <h1 className="text-2xl font-bold">Anfer</h1>
        </Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:underline">Inicio</Link></li>
          <li><Link to="/products" className="hover:underline">Productos</Link></li>
          <li><Link to="/cart" className="hover:underline">Carrito</Link></li>

          {/* Menú condicional */}
          {!cedula ? (
            <li><Link to="/login" className="hover:underline">Iniciar Sesión</Link></li>
          ) : (
            <>
              <li><Link to="/perfil" className="hover:underline">Perfil</Link></li>
              <li>
                <LogoutButton/>
                </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;