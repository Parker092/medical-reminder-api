// Archivo: controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar un usuario (médico o paciente)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, dui } = req.body;

        // Verificar si el usuario ya existe por email o DUI
        const userExists = await User.findOne({ $or: [{ email }, { dui }] });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        const user = await User.create({ name, email, password, role, dui });
        res.status(201).json({ message: 'Usuario registrado correctamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, dui: user.dui }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};








