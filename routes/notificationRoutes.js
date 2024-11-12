// Archivo: routes/notificationRoutes.js
const express = require('express');
const { sendNotification } = require('../controllers/notificationController');
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Rutas para el envío de notificaciones
 */
/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Enviar una notificación de recordatorio de medicamento
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientDui:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificación enviada correctamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al enviar la notificación
 */
const router = express.Router();

// Ruta para enviar una notificación de recordatorio de medicamento
router.post('/send', sendNotification);

module.exports = router;