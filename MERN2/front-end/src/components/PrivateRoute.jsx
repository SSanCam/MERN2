import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";

// Redirige a la página de inicio de sesión si no hay un usuario autenticado
const PrivateRoute = ({ children }) => {
    const { usuario } = useContext(SessionContext);
    return usuario ? children : <Navigate to="/" />;
};

export default PrivateRoute;
