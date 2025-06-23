import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciales incorrectas o error desconocido.');
      }

      const data = await response.json();
      console.log('Inicio de sesión exitoso - Datos recibidos:', data); // <-- Primer log

      const accessToken = data.access_token;
      localStorage.setItem('access_token', accessToken); 

      // --- Decodificar el token para extraer el rol ---
      const decodedToken = jwtDecode(accessToken);
      console.log('Token decodificado:', decodedToken); // <-- Segundo log
      
      const userRole = decodedToken.role; // Asumiendo que tu payload JWT tiene un campo 'role'
      console.log('Rol extraído del token:', userRole); // <-- Tercer log

      localStorage.setItem('user_role', userRole);

      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // --- Redirección basada en el rol ---
      let redirectTo;
      if (userRole === 'admin' || userRole === 'manager') {
        redirectTo = '/admin';
      } else if (userRole === 'client') {
        redirectTo = '/';
      } else {
        redirectTo = '/dashboard'; // Fallback
      }
      console.log('Redirigiendo a:', redirectTo); // <-- Cuarto log
      
      setTimeout(() => {
        navigate(redirectTo); 
      }, 1500);

    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... el resto de tu JSX es el mismo ...
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Éxito!</strong>
              <span className="block sm:inline"> {success}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta? {' '}
          <a href="/register" className="text-blue-600 hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;