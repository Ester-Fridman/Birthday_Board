# Birthday Board — Client

React + TypeScript frontend for the Birthday Board app.

## Tech Stack

| | |
|---|---|
| Framework | React 19, TypeScript |
| State | Redux Toolkit |
| Build | Vite |
| HTTP | Axios |

## Project Structure

```
src/
├── components/
│   ├── Login/              # Register + Login form, error modal
│   ├── BirthdayBoard/      # Main list, search, pagination, delete confirm
│   ├── TodayBirthdays/     # Today's highlight cards with age
│   ├── BirthdayForm/       # Add / Edit modal with date validation
│   └── common/             # Pagination, ProtectedRoute
├── services/api.ts         # Axios instance + auth interceptors
├── store/                  # Redux store + root reducer
├── types/index.ts
└── App.tsx
```

## Environment Variables

Create a `.env` file in this folder:

```
VITE_API_URL=http://localhost:5000/api
```

When running with Docker, this is set automatically via build arg (`VITE_API_URL=/api`).

## Running

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview production build locally
```

## Notes

- JWT token is stored in `localStorage` and attached to all requests via Axios interceptor.
- A `401` from a protected route redirects to login; a `401` from login/register shows an inline error message.
- `isToday` is computed server-side — the client renders the value, never recalculates it.
