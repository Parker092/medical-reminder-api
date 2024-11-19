// Archivo: routes/prescriptionRoutes.js
const express = require('express');
const { getPrescriptions, createPrescription, updatePrescription, deletePrescription } = require('../controllers/prescriptionController');
const { verifyToken, isDoctor } = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Rutas para gestión de recetas médicas
 */
/**
 * @swagger
 * /prescriptions/{patientDui}:
 *   get:
 *     summary: Obtener todas las recetas de un paciente
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: patientDui
 *         schema:
 *           type: string
 *         required: true
 *         description: DUI del paciente
 *     responses:
 *       200:
 *         description: Lista de recetas
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al obtener las recetas
 */
const router = express.Router();

// Ruta para obtener todas las recetas de un paciente por DUI
router.get(
    '/:patientDui',
    verifyToken,
    [
        param('patientDui').matches(/^\\d{8}-\\d$/).withMessage('Debe proporcionar un DUI válido (formato: ########-#)'),
    ],
    getPrescriptions
);

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Crear una nueva receta para un paciente
 *     tags: [Prescriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientDui:
 *                 type: string
 *               medicationName:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               duration:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Receta creada correctamente
 *       500:
 *         description: Error al crear la receta
 */
// Ruta para crear una nueva receta para un paciente
router.post(
    '/',
    verifyToken,
    isDoctor,
    [
        body('patientDui').matches(/^\\d{8}-\\d$/).withMessage('Debe proporcionar un DUI válido (formato: ########-#)'),
        body('medicationName').notEmpty().withMessage('El nombre del medicamento es obligatorio'),
        body('dosage').notEmpty().withMessage('La dosis es obligatoria'),
        body('frequency').notEmpty().withMessage('La frecuencia es obligatoria'),
        body('duration').notEmpty().withMessage('La duración es obligatoria'),
    ],
    createPrescription
);

/**
 * @swagger
 * /prescriptions/{prescriptionId}:
 *   put:
 *     summary: Actualizar una receta existente
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la receta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicationName:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               duration:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Receta actualizada correctamente
 *       404:
 *         description: Receta no encontrada
 *       500:
 *         description: Error al actualizar la receta
 */
// Ruta para actualizar una receta existente
router.put(
    '/:prescriptionId',
    verifyToken,
    isDoctor,
    [
        param('prescriptionId').isMongoId().withMessage('El ID de la receta no es válido'),
        body('medicationName').optional().notEmpty().withMessage('El nombre del medicamento no puede estar vacío'),
        body('dosage').optional().notEmpty().withMessage('La dosis no puede estar vacía'),
        body('frequency').optional().notEmpty().withMessage('La frecuencia no puede estar vacía'),
        body('duration').optional().notEmpty().withMessage('La duración no puede estar vacía'),
    ],
    updatePrescription
);

/**
 * @swagger
 * /prescriptions/{prescriptionId}:
 *   delete:
 *     summary: Eliminar una receta
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Receta eliminada correctamente
 *       404:
 *         description: Receta no encontrada
 *       500:
 *         description: Error al eliminar la receta
 */
// Ruta para eliminar una receta
router.delete(
    '/:prescriptionId',
    verifyToken,
    isDoctor,
    [
        param('prescriptionId').isMongoId().withMessage('El ID de la receta no es válido'),
    ],
    deletePrescription
);

module.exports = router;
