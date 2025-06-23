import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Crear el Contexto (sigue siendo exportación nombrada)
export const AuthContext = createContext(null);

// 2. Crear el Proveedor del Contexto (AuthContextProvider)
// ¡AHORA ES LA EXPORTACIÓN POR DEFECTO!
const AuthContextProvider = ({ children }) => { // Removido 'export' de aquí
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('access_token', token);

    try {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
      localStorage.setItem('user_role', decodedToken.role);
    } catch (error) {
      console.error("Error al decodificar el token JWT durante el login:", error);
      logout();
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('user_role');

    if (storedToken && storedRole) {
      try {
        const decodedToken = jwtDecode(storedToken);
        // Opcional: Aquí puedes añadir una verificación de expiración del token
        // if (decodedToken.exp * 1000 < Date.now()) {
        //   console.log("Token expirado.");
        //   logout();
        // } else {
          setAuthToken(storedToken);
          setUserRole(storedRole);
        // }
      } catch (error) {
        console.error("Error al decodificar token JWT almacenado:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const authContextValue = {
    authToken,
    userRole,
    isAuthenticated: !!authToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider; // <--- Exportación por defecto para el proveedor

// 3. Crear un Custom Hook para un uso más fácil (sigue siendo exportación nombrada)
export const useAuth = () => {
  return useContext(AuthContext);
};