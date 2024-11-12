// Archivo: routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const prescriptionRoutes = require('./prescriptionRoutes');
const medicationConfirmationRoutes = require('./medicationConfirmationRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

// Prefijos para las rutas
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medications', medicationConfirmationRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
