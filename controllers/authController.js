// Archivo: controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Registrar un usuario (médico o paciente)
exports.registerUser = [
    [
        check('name').notEmpty().withMessage('El nombre es obligatorio'),
        check('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
        check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        check('role').isIn(['doctor', 'patient']).withMessage('El rol debe ser doctor o patient'),
        check('dui').matches(/^\\d{8}-\\d$/).withMessage('El DUI debe tener el formato 00000000-0')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role, dui } = req.body;

        try {
            // Verificar si el usuario ya está registrado
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'El usuario ya está registrado' });
            }

            // Crear el nuevo usuario
            user = new User({ name, email, password, role, dui });

            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Crear y devolver el token
            const payload = { user: { id: user.id, role: user.role } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
        }
    }
];

// Iniciar sesión de usuario
exports.loginUser = [
    [
        check('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
        check('password').notEmpty().withMessage('La contraseña es obligatoria')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Verificar si el usuario existe
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar la contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Crear y devolver el token
            const payload = { user: { id: user.id, role: user.role } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
        }
    }
];
