// Archivo: controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Obtener todas las recetas de un paciente
exports.getPrescriptions = async (req, res) => {
    try {
        const { patientDui } = req.params;
        const patient = await Patient.findOne({ dui: patientDui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const prescriptions = await Prescription.find({ patient: patient._id }).populate('doctor', 'name');
        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las recetas', error: error.message });
    }
};

// Crear una nueva receta para un paciente
exports.createPrescription = [
    [
        check('patientDui').matches(/^\\d{8}-\\d$/).withMessage('El DUI debe tener el formato 00000000-0'),
        check('medicationName').notEmpty().withMessage('El nombre del medicamento es obligatorio'),
        check('dosage').notEmpty().withMessage('La dosis es obligatoria'),
        check('frequency').notEmpty().withMessage('La frecuencia es obligatoria'),
        check('duration').isInt({ min: 1 }).withMessage('La duración debe ser un número positivo')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { patientDui, medicationName, dosage, frequency, duration, notes } = req.body;

        try {
            // Verificar si el paciente existe
            const patient = await Patient.findOne({ dui: patientDui });
            if (!patient) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }

            // Verificar si el usuario autenticado es un médico
            const doctorDui = req.user.dui;
            const doctor = await User.findOne({ dui: doctorDui });
            if (doctor.role !== 'doctor') {
                return res.status(403).json({ message: 'Acceso denegado. Solo los médicos pueden crear recetas.' });
            }

            // Crear la receta
            const prescription = await Prescription.create({
                patient: patient._id,
                doctor: doctor._id,
                medicationName,
                dosage,
                frequency,
                duration,
                notes
            });

            res.status(201).json({ message: 'Receta creada correctamente', prescription });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la receta', error: error.message });
        }
    }
];

// Actualizar una receta existente
exports.updatePrescription = [
    [
        check('medicationName').optional().notEmpty().withMessage('El nombre del medicamento no puede estar vacío'),
        check('dosage').optional().notEmpty().withMessage('La dosis no puede estar vacía'),
        check('frequency').optional().notEmpty().withMessage('La frecuencia no puede estar vacía'),
        check('duration').optional().isInt({ min: 1 }).withMessage('La duración debe ser un número positivo')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { prescriptionId } = req.params;
        const updateData = req.body;

        try {
            const prescription = await Prescription.findByIdAndUpdate(prescriptionId, updateData, { new: true });
            if (!prescription) {
                return res.status(404).json({ message: 'Receta no encontrada' });
            }
            res.status(200).json({ message: 'Receta actualizada correctamente', prescription });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la receta', error: error.message });
        }
    }
];

// Eliminar una receta
exports.deletePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;

        const prescription = await Prescription.findByIdAndDelete(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }
        res.status(200).json({ message: 'Receta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la receta', error: error.message });
    }
};