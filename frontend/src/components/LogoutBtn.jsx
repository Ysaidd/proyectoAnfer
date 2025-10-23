import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <motion.button 
            onClick={logout} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="text-lg">🚪</span>
            <span>Cerrar Sesión</span>
        </motion.button>
    );
};

export default LogoutButton;
