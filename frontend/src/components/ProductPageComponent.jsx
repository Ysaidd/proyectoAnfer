import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BtnViaWhatsapp from "../components/BtnVIaWhatsapp";

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
  const product = products.find((p) => p.id === parseInt(productId));

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(product?.images[0]);

  if (!product) return <h2 className="text-center mt-10">Producto no encontrado</h2>;

  const whatsappLink = `https://wa.me/1234567890?text=${encodeURIComponent(
    `Hola, quiero comprar: ${product.name} - Precio: $${product.price} - Talla: ${selectedSize} - Color: ${selectedColor.name}`
  )}`;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sección Izquierda: Imágenes */}
      <div>
        <img src={currentImage} alt={product.name} className="w-full h-96 object-cover mx-auto" />
        <div className="flex gap-2 mt-4">
            {product.images.map((img, index) => (
                <img key={index} src={img} alt="Miniatura"
                className="w-16 h-16 object-contain cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                onClick={() => setCurrentImage(img)}
                />
            ))}
        </div>
      </div>

      {/* Sección Derecha: Información del Producto */}
      <div>
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="text-blue-500 text-2xl font-semibold">${product.price.toFixed(2)}</p>

        {/* Tallas */}
        <div className="mt-4">
          <span className="font-semibold">Talla</span>
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 border rounded-lg ${
                    selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div className="mt-4">
          <span className="font-semibold">Color</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor.hex === color.hex ? "border-blue-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Cantidad y Botones */}
        <div className="flex items-center gap-4 mt-6">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-16 p-2 border rounded-lg text-center"
          />
          <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Add to cart
          </button>
          <BtnViaWhatsapp whatsappLink={whatsappLink} />
        </div>

        {/* Descripción */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold">Description</h3>
          <p className="text-gray-600 whitespace-pre-line mt-2">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;
