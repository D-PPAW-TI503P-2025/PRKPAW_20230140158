const jwt = require("jsonwebtoken");

// PENTING: sama persis dengan yang di authController.js
const JWT_SECRET = "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

exports.authenticateToken = (req, res, next) => {
  // ambil header "authorization" (case-insensitive)
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.log("JWT VERIFY ERROR:", err.message);
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Akses ditolak. Hanya untuk admin." });
};
