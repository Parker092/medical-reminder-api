// Archivo: controllers/medicationConfirmationController.js
const MedicationConfirmation = require('../models/MedicationConfirmation');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const { check, validationResult } = require('express-validator');

// Confirmar la toma de un medicamento
exports.confirmMedication = [
    [
        check('prescriptionId').notEmpty().withMessage('El ID de la receta es obligatorio'),
        check('patientDui').matches(/^\\d{8}-\\d$/).withMessage('El DUI debe tener el formato 00000000-0'),
        check('status').isIn(['taken', 'missed']).withMessage('El estado debe ser taken o missed'),
        check('notes').optional().isString().withMessage('Las notas deben ser una cadena de texto')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { prescriptionId, patientDui, status, notes } = req.body;

        try {
            // Verificar si el paciente existe
            const patient = await Patient.findOne({ dui: patientDui });
            if (!patient) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }

            // Verificar si la receta existe
            const prescription = await Prescription.findById(prescriptionId);
            if (!prescription) {
                return res.status(404).json({ message: 'Receta no encontrada' });
            }

            // Crear la confirmación de la toma del medicamento
            const confirmation = await MedicationConfirmation.create({
                prescription: prescription._id,
                patient: patient._id,
                status,
                notes
            });

            res.status(201).json({ message: 'Confirmación registrada correctamente', confirmation });
        } catch (error) {
            res.status(500).json({ message: 'Error al confirmar la toma de medicamento', error: error.message });
        }
    }
];
