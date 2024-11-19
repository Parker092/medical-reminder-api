// Archivo: routes/medicationConfirmationRoutes.js
const express = require('express');
const { confirmMedication } = require('../controllers/medicationConfirmationController');
const { verifyToken, isPatient } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: MedicationConfirmations
 *   description: Rutas para confirmación de toma de medicamentos
 */
/**
 * @swagger
 * /medications/confirm:
 *   post:
 *     summary: Confirmar la toma de un medicamento
 *     tags: [MedicationConfirmations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescriptionId:
 *                 type: string
 *               patientDui:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [taken, missed]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Confirmación registrada correctamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al confirmar la toma de medicamento
 */
const router = express.Router();

// Ruta para confirmar la toma de un medicamento
router.post('/confirm', verifyToken, isPatient, confirmMedication);

module.exports = router;
