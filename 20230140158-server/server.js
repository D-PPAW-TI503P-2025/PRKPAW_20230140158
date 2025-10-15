const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware umum
app.use(cors());
app.use(express.json());

// Middleware logging (biar kelihatan setiap request di terminal)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route utama
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Import router books (pastikan folder = "router" dan file = books.js)
const bookRoutes = require('./router/books');
app.use('/api/books', bookRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
