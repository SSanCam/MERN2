import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CrearUsuario = () => {
    const valorInicial = {
        nombre: '',
        apellido: '',
        edad: 18,
        telefono: '',
        correo: '',
        contrasenya: '',
        foto: ''
    };

    let { id } = useParams();
    const [usuario, setUsuario] = useState(valorInicial);
    const [foto, setFoto] = useState(null);
    const [subId, setSubId] = useState(id);

    // 🔹 Función para limpiar valores inseguros
    function limpiarCampo(valor) {
        if (typeof valor !== "string") return valor;
        let limpio = valor.trim();
        limpio = limpio.replace(/<script.*?>.*?<\/script>/gi, "");
        limpio = limpio.replace(/<\/?[^>]+(>|$)/g, "");
        limpio = limpio.replace(/['"\\;]/g, "");
        limpio = limpio.replace(/--/g, "");
        return limpio;
    }

    // 🔹 Capturar datos y limpiar antes de actualizar el estado
    const capturarDatos = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: limpiarCampo(value) });
    };

    const capturarFoto = (e) => {
        setFoto(e.target.files[0]);
    };

    // 🔹 Guardar usuario
    const guardarDatos = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(usuario).forEach(key => formData.append(key, usuario[key]));
        if (foto) formData.append('foto', foto);

        try {
            await axios.post('https://mern-5pjx.onrender.com/api/usuarios', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUsuario({ ...valorInicial });
            setFoto(null);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    };

    // 🔹 Actualizar usuario
    const actualizarUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(usuario).forEach(key => formData.append(key, usuario[key]));
        if (foto) formData.append('foto', foto);

        try {
            await axios.put(`https://mern-5pjx.onrender.com/api/usuarios/${subId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUsuario({ ...valorInicial });
            setFoto(null);
            setSubId('');
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
        }
    };

    // 🔹 Obtener usuario si se está editando
    useEffect(() => {
        if (subId) {
            axios.get(`https://mern-5pjx.onrender.com/api/usuarios/${subId}`)
                .then(res => {
                    setUsuario({
                        nombre: res.data.nombre,
                        apellido: res.data.apellido,
                        edad: res.data.edad,
                        telefono: res.data.telefono,
                        correo: res.data.correo,
                        contrasenya: res.data.contrasenya
                    });
                })
                .catch(error => console.error('Error al obtener el usuario:', error));
        }
    }, [subId]);

    return (
        <div className="col-md-6 offset-md-3">
            <div className="card card-body">
                <form onSubmit={guardarDatos}>
                    <h2 className="text-center mb-3">Crear Socio</h2>
                    <div className="mb-3">
                        <label>Nombre:</label>
                        <input type="text" className="form-control" required name="nombre" value={usuario.nombre} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Apellido:</label>
                        <input type="text" className="form-control" required name="apellido" value={usuario.apellido} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Edad:</label>
                        <input type="number" className="form-control" required name="edad" value={usuario.edad} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Teléfono:</label>
                        <input type="text" className="form-control" required name="telefono" value={usuario.telefono} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Correo:</label>
                        <input type="email" className="form-control" required name="correo" value={usuario.correo} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Contraseña:</label>
                        <input type="password" className="form-control" required name="contrasenya" value={usuario.contrasenya} onChange={capturarDatos} />
                    </div>
                    <div className="mb-3">
                        <label>Foto:</label>
                        <input type="file" className="form-control" accept="image/*" onChange={capturarFoto} />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-dark">Guardar</button>
                    </div>
                </form>
                <form onSubmit={actualizarUser} className='text-center'>
                    <button className="btn btn-dark mt-2">Actualizar</button>
                </form>
            </div>
        </div>
    );
};

export default CrearUsuario;
