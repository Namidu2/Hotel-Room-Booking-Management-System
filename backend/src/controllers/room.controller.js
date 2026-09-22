const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { room_type: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: { room_id: parseInt(req.params.id) },
      include: { room_type: true }
    });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { room_number, room_type_id, floor, status } = req.body;
    
    const existing = await prisma.room.findUnique({ where: { room_number } });
    if (existing) return res.status(400).json({ message: 'Room number already exists' });

    const room = await prisma.room.create({
      data: { 
        room_number, 
        room_type_id: parseInt(room_type_id), 
        floor, 
        status: status || 'AVAILABLE' 
      }
    });
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { room_number, room_type_id, floor, status } = req.body;
    
    const room = await prisma.room.update({
      where: { room_id: parseInt(req.params.id) },
      data: { 
        room_number, 
        room_type_id: parseInt(room_type_id), 
        floor, 
        status 
      }
    });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    await prisma.room.delete({
      where: { room_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
