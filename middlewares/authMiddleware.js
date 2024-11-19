// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

const isDoctor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && user.role === 'doctor') {
            next();
        } else {
            res.status(403).json({ message: 'Access Forbidden: Requires Doctor Role' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const isPatient = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && user.role === 'patient') {
            next();
        } else {
            res.status(403).json({ message: 'Access Forbidden: Requires Patient Role' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { verifyToken, isDoctor, isPatient };