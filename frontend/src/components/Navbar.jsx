import { Link } from "react-router-dom";

const Navbar = () => {
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
          <li><Link to="/login" className="hover:underline">Iniciar Sesion</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
