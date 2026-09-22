const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(req.params.id) }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    // Check email
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const customer = await prisma.customer.create({
      data: { first_name, last_name, email, phone, address }
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    const customer = await prisma.customer.update({
      where: { customer_id: parseInt(req.params.id) },
      data: { first_name, last_name, email, phone, address }
    });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    await prisma.customer.delete({
      where: { customer_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
