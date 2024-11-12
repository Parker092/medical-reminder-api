// Archivo: routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
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
 *                 pattern: "^\\d{8}-\\d$"
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
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

module.exports = router;
