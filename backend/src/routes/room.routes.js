const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
