// Archivo: controllers/patientController.js
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Registrar un paciente
exports.registerPatient = [
    [
        check('name').notEmpty().withMessage('El nombre es obligatorio'),
        check('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
        check('age').isInt({ min: 0 }).withMessage('La edad debe ser un número válido'),
        check('dui').matches(/^\\d{8}-\\d$/).withMessage('El DUI debe tener el formato 00000000-0'),
        check('emergencyContact.name').notEmpty().withMessage('El nombre del contacto de emergencia es obligatorio'),
        check('emergencyContact.phone').notEmpty().withMessage('El teléfono del contacto de emergencia es obligatorio')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, name, email, age, dui, emergencyContact } = req.body;

        try {
            // Verificar si el DUI ya existe
            const existingPatient = await User.findOne({ dui });
            if (existingPatient) {
                return res.status(400).json({ message: 'El DUI ya está registrado' });
            }

            const patient = await Patient.create({ user: userId, name, email, age, dui, emergencyContact });
            res.status(201).json({ message: 'Paciente registrado correctamente', patient });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el paciente', error: error.message });
        }
    }
];

// Obtener las recetas de un paciente
exports.getPrescriptions = async (req, res) => {
    try {
        const { dui } = req.params;
        const patient = await Patient.findOne({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const prescriptions = await Prescription.find({ patient: patient._id }).populate('doctor', 'name');
        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las recetas', error: error.message });
    }
};

// Agregar una receta para un paciente
exports.addPrescription = [
    [
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

        const { dui } = req.params;
        const { medicationName, dosage, frequency, duration, notes } = req.body;

        try {
            // Verificar si el paciente existe por DUI
            const patient = await Patient.findOne({ dui });
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

            res.status(201).json({ message: 'Receta agregada correctamente', prescription });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar la receta', error: error.message });
        }
    }
];

// Obtener un paciente por DUI
exports.getPatient = async (req, res) => {
    try {
        const { dui } = req.params;
        const patient = await Patient.findOne({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.status(200).json({ patient });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el paciente', error: error.message });
    }
};

// Actualizar un paciente por DUI
exports.updatePatient = [
    [
        check('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
        check('email').optional().isEmail().withMessage('Debe ser un correo electrónico válido'),
        check('age').optional().isInt({ min: 0 }).withMessage('La edad debe ser un número válido'),
        check('emergencyContact.name').optional().notEmpty().withMessage('El nombre del contacto de emergencia no puede estar vacío'),
        check('emergencyContact.phone').optional().notEmpty().withMessage('El teléfono del contacto de emergencia no puede estar vacío')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { dui } = req.params;
        const updateData = req.body;

        try {
            // Verificar si el paciente existe por DUI
            const patient = await Patient.findOneAndUpdate({ dui }, updateData, { new: true });
            if (!patient) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.status(200).json({ message: 'Paciente actualizado correctamente', patient });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el paciente', error: error.message });
        }
    }
];

// Eliminar un paciente por DUI
exports.deletePatient = async (req, res) => {
    try {
        const { dui } = req.params;

        // Verificar si el paciente existe por DUI
        const patient = await Patient.findOneAndDelete({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.status(200).json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el paciente', error: error.message });
    }
};
