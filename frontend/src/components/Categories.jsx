import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { Link } from "react-router-dom"; // <-- import Link

const API_URL = import.meta.env.VITE_API_URL; // Nueva constante para la URL de la API

const Categories = () => {
  const categories = [
    {
      title: "Caballero",
      image: "/images/prueba.jpg",
      link: "/products/",
      description: "Estilo elegante y moderno",
      icon: "👔"
    },
    {
      title: "Juvenil",
      image: "/images/prueba.jpg",
      link: "/products/",
      description: "Tendencias frescas",
      icon: "👕"
    },
    {
      title: "Accesorios",
      image: "/images/prueba.jpg",
      link: "/products/",
      description: "Detalles que marcan la diferencia",
      icon: "👜"
    },
    {
      title: "Personalizar",
      image: "/images/prueba.jpg",
      link: "/products/",
      description: "Crea tu estilo único",
      icon: "🎨"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fetchCategories = async () => {
    const response = await fetch(`${API_URL}/categories`); // Llamada a la API actualizada
    const data = await response.json();
    return data;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Explora Nuestras Categorías
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encuentra el estilo perfecto para cada ocasión
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Wrap CategoryCard with Link passing category as query param */}
            <Link
              to={`/products?category=${encodeURIComponent(cat.title)}`}
              className="block"
            >
              <CategoryCard {...cat} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
