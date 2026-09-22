# Hotel Room Booking Management System

## Project Overview
A complete Hotel Room Booking Management System developed as an academic ICT2308 Database Systems project.

## Features
- Authentication & Authorization (Admin/Staff roles)
- Dashboard statistics and reports
- Customer Management (CRUD)
- Room Type Management (CRUD)
- Room Management (CRUD)
- Booking Management (CRUD with availability checking and double booking prevention)
- Payment Management (CRUD)

## Technology Stack
- **Frontend**: Angular, SCSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL, Prisma ORM
- **Security**: JWT, bcrypt, Helmet, CORS

## System Architecture
```
┌─────────────────────┐
│       Angular       │
│      Frontend       │
└──────────┬──────────┘
           │ REST API
┌──────────▼──────────┐
│   Node.js/Express   │
│       Backend       │
└──────────┬──────────┘
           │ Prisma
┌──────────▼──────────┐
│        MySQL        │
│      Database       │
└─────────────────────┘
```

## Setup Instructions

### Environment Variables
Copy `.env.example` to `.env` in the backend directory and update the variables appropriately.

### Database Setup
Ensure MySQL is running, then run Prisma migrations to initialize the schema:
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
