# 🎵 MUSYNC Backend

A production-grade Node.js + Express + MongoDB backend for a social music platform.

## 🚀 Features

- **Authentication**: JWT-based auth with secure password hashing (bcrypt).
- **User Profiles**: Comprehensive profiles for artists/producers.
- **Project Management**: CRUD for songs, beats, albums, and collabs.
- **Discovery**: Public search and filtering for artists/producers.
- **Networking**: Connection system (Friend requests).
- **Real-time Chat**: 1-to-1 messaging with Socket.IO.

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** (Mongoose)
- **Socket.IO**
- **JWT** Authentication

## 🚀 Quick Start

### Installation

```bash
git clone <repository-url>
cd musync-backend
npm install
cp .env.example .env
# Edit .env
```

### Running

```bash
npm run dev
```

## 📡 API Documentation

### Base URL: `/api`

| Feature | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| **Auth** | POST | `/auth/signup` | Register |
| | POST | `/auth/login` | Login |
| **Profile** | POST | `/profile` | Create/Update |
| | GET | `/profile/me` | My Profile |
| **Projects** | GET | `/projects` | List my projects |
| | POST | `/projects` | Create project |
| **Discovery** | GET | `/discover/artists` | Search & Filter |
| **Connect** | POST | `/connections/request` | Send Request |
| | GET | `/connections` | List Connections |
| **Chat** | POST | `/chat/send` | Send Message |
| | GET | `/chat/:userId` | Get History |

## 🔌 Socket.IO

Connect with `auth: { token: "Bearer ..." }`.
Listens for `message:receive`.

## 📝 License

MIT
