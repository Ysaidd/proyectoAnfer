import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "./LogoutBtn";

const Navbar = () => {
  const { cedula, userRole, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, [cedula]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="h-20 bg-gradient-to-r from-indigo-600 to-indigo-700"></div>
    );
  }

  const navItems = [
    { path: "/", label: "Inicio", icon: "🏠" },
    { path: "/products", label: "Productos", icon: "🛍️" },
    { path: "/cart", label: "Carrito", icon: "🛒" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👔</span>
            </div>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
              Anfer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
                  isActive(item.path)
                    ? isScrolled
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-white/20 text-white'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:transform hover:scale-105 ${
                    isScrolled
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-indigo-600 hover:bg-white/90'
                  }`}
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/perfil"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    <span className="font-medium">Perfil</span>
                  </Link>
                  
                  {userRole === 'admin' || userRole === 'manager' ? (
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
                        isScrolled
                          ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium">Admin</span>
                    </Link>
                  ) : null}
                  
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg"
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`w-6 h-6 flex flex-col justify-center space-y-1 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Iniciar Sesión
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/perfil"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <span className="text-xl">👤</span>
                      <span className="font-medium">Perfil</span>
                    </Link>
                    {userRole === 'admin' || userRole === 'manager' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                      >
                        <span className="text-xl">⚙️</span>
                        <span className="font-medium">Admin</span>
                      </Link>
                    ) : null}
                    <div className="px-4">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;