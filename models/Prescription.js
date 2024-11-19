// Archivo: models/Prescription.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    medicationName: {
        type: String,
        required: true,
        trim: true,
    },
    dosage: {
        type: String,
        required: true,
        trim: true,
    },
    frequency: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: String,
        required: true,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Middleware para eliminar confirmaciones asociadas al eliminar una receta
prescriptionSchema.pre('remove', async function (next) {
    try {
        await mongoose.model('MedicationConfirmation').deleteMany({ prescription: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);