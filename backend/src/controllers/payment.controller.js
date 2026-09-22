const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { 
        booking: {
          include: { customer: true, room: true }
        } 
      },
      orderBy: { payment_date: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { payment_id: parseInt(req.params.id) },
      include: { 
        booking: {
          include: { customer: true, room: true }
        } 
      }
    });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { booking_id, amount, payment_method, payment_status } = req.body;
    
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { booking_id: parseInt(booking_id) }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        booking_id: parseInt(booking_id),
        amount: parseFloat(amount),
        payment_method,
        payment_status: payment_status || 'PENDING'
      }
    });
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { booking_id, amount, payment_method, payment_status } = req.body;
    
    const payment = await prisma.payment.update({
      where: { payment_id: parseInt(req.params.id) },
      data: { 
        booking_id: parseInt(booking_id),
        amount: parseFloat(amount),
        payment_method,
        payment_status
      }
    });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    await prisma.payment.delete({
      where: { payment_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
