# musicworld
MusicWorld is a modern full-stack MERN music streaming web app with a unique immersive UI, real-time playback, playlists, and JioSaavn API integration.
# 🎵 MusicWorld

MusicWorld is a modern full-stack music streaming web application built using the MERN stack. It features a unique immersive UI, smooth animations, and seamless music playback powered by a JioSaavn API proxy.

---

## 🚀 Features

* 🔍 Search songs, albums, and artists
* ▶️ Play, pause, skip, and control music
* ❤️ Like and save your favorite tracks
* 📂 Create and manage playlists
* 🕒 Recently played history
* 🎧 Floating mini music player
* 🌈 Dynamic background based on album art
* ⚡ Smooth animations with Framer Motion
* 📱 Fully responsive design

---

## 🧠 Unique UI/UX

MusicWorld is designed differently from traditional music apps:

* Full-screen immersive layout
* Glassmorphism-based UI
* Neon gradient themes
* Animated transitions
* Circular album player design

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* Axios

### Database

* MongoDB (Mongoose)

### Other Tools

* HTML5 Audio API
* Optional: Socket.io (for real-time features)

---

## 📂 Project Structure

```
musicworld/
│
├── client/        # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
├── server/        # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── middleware/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/musicworld.git
cd musicworld
```

---

### 2. Setup Backend

```
cd server
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3. Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🔌 API Integration

This app uses a JioSaavn API through a backend proxy:

```
https://saavn.dev/api/
```

All API requests are handled securely via the backend.

---

## 📸 Screenshots (Add Later)

* Home Page
* Music Player
* Search Results
* Playlist UI

---

## 🌍 Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway
* Database: MongoDB Atlas

---

## ⚠️ Disclaimer

This project uses an unofficial JioSaavn API. It is intended for educational and personal use only.

---

## 📌 Future Improvements

* 🎤 Lyrics sync
* 🎚️ Audio equalizer
* 👥 Music rooms (listen together)
* 📥 Offline mode (PWA)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Made with ❤️ by Shlok Maurya
