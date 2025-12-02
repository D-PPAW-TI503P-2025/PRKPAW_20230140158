const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// Semua endpoint presensi harus melalui JWT
router.use(authenticateToken);

router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);
router.get("/report", presensiController.getDailyReport);

module.exports = router;
