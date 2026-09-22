const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { customer: true, room: { include: { room_type: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: parseInt(req.params.id) },
      include: { customer: true, room: { include: { room_type: true } } }
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { customer_id, room_id, check_in_date, check_out_date, number_of_guests, booking_status } = req.body;
    
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Double booking check
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        room_id: parseInt(room_id),
        booking_status: { notIn: ['CANCELLED', 'CHECKED_OUT'] },
        OR: [
          { check_in_date: { lt: checkOut }, check_out_date: { gt: checkIn } }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for the selected dates' });
    }

    // Calculate total amount
    const room = await prisma.room.findUnique({
      where: { room_id: parseInt(room_id) },
      include: { room_type: true }
    });

    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const total_amount = diffDays * room.room_type.price_per_night;

    const booking = await prisma.booking.create({
      data: {
        customer_id: parseInt(customer_id),
        room_id: parseInt(room_id),
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: parseInt(number_of_guests),
        booking_status: booking_status || 'PENDING',
        total_amount: parseFloat(total_amount)
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { customer_id, room_id, check_in_date, check_out_date, number_of_guests, booking_status } = req.body;
    
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    
    // Calculate total amount
    const room = await prisma.room.findUnique({
      where: { room_id: parseInt(room_id) },
      include: { room_type: true }
    });

    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const total_amount = diffDays * room.room_type.price_per_night;

    const booking = await prisma.booking.update({
      where: { booking_id: parseInt(req.params.id) },
      data: { 
        customer_id: parseInt(customer_id),
        room_id: parseInt(room_id),
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: parseInt(number_of_guests),
        booking_status,
        total_amount: parseFloat(total_amount)
      }
    });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({
      where: { booking_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
