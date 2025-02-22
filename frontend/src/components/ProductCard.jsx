import React from "react";
import BtnViaWhatsapp from "./BtnVIaWhatsapp";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  const whatsappLink = `https://wa.me/584247347724?text=${encodeURIComponent(
    `Hola, quiero comprar: ${product.name} - Precio: $${product.price}`
  )}`;

  return (
    <div className="border rounded-lg p-4 shadow-lg text-center ">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mx-auto cursor-pointer" onClick={() => navigate(`/product/${product.id}`)} />
      <h3 className="font-semibold mt-3" onClick={() => navigate(`/products/${product.id}`)}>{product.name}</h3>
      <p className="pb-3 text-blue-600 font-bold">${product.price.toFixed(2)}</p>
      <BtnViaWhatsapp whatsappLink={whatsappLink} />
    </div>
  );
};

export default ProductCard;
