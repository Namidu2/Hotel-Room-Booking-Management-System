# Hotel Room Booking Management System

A full-stack web application developed as an academic ICT2308 Database Systems project.

## Tech Stack
* **Frontend**: Angular 18 (Standalone Components), Bootstrap 5, SCSS, RxJS
* **Backend**: Node.js, Express.js
* **Database**: SQLite (via Prisma ORM)
* **Authentication**: JWT & bcrypt

## Features (CRUD & Validation)
* **Authentication**: Secure Login & Registration with JWT.
* **Customer Management**: Add, Edit, Delete, List customers.
* **Room Type Management**: Define room types (Single, Double, Suite), capacities, and prices per night.
* **Room Management**: Create rooms, assign them to room types, manage status (AVAILABLE, OCCUPIED, MAINTENANCE).
* **Booking Management**: Book rooms for customers, specify dates, check for double-booking conflicts, auto-calculate total amount.
* **Payment Management**: Process payments for bookings.
* **Dashboard**: Statistical overview of customers, rooms, bookings, and revenue.

## Setup Instructions

### 1. Database & Backend
```bash
cd backend
npm install
# Set environment variables (.env file)
npx prisma generate
npx prisma db push
npm run seed  # Seed the admin user and initial data
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

## Security & Architecture
* RESTful API adhering to best practices.
* Passwords hashed using bcrypt.
* JWT for stateless authentication.
* Express-rate-limit to protect against brute force attacks.
* Helmet for HTTP header security.
* Data normalized into 3NF using Prisma Schema.
