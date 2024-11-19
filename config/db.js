// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Agregar esta línea

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error(`Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;