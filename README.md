# Birthday Board 🎂

Full-stack web app to track birthdays — built with React + TypeScript (Redux Toolkit), Node.js + Express + TypeScript, and MongoDB.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Redux Toolkit, Vite |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | Email + Password, JWT, bcrypt |

---

## Demo Account

Register a new account, or log in with the existing demo account to see pre-populated data:

| Field | Value |
|---|---|
| Email | `noam@gmail.com` |
| Password | `noam123456` |

---

## Option 1 — Run with Docker (recommended)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

No setup needed — environment variables are created automatically.

**Mac / Linux:**
```bash
chmod +x start.sh && ./start.sh
```

**Windows:**
```bat
.\start.bat
```

Open [http://localhost:3000](http://localhost:3000)

---

## Option 2 — Run without Docker

**Prerequisites:** Node.js 18+

### 1. Environment Variables

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://Birthday_Board_DB_UserName:ZNr3xjDpCGaM9ii8RQDNsfWKmNkE@cluster0.vhwy8.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ccf1c7d192bac55a8db29e4e6f609dcc6c7ded96eedefbc135f173b4c11d13c0b661e8c206521ef505812c7f11fde09cdaf92dfcdbe29fb763a88f3e048b7875
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Run

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register with email + password |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/birthdays` | Yes | Paginated list with `isToday` flag |
| GET | `/api/birthdays/today` | Yes | All of today's birthdays (unpaginated) |
| POST | `/api/birthdays` | Yes | Create birthday |
| PATCH | `/api/birthdays/:id` | Yes | Partial update |
| DELETE | `/api/birthdays/:id` | Yes | Delete — `204 No Content` |

Auth endpoints are rate-limited to **7 requests per 15 minutes** per IP.

---

## Project Structure

```
birthday-board/
├── server/
│   └── src/
│       ├── config/db.ts              # MongoDB connection
│       ├── controllers/
│       │   ├── authController.ts     # Register, login, getMe
│       │   └── birthdayController.ts # CRUD + isToday computed server-side
│       ├── middleware/
│       │   ├── auth.ts               # JWT verification
│       │   └── errorHandler.ts       # Global error handler
│       ├── models/
│       │   ├── User.ts               # email, password (hashed), name
│       │   └── Birthday.ts           # name, birthDate, note, createdBy
│       ├── routes/
│       │   ├── authRoutes.ts         # Rate-limited
│       │   └── birthdayRoutes.ts
│       ├── types/index.ts
│       ├── app.ts
│       └── seed.ts
│
└── client/
    └── src/
        ├── components/
        │   ├── Login/                # Register + Login form, error modal
        │   ├── BirthdayBoard/        # Main list, search, pagination, delete confirm
        │   ├── TodayBirthdays/       # Today's highlight cards with age
        │   ├── BirthdayForm/         # Add / Edit modal with date validation
        │   └── common/               # Pagination, ProtectedRoute
        ├── services/api.ts           # Axios + auth interceptors
        ├── store/                    # Redux store + root reducer
        ├── types/index.ts
        └── App.tsx
```

---

## Architecture Notes

### Authentication
Register/login with email + password. Passwords hashed with bcrypt (cost factor 12). Backend returns a signed JWT (7-day expiry) stored in localStorage and attached to all requests via Axios interceptor. 401 errors from protected routes redirect to login; 401 from login/register are handled as user-facing error messages only.

### isToday Logic
`GET /api/birthdays` returns an `isToday: boolean` field **computed server-side** for each birthday — matching month and day only, ignoring year. The frontend renders, never recalculates.

`GET /api/birthdays/today` exists separately because the main list is paginated — today's person may not appear on the current page. This endpoint returns all today's birthdays regardless of pagination, used for the dashboard section.

### Security
- Passwords hashed with bcrypt (never stored plain)
- JWT on all protected routes
- Rate limiting on auth endpoints (7 req / 15 min per IP)
- All birthday queries scoped to `createdBy: req.userId`
- MongoDB ObjectId validation before DB queries
- Input sanitization and validation via express-validator
- `PATCH` for partial updates (not `PUT`), `204` on delete

### Data Model
Each `Birthday` stores `createdBy` (ref to User). Compound index `{ createdBy, birthDate }` for efficient today-queries.
