import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data
  const fetchData = async () => {
    try {
      // Panggil API Backend kita
      const response = await axios.get('http://localhost:5001/api/iot/history');
      const dataSensor = response.data.data;

      // Siapkan sumbu X (Waktu) dan sumbu Y (Nilai)
      // Ambil jam:menit dari createdAt
      const labels = dataSensor.map(item => 
        new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second:'2-digit' })
      );
      
      const dataSuhu = dataSensor.map(item => item.suhu);
      const dataLembab = dataSensor.map(item => item.kelembaban);
      // const dataCahaya = dataSensor.map(item => item.cahaya); // Opsional LDR

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSuhu,
            borderColor: 'rgb(255, 99, 132)', // Merah
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.2, // Garis agak melengkung
          },
          {
            label: 'Kelembaban (%)',
            data: dataLembab,
            borderColor: 'rgb(53, 162, 235)', // Biru
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.2,
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
      setLoading(false);
    }
  };

  // Panggil data pertama kali & set Auto Refresh tiap 5 detik
  useEffect(() => {
    fetchData(); // Load awal
    
    const interval = setInterval(() => {
      fetchData(); // Refresh otomatis
    }, 5000);

    return () => clearInterval(interval); // Bersihkan interval saat pindah halaman
  }, []);

  // Opsi tampilan grafik
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monitoring Suhu & Kelembaban Real-time' },
    },
  };

    return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Judul */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard IoT 
      </h1>

      {/* CARD DATA TERAKHIR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow">
          <p className="text-red-600 text-sm">Suhu Terakhir</p>
          <p className="text-3xl font-bold text-red-700">
            {chartData.datasets[0]?.data?.slice(-1)[0] ?? 0}°C
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow">
          <p className="text-blue-600 text-sm">Kelembaban</p>
          <p className="text-3xl font-bold text-blue-700">
            {chartData.datasets[1]?.data?.slice(-1)[0] ?? 0}%
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg shadow">
          <p className="text-yellow-600 text-sm">Cahaya (LDR)</p>
          <p className="text-3xl font-bold text-yellow-700">0</p>
        </div>
      </div>

      {/* GRAFIK */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SensorPage;
