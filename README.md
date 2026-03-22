# MusicWorld

Full stack MERN music streaming web app with an immersive neon glassmorphism UI.

## Setup

### Backend

```
cd backend
npm install
npm run dev
```

Create `.env` in `backend/` using `.env.example`.

### Frontend

```
cd frontend
npm install
npm run dev
```

Create `.env` in `frontend/` using `.env.example`.

## API

- `GET /api/search?q=`
- `GET /api/song/:id`

Backend proxies the unofficial JioSaavn API.
