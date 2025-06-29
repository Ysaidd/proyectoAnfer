import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <button onClick={logout} className="btn btn--danger">
        Cerrar sesión
        </button>
    );
};

export default LogoutButton;
