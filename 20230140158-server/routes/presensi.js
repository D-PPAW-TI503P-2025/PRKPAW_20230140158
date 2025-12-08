const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const permission = require("../middleware/permissionMiddleware");

// CHECK-IN
router.post(
  "/checkin",
  permission.authenticateToken,
  presensiController.upload.single("buktiFoto"),
  presensiController.CheckIn
);

// CHECK-OUT
router.post("/checkout", permission.authenticateToken, presensiController.CheckOut);

// REPORT → hanya admin yang boleh melihat
router.get(
  "/report",
  permission.authenticateToken,
  permission.isAdmin,
  presensiController.getDailyReport
);

// DELETE → hanya admin yang boleh hapus
router.delete(
  "/:id",
  permission.authenticateToken,
  permission.isAdmin,
  presensiController.deletePresensi
);

module.exports = router;
