# DarshanSetu 🛕

## Temple Darshan Session Booking System

DarshanSetu is a full-stack web application for exploring temples, viewing available darshan sessions, and booking temple visits.

## Features

- View temple details and images
- View official temple websites
- View available darshan sessions
- Search and filter sessions
- Book a darshan session
- View bookings
- Update bookings
- Cancel bookings
- Automatically update available slots

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite

### API Testing
- Postman

## Project Structure

```text
DarshanSetu/
│
├── templecrowd frontend/
│   ├── index.html
│   ├── booking.html
│   ├── script.js
│   ├── booking.js
│   ├── style.css
│   └── temple images
│
├── templecrowdbackend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## How to Run

### 1. Start the Backend

Open the terminal in the backend folder:

```bash
cd templecrowdbackend
```

Install the required packages:

```bash
npm install
```

Start the server:

```bash
npm start
```

The backend server runs at:

```text
http://localhost:3000
```

### 2. Start the Frontend

Open the `templecrowd frontend` folder in VS Code.

Open `index.html` using **Live Server**.

The frontend communicates with the backend through REST APIs.

## API Endpoints

### Temples

```text
GET /api/temples
```

### Sessions

```text
GET /api/sessions
```

### Bookings

```text
GET    /api/bookings
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

## CRUD Operations

- **Create** → POST
- **Read** → GET
- **Update** → PUT
- **Delete** → DELETE

## Slot Management

When a booking is created, the available slots decrease according to the number of visitors.

When a booking is cancelled, the cancelled visitor count is added back to the available slots.

## Learning Outcome

This project demonstrates practical understanding of:

- Frontend development
- Backend development
- REST APIs
- HTTP methods
- Database connectivity
- SQLite
- CRUD operations
- JavaScript Fetch API
- Form handling
- Search and filtering
