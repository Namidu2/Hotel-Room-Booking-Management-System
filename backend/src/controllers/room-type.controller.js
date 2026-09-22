const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(roomTypes);
  } catch (error) {
    next(error);
  }
};

exports.getRoomTypeById = async (req, res, next) => {
  try {
    const roomType = await prisma.roomType.findUnique({
      where: { room_type_id: parseInt(req.params.id) }
    });
    if (!roomType) return res.status(404).json({ message: 'Room Type not found' });
    res.json(roomType);
  } catch (error) {
    next(error);
  }
};

exports.createRoomType = async (req, res, next) => {
  try {
    const { type_name, description, capacity, price_per_night } = req.body;
    
    const existing = await prisma.roomType.findUnique({ where: { type_name } });
    if (existing) return res.status(400).json({ message: 'Room Type name already exists' });

    const roomType = await prisma.roomType.create({
      data: { 
        type_name, 
        description, 
        capacity: parseInt(capacity), 
        price_per_night: parseFloat(price_per_night) 
      }
    });
    res.status(201).json(roomType);
  } catch (error) {
    next(error);
  }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const { type_name, description, capacity, price_per_night } = req.body;
    
    const roomType = await prisma.roomType.update({
      where: { room_type_id: parseInt(req.params.id) },
      data: { 
        type_name, 
        description, 
        capacity: parseInt(capacity), 
        price_per_night: parseFloat(price_per_night) 
      }
    });
    res.json(roomType);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    await prisma.roomType.delete({
      where: { room_type_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Room Type deleted successfully' });
  } catch (error) {
    next(error);
  }
};
