import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState(null); // Asegúrate de que esto se use

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // Almacenará el string del color
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null); // Limpia errores anteriores al hacer una nueva petición
    const apiUrl = `http://localhost:8000/products/${id}`;

    console.log("🌍 Consultando API:", apiUrl);

    fetch(apiUrl)
      .then((response) => {
        console.log("📩 Respuesta del servidor:", response.status, response.statusText);
        if (!response.ok) {
          // Captura el error de HTTP (404, 500, etc.)
          throw new Error(`Producto no encontrado o error en el servidor - Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📦 Datos del producto recibidos:", data); // Verifica la estructura de `data`

        // Si no hay variantes, inicializa con arrays vacíos para evitar errores
        const variantes = data.variantes || [];

        // Extraer tallas únicas
        const sizes = [...new Set(variantes.map(v => v.talla))];
        // Extraer colores únicos (ahora solo strings)
        const colors = [...new Set(variantes.map(v => v.color))];

        setProduct({
          ...data,
          sizes,
          colors
        });

        // Seleccionar el primer elemento si existen tallas/colores
        setSelectedSize(sizes.length > 0 ? sizes[0] : null);
        setSelectedColor(colors.length > 0 ? colors[0] : null); // Ahora selectedColor es un string
        setCurrentImage(data.image_url); // Asumiendo que `image_url` viene directamente en el producto
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al cargar el producto:", err);
        setError(err); // Aquí es donde actualizas el estado de error
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert("Por favor, selecciona talla y color.");
      return;
    }

    // Encontrar la variante seleccionada
    const selectedVariant = product.variantes.find(
      // Ahora comparamos `v.color` directamente con `selectedColor` (que es un string)
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
        <h2 className="text-3xl font-bold">Error</h2> {/* Ahora muestra "Error" genérico o el mensaje de error */}
        <p className="pb-6">{error.message}</p> {/* Muestra el mensaje de error específico */}
        <Link to={"/"} className="bg-indigo-900 px-4 py-4 text-white rounded-md hover:bg-indigo-600">
          Regresar a la Página Principal
        </Link>
      </div>
    );

  // Si no hay producto, o el ID no es válido, o no hay variantes para mostrar.
  // Podrías mostrar un mensaje diferente si `product.variantes` es vacío.
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
        {/* Asegúrate de que product.image_url contenga el nombre del archivo o la ruta relativa */}
        <img src={`http://localhost:8000/${product.image_url}`} alt={product.nombre} className="w-full h-96 object-cover mx-auto" />
      </div>

      <div>
        <h2 className="text-3xl font-bold">{product.nombre}</h2>
        <p className="text-blue-500 text-2xl font-semibold">${product.precio ? product.precio.toFixed(2) : 'N/A'}</p> {/* Añade manejo para precio nulo */}

        {/* Solo renderiza si hay tallas disponibles */}
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

        {/* Solo renderiza si hay colores disponibles */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold">Color</span>
            <div className="flex gap-2 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color} // Ahora la clave es el string del color
                  className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color} {/* Ahora muestra el string del color */}
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