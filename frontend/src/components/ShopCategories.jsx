// src/pages/StorePage.jsx
import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";

const ITEMS_PER_PAGE = 6;

const StorePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const [productRes, categoryRes] = await Promise.all([
        fetch("http://localhost:8000/products"),
        fetch("http://localhost:8000/categorias")
      ]);
      const [productData, categoryData] = await Promise.all([
        productRes.json(),
        categoryRes.json()
      ]);
      setProducts(productData);
      setFilteredProducts(productData);
      setCategories(categoryData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;
  
    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        const productCategory = typeof p.category === "string" ? p.category : p.category?.name;
        return productCategory === selectedCategory;
      });
    }
  
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, searchTerm]);
  

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex max-w-6xl mx-auto min-h-[70vh]">
      <aside className="w-3/8 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={`cursor-pointer ${selectedCategory === cat.name ? "font-bold" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name} {cat.count ? `(${cat.count})` : ""}
            </li>
          ))}
        </ul>
      </aside>

      <main className="w-5/5 p-4">
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
