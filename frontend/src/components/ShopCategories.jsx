import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";

const categories = [
    { name: "Accesorios", count: 16 },
    { name: "Caballero", count: 298 },
    { name: "Dama", count: 68 },
    { name: "Calzados", count: 67 },
    { name: "Pantalones", count: 38 }
];

const products = [
    { id: 1, name: "Calzado Dama Style D-7545-2", price: 30, image: "/images/prueba.jpg", category: "Pantalones" },
    { id: 2, name: "Calzado Dama Style D-7545-3", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 3, name: "Calzado Dama Style D-7545-7", price: 30, image: "/images/prueba.jpg", category: "Pantalones" },
    { id: 4, name: "Calzado Dama Style D-7545-2", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 5, name: "Calzado Dama Style D-7545-3", price: 30, image: "/images/prueba.jpg", category: "Accesorios" },
    { id: 6, name: "Calzado Dama Style D-7545-7", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 7, name: "buscar", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 8, name: "Calzado Dama Style D-7545-3", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 9, name: "Calzado Dama Style D-7545-7", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 10, name: "Calzado Dama Style D-7545-2", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 11, name: "Calzado Dama Style D-7545-3", price: 30, image: "/images/prueba.jpg", category: "Dama" },
    { id: 12, name: "Calzado Dama Style D-7545-7", price: 30, image: "/images/prueba.jpg", category: "Dama" },
];

const ITEMS_PER_PAGE = 6;

const StorePage = () => {
const [selectedCategory, setSelectedCategory] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [filteredProducts, setFilteredProducts] = useState(products);
const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex max-w-6xl mx-auto min-h-[70vh] ">
      <aside className="w-3/8 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={`cursor-pointer ${selectedCategory === cat.name ? "font-bold" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name} ({cat.count})
            </li>
          ))}
        </ul>
      </aside>
      <main className="w-5/5 p-4" >
      <div className="flex justify-between items-center mb-4 p-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="border p-2 w-3/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 w-2/5 rounded bg-indigo-600 text-white hover:bg-indigo-900 transition"
          onClick={() => {
            setSelectedCategory(null);
            setSearchTerm("");
          }}
        >
          Resetear filtros
        </button>
      </div>

        <ProductList products={paginatedProducts} />
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="mx-2 px-3 py-1 border rounded"
          >
            ⬅️ Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? "font-bold" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="mx-2 px-3 py-1 border rounded"
          >
            Siguiente ➡️
          </button>
        </div>
      </main>
    </div>
  );
};

export default StorePage;
