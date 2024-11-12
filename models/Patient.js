// Archivo: models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        match: /^\d{8}-\d$/, // Validación para el formato 00000000-0
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);