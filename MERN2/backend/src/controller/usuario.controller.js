const usuarioCtrl = {};
const Usuario = require("../models/usuario");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

// Listar usuarios
usuarioCtrl.getUsu = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    const usuariosConFoto = usuarios.map((usuario) => ({
      ...usuario._doc,
      foto: usuario.foto
        ? `https://mern-5pjx.onrender.com/img/${usuario.foto}`
        : `https://mern-5pjx.onrender.com/img/noFoto.png`, // Imagen por defecto si no hay foto
    }));
    res.json(usuariosConFoto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// Crear un usuario
usuarioCtrl.createUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad, contrasenya } = req.body;

    if (!nombre || !correo || !apellido || !telefono || !contrasenya) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const nombreFoto = req.body.nombreFoto || "noFoto.png"; // Usa el nombre de la foto generado por multer

    // Hashear la contraseña con bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(contrasenya, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo,
      telefono,
      edad,
      password: passwordHash,
      foto: nombreFoto,
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado", usuario: usuarioGuardado });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Buscar un usuario
usuarioCtrl.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Borrar usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // Eliminar la foto del servidor si existe
    if (usuario.foto && usuario.foto !== "noFoto.png") {
      try {
        const filePath = path.join(__dirname, "../img", usuario.foto);
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error al eliminar la foto:", err);
      }
    }

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

// Actualizar un usuario
usuarioCtrl.updateUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad, contrasenya } = req.body;
    let passwordHash = undefined;

    if (contrasenya) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(contrasenya, salt);
    }

    const foto = req.file ? req.body.nombreFoto : undefined; // Captura la foto si existe

    // Buscar el usuario actual para obtener la foto antigua
    const usuarioActual = await Usuario.findById(req.params.id);
    if (!usuarioActual) return res.status(404).json({ message: "Usuario no encontrado" });

    // Eliminar la foto antigua del servidor si existe y si se ha subido una nueva foto
    if (foto && usuarioActual.foto && usuarioActual.foto !== "noFoto.png") {
      try {
        const filePath = path.join(__dirname, "../img", usuarioActual.foto);
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error al eliminar la foto antigua:", err);
      }
    }

    // Encuentra y actualiza el usuario
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        apellido,
        correo,
        telefono,
        edad,
        ...(passwordHash && { password: passwordHash }),
        ...(foto && { foto }),
      },
      { new: true }
    );

    res.json({ message: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

// Login
usuarioCtrl.loginUsu = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

module.exports = usuarioCtrl;
