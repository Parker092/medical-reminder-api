// Archivo: controllers/medicationConfirmationController.js
const MedicationConfirmation = require('../models/MedicationConfirmation');
const Patient = require('../models/Patient');

// Confirmar la toma de un medicamento
exports.confirmMedication = async (req, res) => {
    try {
        const { prescriptionId, patientDui, status, notes } = req.body;

        // Verificar si el paciente existe por DUI
        const patient = await Patient.findOne({ dui: patientDui });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const medicationConfirmation = await MedicationConfirmation.create({
            prescription: prescriptionId,
            patient: patient._id,
            date: new Date(),
            status,
            notes,
        });
        res.status(201).json({ message: 'Confirmación registrada correctamente', medicationConfirmation });
    } catch (error) {
        res.status(500).json({ message: 'Error al confirmar la toma de medicamento', error });
    }
};
