// Archivo: routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas para autenticación de usuarios
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un usuario (médico o paciente)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [doctor, patient]
 *               dui:
 *                 type: string
 *                 pattern: "/^\\d{8}-\\d$/"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El usuario ya está registrado
 *       500:
 *         description: Error al registrar el usuario
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error al iniciar sesión
 */
const router = express.Router();

// Ruta para registrar un usuario (médico o paciente)
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('email').isEmail().withMessage('Debe proporcionar un email válido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('role').isIn(['doctor', 'patient']).withMessage('El rol debe ser doctor o patient'),
        body('dui').matches(/\d{8}-\d/).withMessage('Debe proporcionar un DUI válido (formato: ########-#)'),
    ],
    registerUser
);

// Ruta para iniciar sesión
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Debe proporcionar un email válido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    loginUser
);

module.exports = router;
