import React from "react";
import MapaConRuta from "./components/MapaConRuta";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <h1>📍 Rutas </h1>
        <MapaConRuta />
      </div>
    </div>
  );
}

export default App;
