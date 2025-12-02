import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
 const navigate = useNavigate();
 const token = localStorage.getItem("token");

 let user = null;
 if (token) {
   user = jwtDecode(token);
 }

 const handleLogout = () => {
   if (window.confirm("Yakin ingin logout?")) {
     localStorage.removeItem("token");
     navigate("/login");
   }
 };

 return (
   <nav className="bg-blue-600 text-white p-4 flex justify-between">
     <div className="font-bold text-xl">Presensi App</div>

     <div className="flex space-x-6">
       <Link to="/dashboard">Dashboard</Link>
       <Link to="/presensi">Presensi</Link>

       {user?.role === "admin" && (
         <Link to="/reports">Laporan Admin</Link>
       )}

       <span className="font-semibold">Hi, {user?.nama}</span>

       <button
         onClick={handleLogout}
         className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold"
       >
         Logout
       </button>
     </div>
   </nav>
 );
}

export default Navbar;
