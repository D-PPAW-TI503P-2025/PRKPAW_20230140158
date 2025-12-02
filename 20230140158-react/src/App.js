import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Halaman tanpa navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <DashboardPage />
            </>
          }
        />

        {/* Presensi */}
        <Route
          path="/presensi"
          element={
            <>
              <Navbar />
              <PresensiPage />
            </>
          }
        />

        {/* 🔥 ROUTE LAPORAN ADMIN (PERBAIKAN DI SINI) */}
        <Route
          path="/reports"
          element={
            <>
              <Navbar />
              <ReportPage />
            </>
          }
        />

        {/* Default */}
        <Route path="/" element={<LoginPage />} />

      </Routes>
    </Router>
  );
}

export default App;
