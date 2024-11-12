// Archivo: middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

exports.isDoctor = async (req, res, next) => {
    try {
        const user = await User.findOne({ dui: req.user.dui });
        if (user.role !== 'doctor') {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el rol de usuario.', error });
    }
};