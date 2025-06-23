// ProductList.jsx
import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Productos Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/*
          ⚠️ CORRECCIÓN AQUÍ: Este bloque de código estaba intentando renderizar
          una imagen fuera del bucle de mapeo, lo cual era incorrecto
          porque 'products' es un array, no un producto individual en este punto.
          Ha sido ELIMINADO para simplificar ProductList.
        */}
        {/*
        {products.image_url ? (
          <img
            src={getImageUrl(products.image_url)}
            alt={products.nombre}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-500 text-xs text-center">Sin imagen</span>
          </div>
        )}
        */}

        {(products || []).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;