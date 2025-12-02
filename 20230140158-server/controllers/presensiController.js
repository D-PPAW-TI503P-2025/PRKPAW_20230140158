const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

// ===========================================================
// CHECK IN
// ===========================================================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

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
        message: "Anda sudah check-in hari ini.",
      });
    }

    const record = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil.`,
      data: record,
    });
  } catch (error) {
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
    const { id: userId } = req.user;
    const waktuSekarang = new Date();

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res.status(404).json({
        message: "Tidak ada check-in aktif.",
      });
    }

    record.checkOut = waktuSekarang;
    await record.save();

    res.json({
      message: "Check-out berhasil.",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===========================================================
// UPDATE
// ===========================================================
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({
        message: "Presensi tidak ditemukan.",
      });
    }

    if (checkIn) record.checkIn = new Date(checkIn);
    if (checkOut) record.checkOut = new Date(checkOut);

    await record.save();

    res.json({
      message: "Presensi berhasil diupdate",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===========================================================
// DELETE
// ===========================================================
exports.deletePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;

    const record = await Presensi.findByPk(presensiId);
    if (!record) {
      return res.status(404).json({
        message: "Presensi tidak ditemukan.",
      });
    }

    await record.destroy();

    res.json({ message: "Presensi berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
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
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
