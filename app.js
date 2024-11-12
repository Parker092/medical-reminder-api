// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerDocs } = require("./config/swagger"); // Importar Swagger
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicationConfirmationRoutes = require("./routes/medicationConfirmationRoutes");

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS para permitir solicitudes desde diferentes orígenes

// Configuración de Swagger en la ruta /api/docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medication-confirmations", medicationConfirmationRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conectado a la base de datos MongoDB"))
    .catch((error) => {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); // Salir si no se puede conectar a la base de datos
    });

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Manejar correctamente SIGTERM para detener el contenedor de Docker
process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Proceso terminado correctamente");
        mongoose.connection.close(false, () => {
            console.log("Conexión a MongoDB cerrada");
            process.exit(0);
        });
    });
});
