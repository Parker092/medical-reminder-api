// Archivo: models/Patient.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    dui: {
        type: String,
        required: true,
        unique: true,
        match: /^\\d{8}-\\d$/, // Validación para el formato 00000000-0
    },
    emergencyContact: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
}, { timestamps: true });

// Middleware para eliminar recetas y confirmaciones asociadas al eliminar un paciente
patientSchema.pre('remove', async function (next) {
    try {
        await mongoose.model('Prescription').deleteMany({ patient: this._id });
        await mongoose.model('MedicationConfirmation').deleteMany({ patient: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Patient', patientSchema);