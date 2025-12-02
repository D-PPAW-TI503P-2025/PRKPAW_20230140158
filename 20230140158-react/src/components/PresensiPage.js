import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Lokasi tidak bisa didapatkan: " + err.message);
      }
    );
  };

  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum tersedia.");
      return;
    }

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const res = await axios.post(
        "http://localhost:5001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-in");
    }
  };

  const handleCheckOut = async () => {
    if (!coords) {
      setError("Lokasi belum tersedia.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5001/api/presensi/check-out",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-out");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Halaman Presensi</h2>

      {/* MAP */}
      <div className="mb-4 bg-white p-4 shadow rounded-lg">
        <h3 className="font-semibold mb-2">Lokasi Terdeteksi:</h3>

        {coords ? (
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={16}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-gray-500">Mengambil lokasi...</p>
        )}
      </div>

      {/* MESSAGES */}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={handleCheckIn}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Check-In
        </button>

        <button
          onClick={handleCheckOut}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Check-Out
        </button>
      </div>
    </div>
  );
}

export default PresensiPage;
