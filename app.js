// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const { swaggerUi, swaggerDocs } = require("./config/swagger"); // Importar Swagger
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicationConfirmationRoutes = require("./routes/medicationConfirmationRoutes");
const Notification = require("./models/Notification");
const Patient = require("./models/Patient");

const app = express();
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: "http://localhost:3000", // Reemplazar con el dominio de tu frontend
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Habilitar CORS con opciones específicas

// Middleware de Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 peticiones por IP por cada 15 minutos
    message: "Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos.",
});
app.use(limiter);

// Aplicar Rate Limiting específico a las rutas de autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limite de 5 solicitudes por IP por cada 15 minutos
    message: "Demasiados intentos de inicio de sesión, por favor intente nuevamente después de 15 minutos.",
});
app.use("/api/auth", authLimiter);

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

// Configurar Cron Job para enviar notificaciones de recordatorio
cron.schedule("0 9 * * *", async () => {
    try {
        // Buscar pacientes y enviar notificaciones de recordatorio
        const patients = await Patient.find();
        patients.forEach(async (patient) => {
            // Crear la notificación
            const notification = new Notification({
                patient: patient._id,
                title: "Recordatorio de Medicamento",
                body: "Recuerde tomar su medicamento según la prescripción médica.",
                date: new Date(),
            });
            await notification.save();

            // Simulación de envío de notificación
            console.log(`Notificación enviada a ${patient.name}`);
        });
    } catch (error) {
        console.error("Error al enviar notificaciones: ", error);
    }
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
