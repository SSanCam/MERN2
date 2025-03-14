import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CrearUsuario from "./components/CrearUsuario";
import ListaUsuarios from "./components/ListaUsuarios";
import Login from "./components/Login";
import Navegacion from "./components/Navegacion";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Navegacion />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crearUsuario" element={<CrearUsuario />} />
        <Route path="/usuarios" element={
          <PrivateRoute>
            <ListaUsuarios />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
