import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CategoryCard = ({ image, title, link, description, icon }) => {  
    return (
        <Link to={link} className="group block">
          <motion.div 
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-105"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="absolute top-4 right-4 text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {description}
              </p>
              
              {/* CTA Button */}
              <motion.div
                className="inline-flex items-center text-indigo-600 font-semibold text-sm group-hover:text-indigo-700 transition-colors duration-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Explorar
                <svg 
                  className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </Link>
      );
}

export default CategoryCard;