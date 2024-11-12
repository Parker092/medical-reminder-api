// Archivo: controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// Obtener todas las recetas de un paciente
exports.getPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await Prescription.find({ patient: patientId }).populate('doctor', 'name');
        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las recetas', error });
    }
};

// Crear una nueva receta para un paciente
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, doctorId, medicationName, dosage, frequency, duration } = req.body;

        // Verificar si el paciente existe
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const prescription = await Prescription.create({
            patient: patientId,
            doctor: doctorId,
            medicationName,
            dosage,
            frequency,
            duration,
        });
        res.status(201).json({ message: 'Receta creada correctamente', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la receta', error });
    }
};

// Actualizar una receta existente
exports.updatePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { medicationName, dosage, frequency, duration } = req.body;

        const prescription = await Prescription.findByIdAndUpdate(
            prescriptionId,
            { medicationName, dosage, frequency, duration },
            { new: true, runValidators: true }
        );

        if (!prescription) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        res.status(200).json({ message: 'Receta actualizada correctamente', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la receta', error });
    }
};

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
        res.status(500).json({ message: 'Error al eliminar la receta', error });
    }
};
