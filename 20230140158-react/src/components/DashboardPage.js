import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || 'Mahasiswa');
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Selamat Datang, {userName}! 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Berikut adalah menu Presensi Mahasiswa.
        </p>

        {/* Kartu Presensi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-bold text-blue-700 mb-2">Presensi Hari Ini</h2>
            <p className="text-sm text-gray-600">Lakukan presensi masuk & pulang</p>
          </div>

          <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-lg font-bold text-purple-700 mb-2">Riwayat Presensi</h2>
            <p className="text-sm text-gray-600">Lihat semua riwayat presensi kamu</p>
          </div>
        </div>

        {/* Tombol Logout */}
        <div className="text-center mt-10">
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* POPUP KONFIRMASI LOGOUT */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Yakin ingin logout?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
