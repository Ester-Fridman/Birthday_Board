# Birthday Board — Server

Node.js + Express + TypeScript backend for the Birthday Board app.

## Tech Stack

| | |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 5, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Validation | express-validator |
| Rate limiting | express-rate-limit |

## Project Structure

```
src/
├── config/db.ts              # MongoDB connection
├── controllers/
│   ├── authController.ts     # register, login, getMe
│   └── birthdayController.ts # CRUD + isToday computed server-side
├── middleware/
│   ├── auth.ts               # JWT verification
│   ├── errorHandler.ts       # Global error handler
│   └── rateLimiter.ts        # 7 req / 15 min per IP on auth routes
├── models/
│   ├── User.ts               # email, password (hashed), name
│   └── Birthday.ts           # name, birthDate, note, createdBy
├── routes/
│   ├── authRoutes.ts
│   └── birthdayRoutes.ts
├── types/index.ts
├── app.ts
├── seed.ts                   # Dev seed script
└── seedDocker.ts             # Docker seed script (idempotent)
```

## Environment Variables

Create a `.env` file in this folder:

```
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<long-random-string>
CLIENT_URL=http://localhost:5173
```

See `.env.example` for the required keys.

## Running

```bash
npm install
npm run dev      # ts-node-dev with auto-reload
npm run build    # compile TypeScript to dist/
npm start        # run compiled dist/app.js
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register — returns JWT |
| POST | `/api/auth/login` | No | Login — returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/birthdays` | Yes | Paginated list with `isToday` flag |
| GET | `/api/birthdays/today` | Yes | All of today's birthdays (unpaginated) |
| POST | `/api/birthdays` | Yes | Create birthday |
| PATCH | `/api/birthdays/:id` | Yes | Partial update |
| DELETE | `/api/birthdays/:id` | Yes | Delete — `204 No Content` |

Auth endpoints are rate-limited to **7 requests per 15 minutes** per IP.

## Seed

```bash
npx ts-node src/seed.ts   # populates demo data for local development
```
