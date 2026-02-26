# Admission Management System

A comprehensive MERN (MongoDB, Express, React, Node.js) stack application for managing college admissions and CRM operations. This system handles applicant registration, seat allocation, quota management, and admission workflows.

## Features

### Core Features

- **Institution Management** - Create and manage multiple institutions with campus information
- **Program Management** - Define academic programs linked to institutions
- **Seat Matrix Management** - Configure seat allocation with quota-based management
- **Applicant Registration** - Register applicants with detailed personal and academic information
- **Smart Allocation** - Automatic applicant-to-program allocation based on quota rules
- **Document Tracking** - Monitor document submission and verification status
- **Dashboard Overview** - Get insights into admissions data across institutions

### Admission Modes Supported

- Government quota (KCET, COMEDK)
- Management quota
- Regular and Lateral entry types

### Technical Features

- RESTful API architecture
- Real-time data management with MongoDB
- CORS-enabled for cross-origin requests
- Frontend using React hooks and modern JavaScript

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Frontend**: React with Hooks
- **Other**: Mongoose ODM, CORS middleware

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn package manager

### Setup Steps

1. **Clone or extract the project**

   ```bash
   cd admission-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure MongoDB**
   - Ensure MongoDB is running (default: `mongodb://127.0.0.1:27017`)
   - Or set the `MONGO_URI` environment variable:
     ```bash
     set MONGO_URI=your_mongodb_connection_string  # Windows
     export MONGO_URI=your_mongodb_connection_string  # Linux/Mac
     ```

4. **Start the application**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to: `http://localhost:4000`

## API Endpoints

### Institution Management

- `POST /api/institutions` - Create new institution
- `GET /api/institutions` - Get all institutions

### Program Management

- `POST /api/programs` - Create new program
- `GET /api/programs` - Get all programs with institution details

### Seat Matrix

- `POST /api/seat-matrices` - Create seat allocation configuration
- `GET /api/seat-matrices` - Get all seat matrices

### Applicant Management

- `POST /api/applicants/create-and-allocate` - Register applicant and allocate seat
- `GET /api/applicants` - Get all applicants
- `GET /api/applicants/:id` - Get specific applicant
- `PUT /api/applicants/:id` - Update applicant details
- `GET /api/dashboard/overview` - Get admission statistics

## Usage Workflow

1. **Setup Masters**: Create institutions and academic programs
2. **Configure Quotas**: Define seat matrices for programs with quota breakdowns
3. **Register Applicants**: Add applicants with their academic credentials
4. **Automatic Allocation**: System allocates programs based on merit and quota availability
5. **Track Documents**: Monitor document submission and verification
6. **View Dashboard**: Analyze admission statistics and performance metrics

## Database Models

### Institution

- Name, code, campus location, department information

### Program

- Name, institution reference, specialization

### SeatMatrix

- Program reference, academic year, total intake
- Quota-wise breakdown (KCET, COMEDK, MANAGEMENT)

### Applicant

- Personal details (name, email, phone, DOB, address)
- Academic information (marks, category, entry type)
- Admission details (quota type, admission mode, allocated program)
- Document tracking status

## Environment Variables

- `PORT` - Server port (default: 4000)
- `MONGO_URI` - MongoDB connection string (default: `mongodb://127.0.0.1:27017/admission_management`)

## Development

### Running in Development Mode

```bash
npm run dev
```

Uses nodemon for automatic server restart on file changes.

### Running in Production

```bash
npm start
```

Starts the server without auto-reload.

### Images

<img width="1920" height="1385" alt="ss1" src="https://github.com/user-attachments/assets/a21daaf6-0d3f-4be8-b612-0d66afd9924f" />



