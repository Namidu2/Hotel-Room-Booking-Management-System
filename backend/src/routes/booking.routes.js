const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
