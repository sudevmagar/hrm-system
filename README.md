# Human Resource Management System (HRM System)

This is a Human Resource Management System built using Next.js, MongoDB, Prisma, Tailwind CSS React Full Calendar. The application allows for HR Manager to view the employee details and the attendance records.

## Features

- **Employee Management:** Add, update, and delete employee details.
- **Attendance Tracking:** Keep track of employee attendance.
- **Payroll Management:** Manage employee salary and deductions.
- **Role-based Access Control:** Different user roles (HR, Manager and Employee) with access restrictions.

## Technologies Used

- **Next.js** - Framework for React-based server-side rendering and static site generation.
- **Prisma** - ORM (Object Relational Mapping) for managing database interactions with MongoDB.
- **MongoDB** - NoSQL database for storing employee and attendance data.
- **TailwindCSS** - Utility-first CSS framework for styling.
- **NextAuth.js** - Authentication solution for Next.js applications.
- **FullCalendar** - JavaScript calendar library for managing employee attendance.
- **bcryptjs** - Library for hashing passwords.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/sudevo7/hrm-system.git

2. Install dependencies:
   ```bash
   npm install

3. Set up your environment variables in a .env file:
   ```bash
   DATABASE_URL="mongodb+srv://sudev:hrm2025@hrm-cluster.r22fw.mongodb.net/hrm-database?retryWrites=true&w=majority&appName=hrm-cluster"
   NEXTAUTH_SECRET="Gm3vB9qLz8yD2sW5Xf7pK6nT1aJ0RcYV"

4. Generate Prisma Client:
   ```bash
   npx prisma generate

5. Start the development server:
   ```bash
   npm run dev

The application will be available at http://localhost:3000.

## Default Credentials

For testing purposes, the following default credentials can be used to log into the system:

- **Email:** `hr@mayamatrix.com`
- **Password:** `hrpassword`


