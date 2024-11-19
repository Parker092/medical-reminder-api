// Archivo: models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        required: true,
    },
    dui: {
        type: String,
        required: true,
        unique: true,
        match: /^\\d{8}-\\d$/, // Validación para el formato 00000000-0
    },
}, { timestamps: true });

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Middleware para eliminar en cascada las recetas al eliminar un doctor
userSchema.pre('remove', async function (next) {
    if (this.role === 'doctor') {
        try {
            await mongoose.model('Prescription').deleteMany({ doctor: this._id });
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);