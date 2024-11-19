// Archivo: routes/patientRoutes.js
const express = require('express');
const {
  registerPatient,
  getPatient,
  updatePatient,
  deletePatient,
  getPrescriptions,
  addPrescription,
} = require('../controllers/patientController');
const { verifyToken, isDoctor } = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Rutas para gestión de pacientes
 */
/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Registrar un paciente (solo médicos pueden hacerlo)
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: number
 *               dui:
 *                 type: string
 *                 pattern: "/^\\d{8}-\\d$/"
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       201:
 *         description: Paciente registrado correctamente
 *       400:
 *         description: El DUI ya está registrado
 *       500:
 *         description: Error al registrar el paciente
 */
/**
 * @swagger
 * /patients/{dui}:
 *   get:
 *     summary: Obtener la información de un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: dui
 *         schema:
 *           type: string
 *         required: true
 *         description: DUI del paciente
 *     responses:
 *       200:
 *         description: Información del paciente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al obtener el paciente
 *   put:
 *     summary: Actualizar la información de un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: dui
 *         schema:
 *           type: string
 *         required: true
 *         description: DUI del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: number
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: Paciente actualizado correctamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al actualizar el paciente
 *   delete:
 *     summary: Eliminar un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: dui
 *         schema:
 *           type: string
 *         required: true
 *         description: DUI del paciente
 *     responses:
 *       200:
 *         description: Paciente eliminado correctamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al eliminar el paciente
 */
/**
 * @swagger
 * /patients/{dui}/prescriptions:
 *   get:
 *     summary: Obtener las recetas de un paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: dui
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
 *   post:
 *     summary: Agregar una receta para un paciente (solo médicos pueden hacerlo)
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: dui
 *         schema:
 *           type: string
 *         required: true
 *         description: DUI del paciente
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
 *       201:
 *         description: Receta agregada correctamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al agregar la receta
 */

const router = express.Router();

// Ruta para registrar un paciente (solo médicos pueden hacerlo)
router.post(
  '/',
  verifyToken,
  isDoctor,
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('dui').matches(/^\\d{8}-\\d$/).withMessage('Debe proporcionar un DUI válido (formato: ########-#)'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('emergencyContact.name').notEmpty().withMessage('El nombre del contacto de emergencia es obligatorio'),
    body('emergencyContact.phone').notEmpty().withMessage('El teléfono del contacto de emergencia es obligatorio'),
  ],
  registerPatient
);

// Ruta para obtener, actualizar o eliminar un paciente por DUI
router.route('/:dui')
  .get(verifyToken, getPatient)
  .put(
    verifyToken,
    isDoctor,
    [
      param('dui').matches(/^\\d{8}-\\d$/).withMessage('Debe proporcionar un DUI válido'),
      body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
      body('email').optional().isEmail().withMessage('Debe proporcionar un email válido'),
      body('age').optional().isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
      body('emergencyContact.name').optional().notEmpty().withMessage('El nombre del contacto de emergencia no puede estar vacío'),
      body('emergencyContact.phone').optional().notEmpty().withMessage('El teléfono del contacto de emergencia no puede estar vacío'),
    ],
    updatePatient
  )
  .delete(verifyToken, isDoctor, deletePatient);

// Ruta para obtener las recetas de un paciente especificado por DUI
router.get('/:dui/prescriptions', verifyToken, getPrescriptions);

// Ruta para agregar una receta para un paciente especificado por DUI (solo médicos pueden hacerlo)
router.post(
  '/:dui/prescriptions',
  verifyToken,
  isDoctor,
  [
    param('dui').matches(/^\\d{8}-\\d$/).withMessage('Debe proporcionar un DUI válido'),
    body('medicationName').notEmpty().withMessage('El nombre del medicamento es obligatorio'),
    body('dosage').notEmpty().withMessage('La dosis es obligatoria'),
    body('frequency').notEmpty().withMessage('La frecuencia es obligatoria'),
    body('duration').notEmpty().withMessage('La duración es obligatoria'),
  ],
  addPrescription
);

module.exports = router;
