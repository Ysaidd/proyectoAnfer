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
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setLoading(true);
    const apiUrl = `http://localhost:8000/products/${id}`;
    
    console.log("🌍 Consultando API:", apiUrl); // <-- Imprime la URL para confirmar que es correcta
    
    fetch(apiUrl)
      .then((response) => {
        console.log("📩 Respuesta del servidor:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Producto no encontrado - Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const sizes = [...new Set(data.variants.map(v => v.size))]; // Extraer tallas únicas
        const colors = [...new Set(data.variants.map(v => ({ name: v.color })))]; // Extraer colores únicos
      
        setProduct({
          ...data,
          sizes,
          colors
        });
      
        setSelectedSize(sizes[0]);
        setSelectedColor(colors[0]);
        setCurrentImage(data.image_url); // Solo una imagen
        setLoading(false);
      })
}, [id]);

  const handleAddToCart = () => {
    // Encontrar la variante seleccionada
    const selectedVariant = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor.name
    );

    if (!selectedVariant) {
      alert("Variante no disponible");
      return;
    }

    // Pasar el variant_id al carrito
    addToCart(product, quantity, selectedVariant.id);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };


  if (loading) return <p>Cargando...</p>;
  if (error)
    return (
      <div className="max-w-6xl mx-auto p-6 h-[80vh] shadow-sm bg-white p-4">
        <h2 className="text-3xl font-bold">Error 404</h2>
        <p className="pb-6">Producto no encontrado, intente buscar otro producto.</p>
        <Link to={"/"} className="bg-indigo-900 px-4 py-4 text-white rounded-md hover:bg-indigo-600">
          Regresar a la Página Principal
        </Link>
      </div>
    );


  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[75vh]">
      <div>
        <img src={`http://localhost:8000/${product.image_url}`} alt={product.name} className="w-full h-96 object-cover mx-auto" />
      </div>

      <div>
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="text-blue-500 text-2xl font-semibold">${product.price.toFixed(2)}</p>

        <div className="mt-4">
          <span className="font-semibold">Talla</span>
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size) => (
              <button key={size} className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSelectedSize(size)}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Color</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color) => (
              <button key={color} className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSelectedColor(color)} >
                {color.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Descripción</span>
          <div className="flex gap-2 mt-2">
            <p>{product.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
        <input  type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}className="border p-2 w-20"/>
        <div className="relative">
          {/* Botón de añadir al carrito */}
          <button onClick={handleAddToCart} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Añadir
          </button>

          {/* Ventana flotante de confirmación */}
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
