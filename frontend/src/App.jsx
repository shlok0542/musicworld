import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Backdrop from "./components/Backdrop.jsx";
import Player from "./components/Player.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlayerView from "./pages/PlayerView.jsx";
import Auth from "./pages/Auth.jsx";

const App = () => (
  <div className="min-h-screen relative">
    <Backdrop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/player" element={<PlayerView />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
    <Player />
  </div>
);

export default App;