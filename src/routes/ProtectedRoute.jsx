import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('user');
    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    return children;
}

export default ProtectedRoute;
