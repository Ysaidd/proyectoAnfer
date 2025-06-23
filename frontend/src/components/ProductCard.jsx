// ProductCard.jsx
import React from "react";
import BtnViaWhatsapp from "./BtnVIaWhatsapp";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Esta función es la que genera la URL COMPLETA y correcta para la imagen.
  // Es tu "imagen" en el sentido de cómo se accede al recurso visual.
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      // Si no hay ruta de imagen, muestra un SVG de placeholder.
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    // Aseguramos que la ruta comience con 'images/' si es lo que devuelve el backend
    // y luego le anteponemos la URL base de tu servidor estático.
    const cleanPath = imagePath.startsWith('images/') ? imagePath : `images/${imagePath}`;
    const fullUrl = `http://localhost:8000/static/${cleanPath}`;
    return fullUrl;
  };

  // Esta función maneja el caso de que la imagen no cargue, mostrando el placeholder.
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getImageUrl(null); // Usa la función para obtener el placeholder
  };

  return (
    <div className="border rounded-lg p-4 shadow-lg text-center ">
      <img
        // Aquí es donde se usa la función `getImageUrl` para que el navegador
        // sepa dónde encontrar el archivo de la imagen.
        src={getImageUrl(product.image_url)} // <-- ¡Esta línea es la clave!
        alt={product.nombre} // Usamos 'nombre' para consistencia.
        className="w-full h-64 object-cover mx-auto cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
        onError={handleImageError} // Si falla al cargar, muestra el placeholder.
      />
      <h3 className="font-semibold mt-3" onClick={() => navigate(`/product/${product.id}`)}>{product.nombre}</h3>
      <p className="pb-3 text-blue-600 font-bold">${product.precio?.toFixed(2) || 'N/A'}</p>
      <button
        className="w-full block bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition text-center"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        Ver Producto
      </button>
      {/* Si BtnViaWhatsapp es necesario, asegúrate de que sus props sean correctas. */}
      {/* <BtnViaWhatsapp product={product} /> */}
    </div>
  );
};

export default ProductCard;