import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Calzado Dama Style D-7545-2",
    price: 30.0,
    image: "/images/prueba.jpg",
  },
  {
    id: 2,
    name: "Calzado Dama Style D-7545-3",
    price: 30.0,
    image: "/images/prueba.jpg",
  },
  {
    id: 3,
    name: "Calzado Dama Style D-7545-7",
    price: 30.0,
    image: "/images/prueba.jpg",
  },
];

const ProductList = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Productos Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
