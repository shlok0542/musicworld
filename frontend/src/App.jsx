import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Backdrop from "./components/Backdrop.jsx";
import Player from "./components/Player.jsx";
import Footer from "./components/Footer.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import LoaderOverlay from "./components/LoaderOverlay.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlayerView from "./pages/PlayerView.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import PlaylistDetails from "./pages/PlaylistDetails.jsx";

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
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/playlist/:id" element={<PlaylistDetails />} />
    </Routes>
    <Footer />
    <Player />
    <ToastContainer />
    <LoaderOverlay />
  </div>
);

export default App;
