import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "85vh",
};

const centerDefault = {
  lat: 23.23,
  lng: -106.42,
};

const MapaConRuta = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [infoRuta, setInfoRuta] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const [clicState, setClicState] = useState("origin");

  const handleDirectionsCallback = useCallback((response) => {
    if (response && response.status === "OK") {
      setDirections(response);
      const leg = response.routes[0].legs[0];
      setInfoRuta({
        distancia: leg.distance.text,
        duracion: leg.duration.text,
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const originPlace = originRef.current.getPlace();
    const destinationPlace = destinationRef.current.getPlace();

    if (
      originPlace?.geometry?.location &&
      destinationPlace?.geometry?.location
    ) {
      setOrigin({
        lat: originPlace.geometry.location.lat(),
        lng: originPlace.geometry.location.lng(),
      });
      setDestination({
        lat: destinationPlace.geometry.location.lat(),
        lng: destinationPlace.geometry.location.lng(),
      });
      setDirections(null);
      setInfoRuta(null);
    } else {
      alert("Selecciona direcciones válidas desde las sugerencias.");
    }
  };

  const handleMapClick = (e) => {
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    if (clicState === "origin") {
      setOrigin(clickedLocation);
      setDestination(null);
      setDirections(null);
      setInfoRuta(null);
      setClicState("destination");
    } else {
      setDestination(clickedLocation);
      setDirections(null);
      setInfoRuta(null);
      setClicState("origin");
    }
  };

  const limpiarTodo = () => {
    setOrigin(null);
    setDestination(null);
    setDirections(null);
    setInfoRuta(null);
    setClicState("origin");
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBpYq3Gmp0t83W1-Z3KNGg0gkJS0aGFnF4" // 🔁 Sustituye por tu propia API Key
      libraries={["places"]}
    >
      <div style={{ position: "relative" }}>
        {/* Panel superior */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}
          >
            <Autocomplete onLoad={(ref) => (originRef.current = ref)}>
              <input
                type="text"
                placeholder="Dirección de origen"
                style={{ width: "200px", padding: "5px" }}
              />
            </Autocomplete>
            <Autocomplete onLoad={(ref) => (destinationRef.current = ref)}>
              <input
                type="text"
                placeholder="Dirección de destino"
                style={{ width: "200px", padding: "5px" }}
              />
            </Autocomplete>
            <select
              value={travelMode}
              onChange={(e) => {
                setTravelMode(e.target.value);
                setDirections(null);
              }}
              style={{ padding: "5px" }}
            >
              <option value="DRIVING">🚗 Conduciendo</option>
              <option value="WALKING">🚶 Caminando</option>
              <option value="BICYCLING">🚲 Bicicleta</option>
              <option value="TRANSIT">🚌 Transporte público</option>
            </select>
            <button type="submit">📍 Trazar Ruta</button>
            <button type="button" onClick={limpiarTodo} style={{ background: "#f44", color: "#fff" }}>
              ❌ Limpiar
            </button>
          </form>
          <div style={{ marginTop: "5px", fontSize: "12px", textAlign: "center" }}>
            o da clic en el mapa para seleccionar origen y destino
          </div>
        </div>

        {/* Info ruta */}
        {infoRuta && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              background: "#fff",
              padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontSize: "16px",
            }}
          >
            ⏱️ <strong>{infoRuta.duracion}</strong> | 📏{" "}
            <strong>{infoRuta.distancia}</strong>
          </div>
        )}

        {/* Mapa */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={origin || centerDefault}
          zoom={13}
          onClick={handleMapClick}
        >
          {origin && <Marker position={origin} title="Origen" />}
          {destination && <Marker position={destination} title="Destino" />}

          {origin && destination && !directions && (
            <DirectionsService
              options={{
                origin,
                destination,
                travelMode: travelMode,
              }}
              callback={handleDirectionsCallback}
            />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapaConRuta;
