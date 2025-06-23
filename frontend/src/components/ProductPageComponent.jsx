import React, { useState, useEffect, useCallback } from "react"; // Asegúrate de importar useCallback
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import BtnViaWhatsapp from "../components/BtnVIaWhatsapp";
import { Link } from "react-router-dom";

const ProductPageComponent = () => {
  const { productId } = useParams();
  const id = parseInt(productId, 10);

  console.log("🛠️ ID obtenido de useParams:", productId);
  console.log("🔢 ID convertido a número:", id);
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null); // Esto ya lo tenías, lo usaremos.
  const [showConfirmation, setShowConfirmation] = useState(false);

  // --- FUNCIÓN getImageUrl APLICADA AQUÍ ---
  // Esta función es la que construye la URL completa y correcta para la imagen.
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) {
      // Si no hay ruta de imagen, devuelve una URL a un placeholder SVG.
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    // Aseguramos que la ruta comienza con 'images/' si no lo hace,
    // y luego le anteponemos la ruta base de tu servidor estático.
    const cleanPath = imagePath.startsWith('images/') ? imagePath : `images/${imagePath}`;
    const fullUrl = `http://localhost:8000/static/${cleanPath}`;
    return fullUrl;
  }, []); // Dependencias vacías porque no depende de ningún estado o prop cambiante.

  // Función para manejar errores de carga de imagen, mostrando un placeholder.
  const handleImageError = useCallback((e) => {
    e.target.onerror = null; // Evita bucles infinitos de error
    e.target.src = getImageUrl(null); // Usa la función para obtener el placeholder SVG
  }, [getImageUrl]); // Depende de getImageUrl

  // --- FIN DE LA APLICACIÓN DE LA FUNCIÓN getImageUrl ---

  useEffect(() => {
    setLoading(true);
    setError(null);
    const apiUrl = `http://localhost:8000/products/${id}`;

    console.log("🌍 Consultando API:", apiUrl);

    fetch(apiUrl)
      .then((response) => {
        console.log("📩 Respuesta del servidor:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Producto no encontrado o error en el servidor - Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📦 Datos del producto recibidos:", data);

        const variantes = data.variantes || [];

        const sizes = [...new Set(variantes.map(v => v.talla))];
        const colors = [...new Set(variantes.map(v => v.color))];

        setProduct({
          ...data,
          sizes,
          colors
        });

        setSelectedSize(sizes.length > 0 ? sizes[0] : null);
        setSelectedColor(colors.length > 0 ? colors[0] : null);
        // ⚠️ Aquí es donde se establece la imagen principal usando getImageUrl
        setCurrentImage(getImageUrl(data.image_url)); // Usamos getImageUrl para la imagen inicial
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al cargar el producto:", err);
        setError(err);
        setLoading(false);
      });
  }, [id, getImageUrl]); // Añade getImageUrl a las dependencias del useEffect

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert("Por favor, selecciona talla y color.");
      return;
    }

    const selectedVariant = product.variantes.find(
      (v) => v.talla === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) {
      alert("Variante no disponible. Intente otra combinación.");
      return;
    }

    if (quantity <= 0) {
      alert("La cantidad debe ser mayor que cero.");
      return;
    }

    if (selectedVariant.stock < quantity) {
      alert(`No hay suficiente stock. Solo quedan ${selectedVariant.stock} unidades.`);
      return;
    }

    addToCart(product, quantity, selectedVariant.id);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  if (loading) return <p>Cargando...</p>;
  if (error)
    return (
      <div className="max-w-6xl mx-auto p-6 h-[80vh] shadow-sm bg-white p-4">
        <h2 className="text-3xl font-bold">Error</h2>
        <p className="pb-6">{error.message}</p>
        <Link to={"/"} className="bg-indigo-900 px-4 py-4 text-white rounded-md hover:bg-indigo-600">
          Regresar a la Página Principal
        </Link>
      </div>
    );

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6 h-[80vh] shadow-sm bg-white p-4">
        <h2 className="text-3xl font-bold">Producto no disponible</h2>
        <p className="pb-6">No se encontraron datos para este producto.</p>
        <Link to={"/"} className="bg-indigo-900 px-4 py-4 text-white rounded-md hover:bg-indigo-600">
          Regresar a la Página Principal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[75vh]">
      <div>
        {/* ⚠️ CORRECCIÓN CLAVE AQUÍ: Usamos currentImage (que ya tiene la URL completa) */}
        {/* Opcionalmente, podrías usar directamente getImageUrl(product.image_url) aquí si no usas currentImage para otras cosas */}
        <img
          src={currentImage}
          alt={product.nombre}
          className="w-full h-96 object-cover mx-auto"
          onError={handleImageError} // Manejo de error para la imagen principal
        />
      </div>

      <div>
        <h2 className="text-3xl font-bold">{product.nombre}</h2>
        <p className="text-blue-500 text-2xl font-semibold">${product.precio ? product.precio.toFixed(2) : 'N/A'}</p>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold">Talla</span>
            <div className="flex gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold">Color</span>
            <div className="flex gap-2 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <span className="font-semibold">Descripción</span>
          <div className="flex gap-2 mt-2">
            <p>{product.descripcion}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="border p-2 w-20" />
          <div className="relative">
            <button onClick={handleAddToCart} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Añadir
            </button>
            {showConfirmation && (
              <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
                ✅ Producto añadido correctamente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;