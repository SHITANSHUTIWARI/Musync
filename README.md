# MUSYNC

A professional networking and collaboration platform for music creators — think LinkedIn, but for producers, vocalists, beatmakers, and songwriters.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router), CSS Modules |
| Backend    | Node.js, Express                    |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (stored in localStorage)        |
| Real-time  | Socket.io                           |
| HTTP       | Axios                               |

---

## Features

- Auth — signup / login with JWT
- Profile — create and edit artist profile
- Projects — add, view, edit, delete music projects
- Discover — search and filter artists/producers
- Connections — send, accept, reject connection requests
- Messages — real-time chat between connected users
- Settings — account, password, notifications, privacy

---

## Run Locally

### Prerequisites

- Node.js >= 18
- MongoDB Atlas URI (or local MongoDB)

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in your values in .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000` (or your `PORT`)

---

## Environment Variables

### Backend (`/backend/.env`)

| Variable               | Description                        |
|------------------------|------------------------------------|
| `MONGODB_URI`          | MongoDB connection string          |
| `JWT_SECRET`           | Secret key for JWT signing         |
| `PORT`                 | Server port (default: 5000)        |
| `CLIENT_URL`           | Frontend URL for CORS              |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret              |

### Frontend (`/frontend/.env.local`)

| Variable                  | Description                     |
|---------------------------|---------------------------------|
| `NEXT_PUBLIC_API_URL`     | Backend API base URL            |
| `NEXT_PUBLIC_SOCKET_URL`  | Backend Socket.io URL           |

---

## Deployment

- **Backend** → [Render.com](https://render.com) — set all env variables in dashboard, start command: `node server.js`
- **Frontend** → [Vercel](https://vercel.com) — set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` pointing to your Render URL

---

## Project Structure

```
MUSYNC/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── socket/
│   │   └── validators/
│   └── server.js
└── frontend/
    └── src/
        ├── app/          # Next.js pages
        ├── components/   # Reusable UI components
        ├── context/      # Auth context
        ├── services/     # Axios API instance
        └── utils/        # Auth helpers
```
