const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
