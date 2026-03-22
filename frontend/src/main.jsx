import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UIProvider>
          <AuthProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </AuthProvider>
        </UIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);