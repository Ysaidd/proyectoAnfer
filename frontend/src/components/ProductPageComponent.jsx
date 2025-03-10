import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import BtnViaWhatsapp from "../components/BtnVIaWhatsapp";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Calzado Dama Style D-7545-2",
    price: 30.0,
    images: ["/images/prueba.jpg", "/images/descarga.jpg"],
    sizes: [36, 37, 38, 39, 40],
    colors: [{ name: "Beige con rojo", hex: "#F5F5DC" }],
    description: "Calzado Dama Style D-7545-2\nTalla: 36, 37, 38, 39, 40.\nColor: Beige con rojo.",
  },
  {
    id: 2,
    name: "PRUEBAAAA",
    price: 30.0,
    images: ["/images/prueba.jpg", "/images/descarga.jpg"],
    sizes: [36, 37, 38, 39, 40],
    colors: [{ name: "Beige con rojo", hex: "#F5F5DC" }, {name: "Azul", hex: "#0000FF"}],
    description: "Calzado Dama Style D-7545-2\nTalla: 36, 37, 38, 39, 40.\nColor: Beige con rojo.",
  },
];

const ProductPageComponent = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(productId));

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(product?.images[0]);
  const [showMessage, setShowMessage] = useState(false);

  if (!product) return (
    <div className="max-w-6xl mx-auto p-6 h-[80vh] shadow-sm bg-white p-4">
      <h2 className="text-3xl font-bold">Error 404</h2>
      <p className="pb-6">Producto no encontrado, intente buscar otro producto.</p> 
      <Link to={"/"} className="bg-indigo-900 px-4 py-4 text-white rounded-md hover:bg-indigo-600">Regresar a la Pagina Principal</Link>
    </div>
  )
  

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[75vh]">
      <div>
        <img src={currentImage} alt={product.name} className="w-full h-96 object-cover mx-auto" />
        <div className="flex gap-2 mt-4">
          {product.images.map((img, index) => (
            <img key={index} src={img} alt="Miniatura" className="w-16 h-16 object-contain cursor-pointer border-2 border-gray-300 hover:border-blue-500" onClick={() => setCurrentImage(img)} />
          ))}
        </div>
      </div>
      
      <div>
      {showMessage && <div className="bg-blue-400 py-4"><p className="ms-3 font-semibold text-white">Producto Agregado exitosamente</p></div>}
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="text-blue-500 text-2xl font-semibold">${product.price.toFixed(2)}</p>

        <div className="mt-4">
          <span className="font-semibold">Talla</span>
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size) => (
              <button key={size} className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSelectedSize(size)}>{size}</button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Color</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color, index) => (
              <button key={index} className={`w-10 h-10 rounded-full border-2 ${selectedColor.hex === color.hex ? "border-blue-500" : "border-gray-300"}`} style={{ backgroundColor: color.hex }} onClick={() => setSelectedColor(color)} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Descripcion</span>
          <div className="flex gap-2 mt-2">
            <p>{product.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-16 p-2 border rounded-lg text-center" />
          <button onClick={handleAddToCart} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Añadir</button>
          <BtnViaWhatsapp whatsappLink={`https://wa.me/1234567890?text=${encodeURIComponent(`Hola, quiero comprar: ${product.name} - Precio: $${product.price} - Talla: ${selectedSize} - Color: ${selectedColor.name}`)}`} />
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;
