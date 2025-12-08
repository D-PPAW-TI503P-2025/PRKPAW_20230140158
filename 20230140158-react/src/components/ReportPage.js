import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // FETCH REPORT
  const fetchReports = useCallback(
    async (query) => {
      if (!token) return navigate("/login");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/presensi/report?nama=${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReports(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat laporan");
      }
    },
    [navigate, token]
  );

  useEffect(() => {
    fetchReports("");
  }, [fetchReports]);

  // SEARCH
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  // DELETE LAPORAN
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/presensi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchReports("");
    } catch (err) {
      alert("Gagal menghapus laporan");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Laporan Presensi Harian</h1>

      {/* SEARCH */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Cari
        </button>
      </form>

      {error && <p className="text-red-600 p-3 bg-red-100 rounded mb-4">{error}</p>}

      {/* TABEL */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Check-In</th>
              <th className="px-6 py-3 text-left">Check-Out</th>
              <th className="px-6 py-3 text-left">Latitude</th>
              <th className="px-6 py-3 text-left">Longitude</th>
              <th className="px-6 py-3 text-left">Bukti Foto</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {reports.length > 0 ? (
              reports.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-6 py-4">{item.user?.nama}</td>

                  <td className="px-6 py-4">
                    {new Date(item.checkIn).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4">
                    {item.checkOut
                      ? new Date(item.checkOut).toLocaleString("id-ID")
                      : "Belum Check-Out"}
                  </td>

                  <td className="px-6 py-4">{item.latitude || "-"}</td>
                  <td className="px-6 py-4">{item.longitude || "-"}</td>

                  {/* FOTO */}
                  <td className="px-6 py-4">
                    {item.buktiFoto ? (
                      <img
                        src={item.buktiFoto}
                        alt="bukti"
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(item.buktiFoto)}
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada foto</span>
                    )}
                  </td>

                  {/* HAPUS BUTTON */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FOTO */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full"
            className="max-w-3xl max-h-[85vh] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default ReportPage;
