import { createContext, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    const iniciarSesion = (nombreUsuario) => setUsuario(nombreUsuario);
    const cerrarSesion = () => setUsuario(null);

    return (
        <SessionContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </SessionContext.Provider>
    );
};
