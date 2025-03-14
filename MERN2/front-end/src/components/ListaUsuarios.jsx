import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListaUsuarios = () => {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const getUsuarios = async () => {
      try {
        const res = await axios.get("https://mern-5pjx.onrender.com/api/usuarios");
        setLista(res.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    getUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`https://mern-5pjx.onrender.com/api/usuarios/${id}`);
      setLista(prevLista => prevLista.filter(usuario => usuario._id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="row">
      {lista.map((usuario) => (
        <div className="col-md-4 p-2" key={usuario._id}>
          <div className="card">
            <img
              src={usuario.foto}
              alt={`Foto de ${usuario.nombre}`}
              className="card-img img-fluid img-thumbnail w-50 mx-auto d-block"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />

            <div className="card-header text-center">
              <h5>{usuario.nombre}</h5>
            </div>
            <div className="card-body">
              <p>Apellidos: {usuario.apellido}</p>
              <p>Edad: {usuario.edad}</p>
              <p>Teléfono: {usuario.telefono}</p>
              <p>Correo: {usuario.correo}</p>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-dark mx-1" onClick={() => eliminarUsuario(usuario._id)}>
                Eliminar
              </button>
              <Link to={`/edit/${usuario._id}`} className="btn btn-dark mx-1">
                Editar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaUsuarios;
