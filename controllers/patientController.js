// Archivo: controllers/patientController.js
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// Registrar un paciente
exports.registerPatient = async (req, res) => {
    try {
        const { userId, name, email, age, dui, emergencyContact } = req.body;

        // Verificar si el DUI ya existe
        const existingPatient = await User.findOne({ dui });
        if (existingPatient) {
            return res.status(400).json({ message: 'El DUI ya está registrado' });
        }

        const patient = await Patient.create({ user: userId, name, email, age, dui, emergencyContact });
        res.status(201).json({ message: 'Paciente registrado correctamente', patient });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el paciente', error });
    }
};

// Obtener las recetas de un paciente
exports.getPrescriptions = async (req, res) => {
    try {
        const { dui } = req.params;
        const patient = await Patient.findOne({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Verificar si el usuario autenticado es el paciente o un médico
        if (req.user.role !== 'patient' && req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Acceso denegado. Solo pacientes o médicos pueden ver las recetas.' });
        }

        const prescriptions = await Prescription.find({ patient: patient._id }).populate('doctor', 'name');
        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las recetas', error });
    }
};

// Agregar una receta para un paciente
exports.addPrescription = async (req, res) => {
    try {
        const { dui } = req.params;
        const { medicationName, dosage, frequency, duration, notes } = req.body;

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
            notes,
        });

        res.status(201).json({ message: 'Receta agregada correctamente', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la receta', error });
    }
};

// Obtener un paciente por DUI
exports.getPatient = async (req, res) => {
    try {
        const { dui } = req.params;
        const patient = await Patient.findOne({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Verificar si el usuario autenticado es el paciente o un médico
        if (req.user.role !== 'patient' && req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Acceso denegado. Solo pacientes o médicos pueden ver esta información.' });
        }

        res.status(200).json({ patient });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el paciente', error });
    }
};

// Actualizar un paciente por DUI
exports.updatePatient = async (req, res) => {
    try {
        const { dui } = req.params;
        const updateData = req.body;

        // Verificar si el usuario autenticado es un médico
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los médicos pueden actualizar la información de un paciente.' });
        }

        // Verificar si el paciente existe por DUI
        const patient = await Patient.findOneAndUpdate({ dui }, updateData, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.status(200).json({ message: 'Paciente actualizado correctamente', patient });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el paciente', error });
    }
};

// Eliminar un paciente por DUI
exports.deletePatient = async (req, res) => {
    try {
        const { dui } = req.params;

        // Verificar si el usuario autenticado es un médico
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los médicos pueden eliminar un paciente.' });
        }

        // Verificar si el paciente existe por DUI
        const patient = await Patient.findOneAndDelete({ dui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.status(200).json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el paciente', error });
    }
};
