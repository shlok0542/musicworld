import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Backdrop from "./components/Backdrop.jsx";
import Player from "./components/Player.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import LoaderOverlay from "./components/LoaderOverlay.jsx";
import WelcomePrompt from "./components/WelcomePrompt.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import PlayerView from "./pages/PlayerView.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import PlaylistDetails from "./pages/PlaylistDetails.jsx";

const App = () => (
  <div className="min-h-screen relative flex flex-col">
    <Backdrop />
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library/favorites" element={<Favorites />} />
        <Route path="/player" element={<PlayerView />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />
      </Routes>
    </main>
    <Player />
    <ToastContainer />
    <LoaderOverlay />
    <WelcomePrompt />
  </div>
);

export default App;
