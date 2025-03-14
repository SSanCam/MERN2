const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const usuarioCtrl = require("../controller/usuario.controller");

const imgDir = path.join(__dirname, "../img");

// **Verificar que la carpeta "img" existe, si no, crearla**
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// **Configurar almacenamiento con Multer**
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, imgDir); // Guardar en la carpeta "img"
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname); // Extraer la extensión del archivo
    const nombre = req.body.nombre
      ? req.body.nombre.replace(/\s+/g, "")
      : "usuario";
    const nombreFoto = `${nombre}_${Date.now()}${extension}`; // Generar nombre único
    req.body.nombreFoto = nombreFoto; // Guardar el nombre en `req.body`
    callback(null, nombreFoto); // Asignar el nombre de archivo
  },
});

// **Restringir el tipo de archivo a imágenes**
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(
        new Error("Solo se permiten imágenes en formato JPEG, JPG o PNG")
      );
    }
  },
});

const router = Router();

// **Rutas**
router.get("/", usuarioCtrl.getUsu);
router.post("/", upload.single("foto"), usuarioCtrl.createUsu);
router.get("/:id", usuarioCtrl.getUsuario);
router.put("/:id", upload.single("foto"), usuarioCtrl.updateUsu);
router.delete("/:id", usuarioCtrl.deleteUsu);
router.post('/login', usuarioCtrl.loginUsu);

module.exports = router;
