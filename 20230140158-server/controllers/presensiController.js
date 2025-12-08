const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");

// MODEL
const { Presensi, User } = require("../models");

// KONFIGURASI UPLOAD FOTO
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// ===========================================================
// CHECK IN
// ===========================================================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    if (!req.file) {
      return res.status(400).json({
        message: "Foto tidak terkirim. Upload foto wajib!",
      });
    }

    const buktiFoto = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude dan Longitude wajib dikirim.",
      });
    }

    const existing = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah check-in dan belum check-out.",
      });
    }

    const record = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
      latitude,
      longitude,
      buktiFoto,
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil.`,
      data: record,
    });
  } catch (error) {
    console.error("CHECKIN SERVER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===========================================================
// CHECK OUT
// ===========================================================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari presensi yang belum checkout
    const record = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!record) {
      return res.status(404).json({
        message: "Anda belum check-in atau sudah check-out."
      });
    }

    // Set waktu check-out
    record.checkOut = waktuSekarang;
    await record.save();

    return res.json({
      message: `Check-out berhasil untuk ${userName}.`,
      data: record
    });
  } catch (error) {
    console.error("CHECKOUT SERVER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// ===========================================================
// REPORT HARIAN
// ===========================================================
exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    const filter = {};
    if (nama) {
      filter["$user.nama$"] = { [Op.like]: `%${nama}%` };
    }

    const data = await Presensi.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"],
        },
      ],
      order: [["checkIn", "DESC"]],
    });

    res.json({
      message: "Laporan presensi berhasil diambil.",
      data,
    });
  } catch (error) {
    console.error("REPORT SERVER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===========================================================
// DELETE PRESENSI
// ===========================================================
exports.deletePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan." });
    }

    await record.destroy();

    return res.json({ message: "Data presensi berhasil dihapus." });
  } catch (error) {
    console.error("DELETE SERVER ERROR:", error);
    return res.status(500).json({
      message: "Gagal menghapus presensi",
      error: error.message,
    });
  }
};
