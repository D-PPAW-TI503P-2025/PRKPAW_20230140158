import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token); 
      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-indigo-200 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-indigo-200 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        {/* Tombol Register di bawah */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Belum punya akun?</p>
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
