import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SessionContext } from "../context/SessionContext";

const Login = () => {
    const { iniciarSesion } = useContext(SessionContext);
    const [correo, setCorreo] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    const navigate = useNavigate();

    const manejarInicio = async () => {
        try {
            const res = await axios.post("https://mern-5pjx.onrender.com/api/usuarios/login", {
                correo,
                password: contrasenya,
            });

            if (res.status === 200) {
                iniciarSesion(res.data.usuario);
                navigate("/usuarios");
            }
        } catch {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="contenedor">
            <h1>Iniciar sesión</h1>
            <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contrasenya}
                onChange={(e) => setContrasenya(e.target.value)}
            />
            <button onClick={manejarInicio}>Entrar</button>
        </div>
    );
};

export default Login;
