import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    setImage(img);
  }, []);

  const getToken = () => localStorage.getItem("token");

  // Base64 -> File
  function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // =========================
  // CHECK-IN DENGAN FOTO
  // =========================
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) {
      setError("Lokasi dan foto wajib ada!");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError("Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const file = dataURLtoFile(image, "selfie.jpg");

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      // NAMA FIELD HARUS SAMA DENGAN MULTER
      formData.append("buktiFoto", file);

      const response = await axios.post(
        "http://localhost:5001/api/presensi/checkin",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error("CHECKIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error");
    }
  };

  // =========================
  // CHECK-OUT
  // =========================
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setError("Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/presensi/checkout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">
      {isLoading ? (
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-6xl mb-8 text-center">
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Memuat lokasi...
          </p>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md w-full mb-8 px-8 max-w-6xl">
          <h3 className="text-xl font-semibold mb-2">Lokasi Anda:</h3>
          <div className="my-4 border rounded-lg overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Lakukan Presensi</h2>

        <div className="my-4 border rounded-lg overflow-hidden bg-black flex justify-center">
          {image ? (
            <img
              src={image}
              alt="Selfie"
              className="w-[480px] h-[360px] object-cover"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-[480px] h-[360px]"
              videoConstraints={{
                width: 480,
                height: 360,
                facingMode: "user",
              }}
            />
          )}
        </div>

        {!image ? (
          <button
            onClick={capture}
            className="w-full py-2 mb-4 bg-blue-600 text-white rounded"
          >
            Ambil Foto 📸
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="w-full py-2 mb-4 bg-gray-600 text-white rounded"
          >
            Foto Ulang 🔄
          </button>
        )}

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
