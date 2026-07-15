<<<<<<< HEAD
# HostelHub - Hostel Management System

Full-stack MERN app (MongoDB, Express, React, Node) recreating the demoed HostelHub dashboard.

## Structure

```
hostel-management/
  backend/     Express API + Mongoose models (Student, Room, Bed, Attendance, Payment)
  frontend/    React + Vite dashboard (Dashboard, Students, Rooms, Beds, Attendance, Payments, Vacancy, Reports, Settings)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string to Atlas)

## 1. Backend setup

```
cd backend
cp .env.example .env      # edit MONGO_URI if needed
npm install
npm run dev                # starts on http://localhost:5000
```

## 2. Frontend setup

```
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The frontend dev server proxies `/api/*` requests to `http://localhost:5000`, so run both servers at the same time.

## API overview

| Resource   | Endpoint             | Notes                                  |
|------------|-----------------------|-----------------------------------------|
| Students   | `/api/students`        | CRUD                                    |
| Rooms      | `/api/rooms`           | CRUD, returns bed counts                |
| Beds       | `/api/beds`            | CRUD, linked to room + occupant         |
| Attendance | `/api/attendance`      | Mark/list by date                       |
| Payments   | `/api/payments`        | CRUD + `/summary` for collected/pending |

## Notes

- Deleting a student frees their assigned bed automatically.
- Payment status (Paid/Partial/Pending) is computed server-side from amount vs paid.
- The Reports page can export a payments CSV directly in the browser.
=======
# Elavarasan2005 calculator 
project
>>>>>>> 9d20c0b8e5778abc9cea1bf444fc4e2c3d4fcbad
