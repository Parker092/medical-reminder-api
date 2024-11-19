// Archivo: controllers/notificationController.js
const Notification = require('../models/Notification');
const Patient = require('../models/Patient');
const { check, validationResult } = require('express-validator');

// Enviar una notificación de recordatorio de medicamento
exports.sendNotification = [
    [
        check('patientDui').matches(/^\\d{8}-\\d$/).withMessage('El DUI debe tener el formato 00000000-0'),
        check('title').notEmpty().withMessage('El título es obligatorio'),
        check('message').notEmpty().withMessage('El mensaje es obligatorio')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { patientDui, title, message } = req.body;

        try {
            // Verificar si el paciente existe
            const patient = await Patient.findOne({ dui: patientDui });
            if (!patient) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }

            // Crear la notificación
            const notification = await Notification.create({
                patient: patient._id,
                title,
                message
            });

            // Lógica para enviar la notificación (aquí solo se simula el envío)
            console.log(`Enviando notificación a ${patient.name}: ${title} - ${message}`);

            res.status(200).json({ message: 'Notificación enviada correctamente', notification });
        } catch (error) {
            res.status(500).json({ message: 'Error al enviar la notificación', error: error.message });
        }
    }
];
