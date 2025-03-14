require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('mongoose');

// Verificar que MONGODB_URI se está cargando
console.log("Conectando a:", process.env.MONGODB_URI);

// Cadena de conexión
const URI = process.env.MONGODB_URI;
// const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/mern_login';


mongoose.connect(URI)
    .then(() => console.log('La base de datos ha sido conectada: '))
    .catch(error => console.error('Error al conectar con la base de datos:', error));


// const connection = mongoose.connection;
// connection.once('open', ()=>{
//     console.log('La base de datos ha sido conectada: ', URI);
// });