const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 5001;

// ROUTES
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const ruteBuku = require("./routes/books");
const iotRoutes = require("./routes/iot");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// STATIC – penting untuk akses foto!
app.use("/uploads", express.static("uploads"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// REGISTER ROUTES
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iot", iotRoutes);

// RUN SERVER
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
