const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await prisma.customer.count();
    const totalRooms = await prisma.room.count();
    const totalBookings = await prisma.booking.count();
    
    // Total Revenue (sum of all completed payments)
    const payments = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        payment_status: 'COMPLETED'
      }
    });
    
    const totalRevenue = payments._sum.amount || 0;

    // Recent Bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        customer: true,
        room: { include: { room_type: true } }
      }
    });

    res.json({
      totalCustomers,
      totalRooms,
      totalBookings,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};
