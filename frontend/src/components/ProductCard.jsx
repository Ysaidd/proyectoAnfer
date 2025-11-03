// ProductCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API
  const navigate = useNavigate();

  // Esta función es la que genera la URL COMPLETA y correcta para la imagen.
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    const cleanPath = imagePath.startsWith('images/') ? imagePath : `images/${imagePath}`;
    const fullUrl = `${API_URL}/static/${cleanPath}`;
    return fullUrl;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImageUrl(null);
  };

  return (
    <motion.div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl(product.image_url)}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
          onError={handleImageError}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Quick View Button */}
        <motion.button
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 
          className="font-bold text-lg text-gray-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors duration-300"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.nombre}
        </h3>
        
        {/* Categories */}
        {product.categorias && product.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categorias.map((category, index) => (
              <span
                key={category.id || index}
                className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            ${product.precio?.toFixed(2) || 'N/A'}
          </span>
          <div className="flex items-center text-yellow-400">

          </div>
        </div>

        <motion.button
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Ver Producto
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;