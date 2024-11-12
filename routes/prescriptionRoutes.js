// Archivo: routes/prescriptionRoutes.js
const express = require('express');
const { getPrescriptions, createPrescription, updatePrescription, deletePrescription } = require('../controllers/prescriptionController');
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
router.get('/:patientDui', getPrescriptions);

// Ruta para crear una nueva receta para un paciente
router.post('/', createPrescription);

// Ruta para actualizar una receta existente
router.put('/:prescriptionId', updatePrescription);

// Ruta para eliminar una receta
router.delete('/:prescriptionId', deletePrescription);

module.exports = router;