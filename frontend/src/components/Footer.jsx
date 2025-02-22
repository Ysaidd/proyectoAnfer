import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold">Anfer</h2>
          <p className="text-gray-400 mt-2">
            Tu mejor opción para encontrar el estilo perfecto.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Categorías</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Caballero</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Dama</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Accesorios</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Personalizar</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contacto</h3>
          <p className="text-gray-400">📞 +58 4247347724</p>
          <p className="text-gray-400">📧 contacto@anfer.com</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
              <FaInstagram />
            </a>
            <a href="https://wa.me/52123456789" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
              <FaWhatsapp />
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} Anfer - Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
