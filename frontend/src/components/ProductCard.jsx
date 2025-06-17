import React from "react";
import BtnViaWhatsapp from "./BtnVIaWhatsapp";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

  const navigate = useNavigate();



  return (
    <div className="border rounded-lg p-4 shadow-lg text-center ">
      <img src={`http://localhost:8000/${product.image_url}`} alt={product.name} className="w-full h-64 object-cover mx-auto cursor-pointer" onClick={() => navigate(`/product/${product.id}`)} />
      <h3 className="font-semibold mt-3" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
      <p className="pb-3 text-blue-600 font-bold">${product.precio.toFixed(2)}</p>
      <button className="w-full block bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition text-center" onClick={() => navigate(`/product/${product.id}`)}>Ver Producto</button>
    </div>
  );
};

export default ProductCard;
