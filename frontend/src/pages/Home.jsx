import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";

const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
   
        fetch(`${API_URL}/products?limit=3`)  // Llamada a la API actualizada
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);  // Guardar los productos en el estado
            })
            .catch((error) => console.error("Error al obtener productos:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
            {/* Hero Section con Carousel */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                <Carousel />
            </motion.section>

            {/* Categories Section */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="py-16 bg-white"
            >
                <Categories />
            </motion.section>

            {/* Featured Products Section */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="py-16 bg-gradient-to-br from-gray-50 to-white"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Productos Destacados
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Descubre nuestra selección de productos más populares
                        </p>
                    </motion.div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <ProductList products={products} />
                    )}
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-8"
                >
                    <BtnVerTienda link="/productos" />
                </motion.div>
            </motion.section>

            {/* Banner Section */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="relative"
            >
                <Banner />
            </motion.section>
        </div>
    );
};

export default Home;
