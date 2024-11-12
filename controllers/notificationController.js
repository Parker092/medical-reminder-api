// Archivo: controllers/notificationController.js
const Patient = require('../models/Patient');
const NotificationService = require('../services/notificationService');

// Enviar una notificación de recordatorio de medicamento
exports.sendNotification = async (req, res) => {
    try {
        const { patientDui, message } = req.body;
        const patient = await Patient.findOne({ dui: patientDui }).populate('user', 'email');
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        await NotificationService.sendNotification(patient.user.email, message);
        res.status(200).json({ message: 'Notificación enviada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar la notificación', error });
    }
};