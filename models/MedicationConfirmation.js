// Archivo: models/MedicationConfirmation.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationConfirmationSchema = new Schema({
    prescription: {
        type: Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['taken', 'missed'],
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Middleware para eliminar confirmaciones asociadas al eliminar una receta
medicationConfirmationSchema.pre('remove', async function (next) {
    try {
        await mongoose.model('Prescription').updateMany(
            { _id: this.prescription },
            { $pull: { medicationConfirmations: this._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('MedicationConfirmation', medicationConfirmationSchema);